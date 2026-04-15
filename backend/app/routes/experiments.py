"""Experiment endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from app.auth import get_current_user
from app.database import get_supabase_client

router = APIRouter()


class ExperimentInfo(BaseModel):
    """Experiment information."""
    id: str
    title: str
    description: str
    course: str
    created_at: str


class ExperimentProgress(BaseModel):
    """Student's progress on an experiment."""
    experiment_id: str
    status: str  # "pending", "in_progress", "completed"
    progress: float  # 0-100
    quiz_score: Optional[float] = None
    completed_at: Optional[str] = None


@router.get("/", response_model=List[ExperimentInfo])
async def list_experiments(
    course: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """List all experiments, optionally filtered by course."""
    try:
        supabase = get_supabase_client()
        
        # TODO: Fetch experiments from Supabase
        # Sample data for development
        experiments = [
            {
                "id": "exp-1",
                "title": "Sorting Algorithms",
                "description": "Implement and compare different sorting algorithms: bubble sort, quicksort, mergesort. Analyze their time and space complexity.",
                "course": "CS201",
                "created_at": "2024-01-01T00:00:00"
            },
            {
                "id": "exp-2",
                "title": "Binary Search Trees",
                "description": "Implement BST operations including insertion, deletion, and traversal. Study the impact of tree balancing on performance.",
                "course": "CS201",
                "created_at": "2024-01-02T00:00:00"
            },
            {
                "id": "exp-3",
                "title": "Hash Tables",
                "description": "Design and implement hash tables with collision resolution strategies. Compare linear probing, chaining, and double hashing.",
                "course": "CS201",
                "created_at": "2024-01-03T00:00:00"
            },
        ]
        
        if course:
            experiments = [e for e in experiments if e["course"] == course]
        
        return experiments
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch experiments: {str(e)}"
        )


@router.get("/{experiment_id}", response_model=ExperimentInfo)
async def get_experiment(
    experiment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get details of a specific experiment."""
    try:
        supabase = get_supabase_client()
        
        # TODO: Fetch specific experiment from Supabase
        
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experiment not found"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch experiment: {str(e)}"
        )


@router.post("/{experiment_id}/start")
async def start_experiment(
    experiment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Start an experiment (student begins working on it)."""
    try:
        user_id = current_user.get("sub")
        supabase = get_supabase_client()
        
        # TODO: Create experiment_submission record in Supabase
        
        return {
            "message": "Experiment started",
            "experiment_id": experiment_id,
            "status": "in_progress"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start experiment: {str(e)}"
        )


@router.get("/{experiment_id}/progress", response_model=ExperimentProgress)
async def get_experiment_progress(
    experiment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get student's progress on an experiment."""
    try:
        user_id = current_user.get("sub")
        supabase = get_supabase_client()
        
        # TODO: Fetch progress from Supabase
        
        return ExperimentProgress(
            experiment_id=experiment_id,
            status="pending",
            progress=0.0,
            quiz_score=None
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch progress: {str(e)}"
        )


@router.post("/{experiment_id}/complete")
async def complete_experiment(
    experiment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Mark an experiment as completed."""
    try:
        user_id = current_user.get("sub")
        supabase = get_supabase_client()
        
        # TODO: Update experiment_submission status to "completed"
        
        return {
            "message": "Experiment completed",
            "experiment_id": experiment_id,
            "status": "completed"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete experiment: {str(e)}"
        )


# Professor routes

@router.get("/professor/class/students")
async def get_class_students(
    current_user: dict = Depends(get_current_user)
):
    """Get list of students for professor's class."""
    try:
        user_id = current_user.get("sub")
        role = current_user.get("role")
        
        if role != "professor":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only professors can access this endpoint"
            )
        
        # TODO: Fetch students assigned to professor's class
        
        return {
            "students": [],
            "total": 0
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch students: {str(e)}"
        )


@router.get("/professor/analytics/{course_id}")
async def get_class_analytics(
    course_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get class-wide analytics for a course."""
    try:
        user_id = current_user.get("sub")
        role = current_user.get("role")
        
        if role != "professor":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only professors can access this endpoint"
            )
        
        # TODO: Calculate and return class analytics
        
        return {
            "course_id": course_id,
            "total_students": 0,
            "avg_completion": 0.0,
            "pending_count": 0
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch analytics: {str(e)}"
        )
