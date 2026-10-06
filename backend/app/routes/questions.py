import random
import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db
from ..models import Question, User
from ..schemas import (
    QuestionCreate,
    QuestionResponse,
    QuestionAnswerRequest,
    DashboardResponse,
    ALLOWED_CATEGORIES,
)
from ..auth import get_current_user

router = APIRouter(prefix="/api", tags=["Questions"])


def generate_reference_id() -> str:
    """Generate a clean, professional reference ID like CSH-2026-4821."""
    year = datetime.datetime.utcnow().year
    suffix = random.randint(1000, 9999)
    return f"CSH-{year}-{suffix}"


@router.post("/questions", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def submit_question(
    question_in: QuestionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submit a basic cyber-safety question to the community helpdesk.
    Generates a unique reference ID and stores the question linked to current user.
    """
    if question_in.category not in ALLOWED_CATEGORIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Allowed categories are: {', '.join(ALLOWED_CATEGORIES)}",
        )

    # Ensure unique ID
    for _ in range(5):
        ref_id = generate_reference_id()
        existing = db.query(Question).filter(Question.id == ref_id).first()
        if not existing:
            break
    else:
        ref_id = f"CSH-{int(datetime.datetime.utcnow().timestamp())}"

    new_question = Question(
        id=ref_id,
        user_id=current_user.id,
        category=question_in.category,
        question=question_in.question.strip(),
        status="Pending",
        response=None,
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question


@router.get("/questions", response_model=List[QuestionResponse])
def get_my_questions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Display only the questions submitted by the currently logged-in user.
    Enforces user isolation requirement.
    """
    questions = (
        db.query(Question)
        .filter(Question.user_id == current_user.id)
        .order_by(desc(Question.created_at))
        .all()
    )
    return questions


@router.get("/questions/{question_id}", response_model=QuestionResponse)
def get_question_detail(
    question_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve details of a single question.
    Strictly verifies that the question belongs to the requesting user.
    """
    question = (
        db.query(Question)
        .filter(Question.id == question_id, Question.user_id == current_user.id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found or you do not have permission to view it.",
        )

    return question


@router.get("/dashboard/stats", response_model=DashboardResponse)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fetch user summary and recent questions for the Dashboard view.
    """
    user_questions = (
        db.query(Question)
        .filter(Question.user_id == current_user.id)
        .order_by(desc(Question.created_at))
        .all()
    )

    total = len(user_questions)
    pending = sum(1 for q in user_questions if q.status == "Pending")
    answered = sum(1 for q in user_questions if q.status == "Answered")
    recent = user_questions[:5]

    return {
        "user": current_user,
        "total_questions": total,
        "pending_questions": pending,
        "answered_questions": answered,
        "recent_questions": recent,
    }


@router.post("/questions/{question_id}/respond", response_model=QuestionResponse)
def respond_to_question(
    question_id: str,
    answer_in: QuestionAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Demonstration endpoint:
    Allows community helpdesk volunteer or evaluator during project presentation
    to add verified guidance to any question and mark it 'Answered'.
    """
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found.",
        )

    question.response = answer_in.response.strip()
    question.status = "Answered"
    question.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(question)
    return question
