from datetime import datetime

from pydantic import BaseModel, EmailStr


# What the API accepts when creating a lead (incoming request)
class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    company: str | None = None
    message: str


# What the API returns after saving a lead (outgoing response)
class LeadResponse(BaseModel):
    id: int
    name: str
    email: str
    company: str | None
    message: str
    classification: str | None
    score: float | None
    ai_reason: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
