from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    profile_picture: Optional[str] = None


class UserCreate(UserBase):
    google_id: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Question Schemas
ALLOWED_CATEGORIES = [
    "Phishing",
    "Online Banking",
    "UPI & Payment Safety",
    "Social Media Safety",
    "Password Security",
    "Privacy",
    "Online Scams",
    "Cyberbullying",
    "Suspicious Links",
    "Other",
]


class QuestionCreate(BaseModel):
    category: str = Field(..., description="Category of the cyber safety query")
    question: str = Field(..., min_length=10, max_length=2000, description="Description of the question")


class QuestionResponse(BaseModel):
    id: str
    user_id: int
    category: str
    question: str
    status: str
    response: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuestionAnswerRequest(BaseModel):
    response: str = Field(..., min_length=5, description="Community helpdesk guidance response")


class DashboardResponse(BaseModel):
    user: UserResponse
    total_questions: int
    pending_questions: int
    answered_questions: int
    recent_questions: List[QuestionResponse]
