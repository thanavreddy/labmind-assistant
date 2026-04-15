"""AI service for integrating with OpenAI API."""

import openai
from typing import Optional
from app.config import get_settings

settings = get_settings()
openai.api_key = settings.openai_api_key


class AIService:
    """Service for AI chat interactions."""
    
    @staticmethod
    async def get_ai_response(
        messages: list,
        model: str = "gpt-3.5-turbo",
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> str:
        """
        Get response from OpenAI API.
        
        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Model to use (default: gpt-3.5-turbo)
            temperature: Creativity level (0-2)
            max_tokens: Max response length
            
        Returns:
            AI response text
        """
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Failed to get AI response: {str(e)}")
    
    @staticmethod
    async def evaluate_quiz_answer(
        question: str,
        student_answer: str,
        expected_key_points: Optional[list] = None,
    ) -> dict:
        """
        Evaluate student's open-ended quiz answer using AI.
        
        Args:
            question: The quiz question
            student_answer: Student's answer
            expected_key_points: Optional list of expected key points
            
        Returns:
            Dictionary with score, feedback, and key_points_covered
        """
        prompt = f"""You are an expert evaluator. Evaluate this answer:

Question: {question}

Student Answer: {student_answer}

{"Expected Key Points: " + ", ".join(expected_key_points) if expected_key_points else ""}

Provide evaluation in this exact JSON format:
{{
    "score": <0-100>,
    "feedback": "<constructive feedback>",
    "key_points_covered": [<list of covered points>],
    "missing_points": [<list of missing points>]
}}

Only respond with valid JSON, no additional text."""

        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=500,
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            raise Exception(f"Failed to evaluate answer: {str(e)}")
    
    @staticmethod
    async def generate_lab_record_guidance(
        experiment_title: str,
        experiment_description: str,
    ) -> dict:
        """
        Generate guidance for each section of a lab record.
        
        Args:
            experiment_title: Title of the experiment
            experiment_description: Description of the experiment
            
        Returns:
            Dictionary with guidance for each section
        """
        prompt = f"""Generate guidance for completing a lab record for this experiment:

Title: {experiment_title}
Description: {experiment_description}

Provide guidance in JSON format with keys: aim, theory, algorithm, code, output, conclusion

Each should contain helpful bullet points explaining what should be included.

Example format:
{{
    "aim": ["Point 1", "Point 2", ...],
    "theory": ["Point 1", "Point 2", ...],
    ...
}}

Only respond with valid JSON."""

        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1000,
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            raise Exception(f"Failed to generate guidance: {str(e)}")
