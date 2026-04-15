"""Main API router aggregating all routes."""

from fastapi import APIRouter
from app.routes import quiz, chat, lab_records, experiments, health

router = APIRouter(prefix="/api")

# Include subroutes
router.include_router(health.router, tags=["health"])
router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
router.include_router(lab_records.router, prefix="/records", tags=["lab-records"])
router.include_router(experiments.router, prefix="/experiments", tags=["experiments"])
