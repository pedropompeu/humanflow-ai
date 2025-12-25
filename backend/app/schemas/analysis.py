from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class AnalysisCreate(BaseModel):
    code: str
    repository_id: UUID


class AnalysisResponse(BaseModel):
    id: UUID
    repository_id: UUID
    debt_score: float
    summary: Optional[str] = None
    code_content: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class FixResponse(BaseModel):
    fixed_code: str
