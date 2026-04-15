"""Chat/AI assistant endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from pydantic import BaseModel
from app.auth import get_current_user
from app.services import AIService
from app.database import get_supabase_client

router = APIRouter()


class ChatMessage(BaseModel):
    """Chat message request."""
    content: str
    experiment_id: str


class ChatResponse(BaseModel):
    """Chat response."""
    message: str
    role: str = "assistant"


@router.post("/send", response_model=ChatResponse)
async def send_message(
    message: ChatMessage,
    current_user: dict = Depends(get_current_user)
):
    """
    Send a message to the AI assistant.
    
    The AI provides step-by-step explanations for concept questions.
    """
    try:
        user_id = current_user.get("sub")
        
        # TODO: Fetch conversation history from Supabase
        # For now, starting fresh conversation
        messages = [
            {
                "role": "system",
                "content": "You are a helpful AI tutor assisting students with lab concepts. Provide clear, step-by-step explanations. Keep responses concise but thorough."
            },
            {
                "role": "user",
                "content": message.content
            }
        ]
        
        # Get AI response
        ai_response = await AIService.get_ai_response(messages)
        
        # TODO: Save conversation to Supabase
        
        return ChatResponse(message=ai_response)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process chat message: {str(e)}"
        )


@router.get("/history/{experiment_id}")
async def get_chat_history(
    experiment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get chat history for an experiment."""
    try:
        supabase = get_supabase_client()
        user_id = current_user.get("sub")
        
        # TODO: Implement chat history retrieval from Supabase
        # For now, returning empty history
        
        return {
            "history": [],
            "experiment_id": experiment_id
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch chat history: {str(e)}"
        )
