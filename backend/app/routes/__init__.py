from fastapi import APIRouter
from app.routes import health, chat, quiz, lab_records, experiments

router = APIRouter()

router.include_router(health.router, prefix="/health")
router.include_router(chat.router, prefix="/chat")
router.include_router(quiz.router, prefix="/quiz")
router.include_router(lab_records.router, prefix="/lab-records")
router.include_router(experiments.router, prefix="/experiments")