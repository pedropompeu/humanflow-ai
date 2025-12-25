from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class RepositoryBase(BaseModel):
    name: str
    url: str
    description: Optional[str] = None


class RepositoryCreate(RepositoryBase):
    owner_id: UUID  # Temporário até implementar Auth JWT


class RepositoryResponse(RepositoryBase):
    id: UUID
    owner_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}
