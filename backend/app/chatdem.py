from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from collections import deque
import openai

router = APIRouter(prefix="/dem")

# -------------------------------
# Data
# -------------------------------
SUBJECTS = {
    "dsa": ["Bubble Sort", "Merge Sort", "Binary Search"],
    "compiler design": ["Lexical Analysis", "LL(1) Parsing"],
    "operating systems": ["FCFS Scheduling", "Round Robin"],
    "computer networks": ["Star Topology", "TCP Protocol"]
}

chat_memory = deque(maxlen=3)


# -------------------------------
# Schemas
# -------------------------------
class ChatRequest(BaseModel):
    subject: str
    experiment: str
    message: str


# -------------------------------
# Routes
# -------------------------------

@router.get("/subjects")
def get_subjects():
    return {"subjects": list(SUBJECTS.keys())}


@router.get("/experiments/{subject}")
def get_experiments(subject: str):
    subject = subject.lower().strip()

    if subject not in SUBJECTS:
        raise HTTPException(
            status_code=404,
            detail="Subject not added yet"
        )

    return {
        "subject": subject,
        "experiments": SUBJECTS[subject]
    }


@router.post("/chat")
def chat(req: ChatRequest):

    system_prompt = f"""
    LabMind, your personal Lab assistant.
    Subject: {req.subject}
    Experiment: {req.experiment}
    """

    chat_memory.append({"role": "user", "content": req.message})

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(list(chat_memory))

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=messages
    )

    reply = response.choices[0].message.content

    chat_memory.append({"role": "assistant", "content": reply})

    return {"reply": reply}