"""
Features Router - Extract, generate, validate features
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from services.ai_service import AIService
from models.schemas import FeatureListResponse, ProjectRequest, CompetitorAnalysisResponse
import tempfile
import os

router = APIRouter()

# Dependencies
ai_service = AIService()

class FeatureRequest(BaseModel):
    project_name: str
    description: str

class PDFExtractRequest(BaseModel):
    project_name: str

# 1. Generate features from project description
@router.post("/generate", response_model=FeatureListResponse)
async def generate_features(request: FeatureRequest):
    """Generate features from project description using AI"""
    try:
        features = await ai_service.extract_features_from_text(
            f"Project: {request.project_name}\nDescription: {request.description}"
        )
        return FeatureListResponse(
            project_name=request.project_name,
            features=features,
            total_features=len(features)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feature generation failed: {str(e)}")

# 2. Extract features from PDF
@router.post("/extract-pdf", response_model=FeatureListResponse)
async def extract_features_from_pdf(
    pdf_file: UploadFile = File(...),
    project_name: str = "Untitled Project"
):
    """Extract features from uploaded PDF specification"""
    try:
        # Save uploaded file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            content = await pdf_file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        # TODO: Implement PDF parsing (pdf_parser.py)
        # For now, return mock features
        features = [
            {"id": "f1", "name": "User Authentication", "description": "Login/logout system"},
            {"id": "f2", "name": "Dashboard", "description": "Main user interface"},
        ]
        
        os.unlink(tmp_path)
        return FeatureListResponse(
            project_name=project_name,
            features=features,
            total_features=len(features)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {str(e)}")

# 3. Competitor analysis
@router.post("/competitors", response_model=CompetitorAnalysisResponse)
async def analyze_competitors(request: FeatureRequest):
    """Analyze competitors and suggest enhancements"""
    try:
        analysis = await ai_service.analyze_competitors(
            project_name=request.project_name,
            description=request.description
        )
        return CompetitorAnalysisResponse(**analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Competitor analysis failed: {str(e)}")

# 4. Validate feature list
@router.post("/validate", response_model=dict)
async def validate_features(features: List[str]):
    """Validate feature list for completeness and feasibility"""
    if len(features) == 0:
        raise HTTPException(status_code=400, detail="No features provided")
    
    # Basic validation rules
    issues = []
    if len(features) > 50:
        issues.append("Too many features (>50). Consider grouping related features.")
    
    return {
        "valid": len(issues) == 0,
        "issues": issues,
        "feature_count": len(features),
        "recommendations": ["Ensure features are at least 10 hours of work each"]
    }
