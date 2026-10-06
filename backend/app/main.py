import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import engine, Base
from .routes import auth, questions

load_dotenv()

# Create SQLite tables automatically on start
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Community Cyber Safety Helpdesk API",
    description="Backend API for B.Sc. IT Semester V Community Engagement Project",
    version="1.0.0",
)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Configure CORS strictly for the React frontend
origins = [
    FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(auth.router)
app.include_router(questions.router)


@app.get("/")
def read_root():
    return {
        "project": "Community Cyber Safety Helpdesk",
        "academic_context": "B.Sc. IT Semester V Community Engagement Project",
        "status": "online",
        "endpoints": {
            "auth_google": "/auth/google/login",
            "auth_me": "/auth/me",
            "auth_logout": "/auth/logout",
            "questions": "/api/questions",
            "docs": "/docs",
        },
    }
