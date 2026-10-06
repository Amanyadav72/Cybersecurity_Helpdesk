import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    google_id = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    profile_picture = Column(String(1024), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship to user questions
    questions = relationship("Question", back_populates="user", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(64), primary_key=True, index=True)  # Reference ID e.g. CSH-2026-1001
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category = Column(String(128), nullable=False)
    question = Column(Text, nullable=False)
    status = Column(String(32), default="Pending", nullable=False)  # "Pending" | "Answered"
    response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationship to user
    user = relationship("User", back_populates="questions")
