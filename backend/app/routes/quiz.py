"""Quiz/comprehension check endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
from app.auth import get_current_user
from app.services import AIService
from app.database import get_supabase_client

router = APIRouter()


class QuizQuestion(BaseModel):
    """Quiz question response."""
    id: str
    question: str
    is_open_ended: bool = True


class QuizAnswer(BaseModel):
    """Single answer in quiz submission."""
    question_id: str
    answer: str


class QuizSubmission(BaseModel):
    """Quiz submission request."""
    experiment_id: str
    answers: List[QuizAnswer]


class QuizResult(BaseModel):
    """Quiz result response."""
    score: float
    passed: bool
    answers_evaluated: List[dict]


@router.get("/questions/{experiment_id}", response_model=List[QuizQuestion])
async def get_quiz_questions(
    experiment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get quiz questions for an experiment."""
    try:
        supabase = get_supabase_client()
        
        # TODO: Fetch questions from Supabase
        # For now, returning sample questions
        sample_questions = [
            {
                "id": "q1",
                "question": "Explain the time complexity of bubble sort and why it's inefficient for large datasets.",
                "is_open_ended": True
            },
            {
                "id": "q2",
                "question": "What is the difference between stable and unstable sorting algorithms? Give examples.",
                "is_open_ended": True
            },
            {
                "id": "q3",
                "question": "Describe how mergesort works and why it's more efficient than bubble sort.",
                "is_open_ended": True
            },
            {
                "id": "q4",
                "question": "Why is quicksort considered 'quick'? What is its average time complexity?",
                "is_open_ended": True
            },
            {
                "id": "q5",
                "question": "When would you choose insertion sort over quicksort? Explain your reasoning.",
                "is_open_ended": True
            }
        ]
        
        return sample_questions
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch quiz questions: {str(e)}"
        )


@router.post("/submit", response_model=QuizResult)
async def submit_quiz(
    submission: QuizSubmission,
    current_user: dict = Depends(get_current_user)
):
    """
    Submit quiz answers for evaluation.
    
    Uses AI to evaluate open-ended answers and calculate score.
    """
    try:
        user_id = current_user.get("sub")
        
        answers_evaluated = []
        total_score = 0
        
        # Evaluate each answer using AI
        for answer in submission.answers:
            evaluation = await AIService.evaluate_quiz_answer(
                question=f"Question {answer.question_id}",  # TODO: Fetch actual question
                student_answer=answer.answer
            )
            
            answers_evaluated.append({
                "question_id": answer.question_id,
                "score": evaluation.get("score", 0),
                "feedback": evaluation.get("feedback", ""),
                "key_points_covered": evaluation.get("key_points_covered", [])
            })
            
            total_score += evaluation.get("score", 0)
        
        # Calculate average score
        average_score = total_score / len(submission.answers) if submission.answers else 0
        passed = average_score >= 60  # Passing score is 60%
        
        # TODO: Save submission to Supabase
        
        return QuizResult(
            score=average_score,
            passed=passed,
            answers_evaluated=answers_evaluated
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit quiz: {str(e)}"
        )


@router.get("/score/{experiment_id}")
async def get_quiz_score(
    experiment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get student's quiz score for an experiment."""
    try:
        user_id = current_user.get("sub")
        
        # TODO: Fetch quiz score from Supabase
        
        return {
            "experiment_id": experiment_id,
            "score": None,
            "passed": False,
            "message": "Quiz not yet submitted"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch quiz score: {str(e)}"
        )
