from datetime import datetime
from typing import List
from uuid import UUID

import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_db
from app.core.config import settings
from app.models.analysis import AnalysisReport
from app.models.repository import Repository
from app.schemas.analysis import AnalysisResponse, FixResponse
from app.services.ai_analyzer import analyze_code

router = APIRouter()

genai.configure(api_key=settings.GOOGLE_API_KEY)


class AnalyzeRequest(BaseModel):
    code: str
    repository_id: UUID


class HistoryItem(BaseModel):
    id: UUID
    repository_name: str
    score: int | None
    summary: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ReportDetail(BaseModel):
    id: UUID
    repository_name: str
    score: int | None
    summary: str | None
    issues: list[str]
    code_content: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


@router.post("/analyze", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def analyze(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
):
    """Analisa código usando IA e salva o resultado."""
    # Verificar se repositório existe
    result = await db.execute(
        select(Repository).where(Repository.id == request.repository_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repositório não encontrado",
        )

    # Analisar código com IA
    analysis_result = await analyze_code(request.code)

    # Salvar resultado com código original
    report = AnalysisReport(
        repository_id=request.repository_id,
        debt_score=analysis_result.get("score", 0),
        summary=analysis_result.get("summary", ""),
        code_content=request.code,
        full_report=analysis_result,
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)

    return report


@router.get("/report/{report_id}", response_model=ReportDetail)
async def get_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Retorna detalhes de um relatório específico."""
    result = await db.execute(
        select(AnalysisReport)
        .where(AnalysisReport.id == report_id)
        .options(selectinload(AnalysisReport.repository))
    )
    
    report = result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relatório não encontrado",
        )
    
    # Extrair issues do full_report
    issues = []
    if report.full_report and isinstance(report.full_report, dict):
        issues = report.full_report.get("issues", [])
    
    return ReportDetail(
        id=report.id,
        repository_name=report.repository.name,
        score=report.debt_score,
        summary=report.summary,
        issues=issues,
        code_content=report.code_content,
        created_at=report.created_at,
    )


@router.post("/report/{report_id}/fix", response_model=FixResponse)
async def fix_code(
    report_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Gera código corrigido usando IA."""
    # Buscar relatório
    result = await db.execute(
        select(AnalysisReport).where(AnalysisReport.id == report_id)
    )
    report = result.scalar_one_or_none()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relatório não encontrado",
        )
    
    if not report.code_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Código original não disponível",
        )
    
    # Extrair issues
    issues = []
    if report.full_report and isinstance(report.full_report, dict):
        issues = report.full_report.get("issues", [])
    
    issues_text = "\n".join(f"- {issue}" for issue in issues) if issues else "Nenhum problema específico listado."
    
    # Gerar correção com IA
    try:
        model = genai.GenerativeModel("gemini-pro")
        
        prompt = f"""Atue como um Engenheiro de Software Sênior. Você receberá um código com problemas e uma lista de falhas. Sua tarefa é reescrever o código corrigindo todos os problemas citados. Retorne APENAS o código corrigido, sem markdown (```), sem explicações extras.

Código:
{report.code_content}

Problemas:
{issues_text}"""
        
        response = model.generate_content(prompt)
        fixed_code = response.text.strip()
        
        # Remover markdown se presente
        if fixed_code.startswith("```python"):
            fixed_code = fixed_code[9:]
        if fixed_code.startswith("```"):
            fixed_code = fixed_code[3:]
        if fixed_code.endswith("```"):
            fixed_code = fixed_code[:-3]
        
        return FixResponse(fixed_code=fixed_code.strip())
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao gerar correção: {str(e)}",
        )


@router.get("/history/{user_id}", response_model=List[HistoryItem])
async def get_history(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Retorna histórico de análises do usuário."""
    result = await db.execute(
        select(AnalysisReport)
        .join(Repository)
        .where(Repository.owner_id == user_id)
        .options(selectinload(AnalysisReport.repository))
        .order_by(AnalysisReport.created_at.desc())
    )
    
    reports = result.scalars().all()
    
    return [
        HistoryItem(
            id=report.id,
            repository_name=report.repository.name,
            score=report.debt_score,
            summary=report.summary,
            created_at=report.created_at,
        )
        for report in reports
    ]
