from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    company: Mapped[str] = mapped_column(String, nullable=True)
    message: Mapped[str] = mapped_column(String, nullable=False)

    # AI analysis results
    classification: Mapped[str] = mapped_column(String, nullable=True)  # "hot" or "cold"
    score: Mapped[float] = mapped_column(Float, nullable=True)          # 1-10
    ai_reason: Mapped[str] = mapped_column(String, nullable=True)       # AI explanation

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
