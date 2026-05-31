from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadResponse
from app.services.ai_analyzer import analyze_lead
from app.services.hubspot import push_to_hubspot

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("/", response_model=LeadResponse, status_code=201)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    # Step 1: save the lead to DB first (without AI results)
    db_lead = Lead(
        name=lead.name,
        email=lead.email,
        company=lead.company,
        message=lead.message,
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)

    # Step 2: analyze with OpenAI
    analysis = analyze_lead(
        name=lead.name,
        company=lead.company,
        message=lead.message,
    )

    # Step 3: update the lead with AI results
    db_lead.classification = analysis["classification"]
    db_lead.score = analysis["score"]
    db_lead.ai_reason = analysis["ai_reason"]
    db.commit()
    db.refresh(db_lead)

    # Step 4: push to HubSpot (mock)
    push_to_hubspot(db_lead)

    return db_lead


@router.get("/", response_model=list[LeadResponse])
def get_leads(db: Session = Depends(get_db)):
    return db.query(Lead).order_by(Lead.created_at.desc()).all()


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead
