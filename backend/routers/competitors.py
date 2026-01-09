"""
Competitor Router - Handle competitor research and feature suggestions
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from services.competitor_service import CompetitorService

router = APIRouter()
competitor_service = CompetitorService()

class ResearchRequest(BaseModel):
    project_name: str
    description: str

class ResearchResponse(BaseModel):
    competitors: List[Dict]
    enhancements: List[Dict]

class FeatureGenerationRequest(BaseModel):
    project_name: str
    description: str
    competitors: List[Dict]
    enhancements: List[Dict]

class FeatureGenerationResponse(BaseModel):
    features: List[Dict]

@router.post("/research", response_model=ResearchResponse)
async def research_competitors(request: ResearchRequest):
    """
    Research competitors and get enhancement suggestions
    """
    try:
        result = await competitor_service.research_competitors(
            request.project_name,
            request.description
        )
        
        return ResearchResponse(
            competitors=result.get("competitors", []),
            enhancements=result.get("enhancements", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Research failed: {str(e)}")

@router.post("/generate-features", response_model=FeatureGenerationResponse)
async def generate_features(request: FeatureGenerationRequest):
    """
    Generate initial feature list based on research
    """
    try:
        features = await competitor_service.generate_feature_list(
            request.project_name,
            request.description,
            request.competitors,
            request.enhancements
        )
        
        return FeatureGenerationResponse(features=features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feature generation failed: {str(e)}")
