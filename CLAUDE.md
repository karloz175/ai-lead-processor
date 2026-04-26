# AI Lead Processor — Collaboration Guide

## Collaboration style
- "Vibe code with me" — propose, explain, wait for approval, then build
- Explain every decision as if to a first-time builder (novice-friendly)
- Do one thing at a time, show the code, wait for approval before the next step
- Ask when anything is unclear

## Model
- Claude Sonnet 4.6, medium thinking effort

## Tech stack
| Layer | Technology | Why |
|---|---|---|
| Backend | Python + FastAPI | Simple, fast, modern Python API framework |
| AI | OpenAI API | Lead scoring and hot/cold classification |
| Database | SQLite + SQLAlchemy | Zero-config DB, Python ORM for clean code |
| Validation | Pydantic | Automatic request/response validation |
| Frontend | React + Vite + TypeScript | Fast dev experience, type safety |
| CRM | HubSpot (mock for now) | Simulate real CRM integration |

## Core flow
```
POST /lead → validate (Pydantic) → analyze (OpenAI) → save (SQLite) → notify (mock HubSpot) → return result
```

## Project structure
```
ai-lead-processor/
├── CLAUDE.md                    ← you are here
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entrypoint
│   │   ├── config.py            # Settings (env vars)
│   │   ├── database.py          # SQLite + SQLAlchemy setup
│   │   ├── dependencies.py      # Shared FastAPI dependencies (DB session)
│   │   ├── models/
│   │   │   └── lead.py          # SQLAlchemy ORM model (DB table shape)
│   │   ├── schemas/
│   │   │   └── lead.py          # Pydantic schemas (API contract)
│   │   ├── routers/
│   │   │   └── leads.py         # Route handlers: POST /lead, GET /leads
│   │   └── services/
│   │       ├── ai_analyzer.py   # OpenAI call → classification + score
│   │       └── hubspot.py       # Mock HubSpot push
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── pages/
    │   │   ├── LeadList.tsx
    │   │   └── LeadDetail.tsx
    │   ├── components/
    │   │   └── LeadCard.tsx
    │   └── api/
    │       └── leads.ts          # Typed fetch wrapper
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

## Key rules
- Never commit `.env` files (they contain secrets like API keys)
- Schemas (Pydantic) = what the API accepts/returns
- Models (SQLAlchemy) = what the database stores
- Services = all business logic lives here, not in routers
- Frontend `api/` layer = all fetch calls go here, not inside components
