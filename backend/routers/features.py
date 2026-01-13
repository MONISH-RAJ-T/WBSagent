"""
Features Router - Extract, generate, validate features
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from services.ai_service import AIService
from services.pdf_service import PDFService
from models.schemas import FeatureListResponse, ProjectRequest, CompetitorAnalysisResponse, FlowGenerateRequest
import tempfile
import os

router = APIRouter()

# Dependencies
ai_service = AIService()
pdf_service = PDFService()

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
        
        # Process PDF and extract features
        result = await pdf_service.process_uploaded_pdf(tmp_path, project_name)
        
        # Cleanup temporary file
        try:
            os.unlink(tmp_path)
        except:
            pass
        
        # Check if processing was successful
        if not result.get("success", False):
            raise HTTPException(status_code=500, detail=result.get("error", "PDF processing failed"))
        
        features = result.get("features", [])
        
        # Log the features for debugging
        print(f"[PDF] Extracted {len(features)} features")
        if features:
            print(f"[PDF] Sample feature: {features[0]}")

        return FeatureListResponse(
            project_name=project_name,
            features=features,
            total_features=len(features)
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[PDF] ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
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

# 4. Generate Execution Flow (Dependencies)
@router.post("/flow", response_model=FeatureListResponse)
async def generate_flow(request: FlowGenerateRequest):
    """Generate execution flow/dependencies for features"""
    try:
        print(f"[FLOW] Received request for project: {request.project_name}")
        print(f"[FLOW] Number of features: {len(request.features)}")
        
        # Convert Feature objects to dicts for AI service
        features_dicts = [f.model_dump() for f in request.features]
        print(f"[FLOW] Successfully converted {len(features_dicts)} features to dicts")
        
        updated_features = await ai_service.extract_workflow_from_text(
            "\n".join([f"{f.name}: {f.description}" for f in request.features])
        )
        print(f"[FLOW] AI service returned {len(updated_features)} features")
        
        response = FeatureListResponse(
            project_name=request.project_name,
            features=updated_features,
            total_features=len(updated_features)
        )
        print(f"[FLOW] Successfully created response")
        return response
        
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        print(f"[FLOW ERROR] {error_detail}")
        raise HTTPException(status_code=500, detail=f"Flow generation failed: {str(e)}\n{error_detail}")

# 5. Validate feature list
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
