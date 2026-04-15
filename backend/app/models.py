"""Database models for LabMind using SQLAlchemy."""

from datetime import datetime
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    """User role enumeration."""
    STUDENT = "student"
    PROFESSOR = "professor"


class ExperimentStatus(str, Enum):
    """Experiment status enumeration."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


# Pydantic models for request/response

from pydantic import BaseModel, EmailStr


class ProfileBase(BaseModel):
    """Base profile model."""
    full_name: Optional[str] = None
    email: EmailStr
    role: UserRole
    department: Optional[str] = None


class ProfileCreate(ProfileBase):
    """Profile creation model."""
    pass


class Profile(ProfileBase):
    """Profile response model."""
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ExperimentBase(BaseModel):
    """Base experiment model."""
    title: str
    description: str
    course: str  # "CS201", "CS301", "CS302"
    
    
class ExperimentCreate(ExperimentBase):
    """Experiment creation model."""
    pass


class Experiment(ExperimentBase):
    """Experiment response model."""
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class ExperimentSubmissionBase(BaseModel):
    """Base experiment submission model."""
    student_id: str
    experiment_id: str
    status: ExperimentStatus = ExperimentStatus.PENDING
    progress: float = 0.0  # 0-100


class ExperimentSubmissionCreate(ExperimentSubmissionBase):
    """Experiment submission creation model."""
    pass


class ExperimentSubmission(ExperimentSubmissionBase):
    """Experiment submission response model."""
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ComprehensionAnswerBase(BaseModel):
    """Base comprehension answer model."""
    student_id: str
    experiment_id: str
    answers: dict  # JSON object with question_id: answer
    score: float  # 0-100


class ComprehensionAnswerCreate(ComprehensionAnswerBase):
    """Comprehension answer creation model."""
    pass


class ComprehensionAnswer(ComprehensionAnswerBase):
    """Comprehension answer response model."""
    id: str
    submitted_at: datetime
    
    class Config:
        from_attributes = True


class LabRecordBase(BaseModel):
    """Base lab record model."""
    student_id: str
    experiment_id: str
    aim: str
    theory: str
    algorithm: str
    code: str
    output: str
    conclusion: str


class LabRecordCreate(LabRecordBase):
    """Lab record creation model."""
    pass


class LabRecordUpdate(BaseModel):
    """Lab record update model (all fields optional)."""
    aim: Optional[str] = None
    theory: Optional[str] = None
    algorithm: Optional[str] = None
    code: Optional[str] = None
    output: Optional[str] = None
    conclusion: Optional[str] = None


class LabRecord(LabRecordBase):
    """Lab record response model."""
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AIMessageBase(BaseModel):
    """Base AI message model."""
    student_id: str
    experiment_id: str
    role: str  # "user" or "assistant"
    content: str


class AIMessageCreate(AIMessageBase):
    """AI message creation model."""
    pass


class AIMessage(AIMessageBase):
    """AI message response model."""
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class QuizQuestion(BaseModel):
    """Single quiz question."""
    id: str
    experiment_id: str
    question: str
    is_open_ended: bool = True


class QuizSubmission(BaseModel):
    """Quiz submission request."""
    student_id: str
    experiment_id: str
    answers: dict  # {question_id: answer_text}


class QuizResult(BaseModel):
    """Quiz result response."""
    student_id: str
    experiment_id: str
    score: float
    passed: bool
    answers: dict


class AIMessage(BaseModel):
    """Chat message request."""
    content: str
    student_id: str
    experiment_id: str
