"""AI service for integrating with OpenAI API."""

import json
from typing import Optional
import openai
from app.config import get_settings

settings = get_settings()

# Set API key (no client object → avoids proxy bug)
openai.api_key = settings.openai_api_key


class AIService:
    """Service for AI chat interactions."""

    @staticmethod
    async def get_ai_response(messages: list) -> str:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=500,
        )
        return response["choices"][0]["message"]["content"]
    
    @staticmethod
    async def get_or_create_experiment_convo(supabase, student_id, experiment_id):
        print("STEP 1: fetching existing convo")

        res = supabase.table("conversations") \
            .select("*") \
            .eq("student_id", student_id) \
            .eq("experiment_id", experiment_id) \
            .execute()

        print("FETCH RESULT:", res)

        if res and res.data:
            print("FOUND EXISTING")
            return res.data

        print("STEP 2: inserting convo")

        try:
            insert_res = supabase.table("conversations").insert({
                "student_id": student_id,
                "experiment_id": experiment_id,
                "type": "experiment"
            }).execute()

            print("INSERT RESPONSE:", insert_res)

        except Exception as e:
            print("INSERT ERROR:", repr(e))

        print("STEP 3: fetching after insert")

        res = supabase.table("conversations") \
            .select("*") \
            .eq("student_id", student_id) \
            .eq("experiment_id", experiment_id) \
            .execute()

        print("FINAL FETCH:", res)

        if not res.data:
            raise Exception("NO CONVERSATION FOUND AFTER INSERT")

        return res.data[0]

    @staticmethod
    async def get_conversation_messages(supabase, conversation_id):
        res = supabase.table("messages") \
            .select("*") \
            .eq("conversation_id", conversation_id) \
            .order("created_at") \
            .execute()

        return res.data or []

    @staticmethod
    async def save_message(supabase, conversation_id, role, content):
        supabase.table("messages").insert({
            "conversation_id": conversation_id,
            "role": role,
            "content": content
        }).execute()
    
    @staticmethod
    async def evaluate_quiz_answer(
        question: str,
        student_answer: str,
        expected_key_points: Optional[list] = None,
    ) -> dict:

        prompt = f"""You are an expert evaluator. Evaluate this answer:

Question: {question}

Student Answer: {student_answer}

{"Expected Key Points: " + ", ".join(expected_key_points) if expected_key_points else ""}

Provide evaluation in JSON format:
{{
    "score": <0-100>,
    "feedback": "<constructive feedback>",
    "key_points_covered": [],
    "missing_points": []
}}

Only respond with valid JSON."""

        try:
            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=500,
            )

            content = response.choices[0].message.content or "{}"
            return json.loads(content)

        except Exception as e:
            raise Exception(f"Failed to evaluate answer: {str(e)}")

    @staticmethod
    async def generate_lab_record_guidance(
        experiment_title: str,
        experiment_description: str,
    ) -> dict:

        prompt = f"""Generate guidance for completing a lab record:

Title: {experiment_title}
Description: {experiment_description}

Return JSON with keys:
aim, theory, algorithm, code, output, conclusion

Only valid JSON."""

        try:
            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=800,
            )

            content = response.choices[0].message.content or "{}"
            return json.loads(content)

        except Exception as e:
            raise Exception(f"Failed to generate guidance: {str(e)}")