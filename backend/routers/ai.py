"""
AI Router - Gemini API Testing
"""
from fastapi import APIRouter, HTTPException
from services.ai_service import AIService
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()
ai_service = AIService()

class ModelTestResponse(BaseModel):
    model: str
    status: str
    available: bool
    details: Dict[str, Any]

@router.post("/test-gemini", response_model=ModelTestResponse)
async def test_gemini():
    """Test Gemini API connection"""
    try:
        result = await ai_service.test_gemini_connection()
        return ModelTestResponse(
            model="gemini",
            status="success",
            available=True,
            details=result
        )
    except Exception as e:
        return ModelTestResponse(
            model="gemini",
            status="error",
            available=False,
            details={"error": str(e)}
        )

@router.get("/models")
async def list_models():
    """List available AI models"""
    from config import settings
    return {
        "gemini": [settings.GEMINI_MODEL] if settings.GEMINI_API_KEY else [],
        "active_model": settings.GEMINI_MODEL if settings.GEMINI_API_KEY else None
    }
