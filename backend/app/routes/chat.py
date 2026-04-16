"""Chat/AI assistant endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from pydantic import BaseModel
from app.auth import get_current_user
from app.services import AIService
from app.database import get_supabase_client

router = APIRouter()


class ChatMessage(BaseModel):
    content: str
    experiment_id: str
    conversation_id: str | None = None


class ChatResponse(BaseModel):
    """Chat response."""
    message: str
    role: str = "assistant"


@router.post("/send", response_model=ChatResponse)
async def send_message(
    message: ChatMessage,
    current_user: dict = Depends(get_current_user)
):
    try:
        supabase = get_supabase_client()
        student_id = current_user.get("sub")

        # 1. get/create convo
        convo = await AIService.get_or_create_experiment_convo(
            supabase,
            student_id,
            message.experiment_id
        )

        conversation_id = convo["id"]

        # 2. fetch history
        history = await AIService.get_conversation_messages(supabase, conversation_id)

        # 3. format for AI
        messages = [
            {"role": "system", "content": "You are a helpful lab assistant."}
        ]

        for msg in history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        # add current user message
        messages.append({
            "role": "user",
            "content": message.content
        })

        # 4. AI response
        ai_response = await AIService.get_ai_response(messages)

        # 5. save both messages
        await AIService.save_message(supabase, conversation_id, "user", message.content)
        await AIService.save_message(supabase, conversation_id, "assistant", ai_response)

        return ChatResponse(message=ai_response)

    except Exception as e:
        raise HTTPException(
            status_code=500,
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
