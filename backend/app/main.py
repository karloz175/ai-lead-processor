from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import leads

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

# Create the FastAPI app
app = FastAPI(
    title="AI Lead Processor",
    description="Processes and scores leads using OpenAI",
    version="0.1.0",
)

# Allow the React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(leads.router)


@app.get("/")
def root():
    return {"message": "AI Lead Processor is running"}
