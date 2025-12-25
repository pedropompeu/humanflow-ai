from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.repository import Repository
from app.models.user import User
from app.schemas.repository import RepositoryCreate, RepositoryResponse

router = APIRouter()


@router.post("/", response_model=RepositoryResponse, status_code=status.HTTP_201_CREATED)
async def create_repository(
    repo_in: RepositoryCreate,
    db: AsyncSession = Depends(get_db),
):
    """Cria um novo repositório para um usuário."""
    # Verificar se o owner existe
    result = await db.execute(select(User).where(User.id == repo_in.owner_id))
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado",
        )

    repository = Repository(
        name=repo_in.name,
        url=repo_in.url,
        owner_id=repo_in.owner_id,
    )
    db.add(repository)
    await db.commit()
    await db.refresh(repository)
    return repository


@router.get("/", response_model=List[RepositoryResponse])
async def list_repositories(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """Lista todos os repositórios."""
    result = await db.execute(select(Repository).offset(skip).limit(limit))
    return result.scalars().all()
