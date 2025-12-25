from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class AnalysisResponse(BaseModel):
    id: UUID
    repository_id: UUID
    debt_score: float
    summary: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
