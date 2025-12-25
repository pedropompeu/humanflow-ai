from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_db
from app.models.analysis import AnalysisReport
from app.models.repository import Repository
from app.schemas.analysis import AnalysisResponse
from app.services.ai_analyzer import analyze_code

router = APIRouter()


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

    # Salvar resultado
    report = AnalysisReport(
        repository_id=request.repository_id,
        debt_score=analysis_result.get("score", 0),
        summary=analysis_result.get("summary", ""),
        full_report=analysis_result,
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)

    return report


class ReportDetail(BaseModel):
    id: UUID
    repository_name: str
    score: int | None
    summary: str | None
    issues: list[str]
    created_at: datetime

    model_config = {"from_attributes": True}


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
        created_at=report.created_at,
    )


@router.get("/history/{user_id}", response_model=List[HistoryItem])
async def get_history(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Retorna histórico de análises do usuário."""
    # Buscar repositórios do usuário com suas análises
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
