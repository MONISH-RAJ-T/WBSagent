"""
WBS Router - Work Breakdown Structure Generation
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.wbs_engine import WBSEngine
from models.schemas import WBSResponse, WBSTask

router = APIRouter()
wbs_engine = WBSEngine()

class WBSGenerateRequest(BaseModel):
    project_name: str
    features: List[str]

@router.post("/generate", response_model=WBSResponse)
async def generate_wbs(request: WBSGenerateRequest):
    """Generate WBS from features using 8+2 rule"""
    try:
        wbs_data = await wbs_engine.generate_wbs(
            project_name=request.project_name,
            features=request.features
        )
        return WBSResponse(**wbs_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"WBS generation failed: {str(e)}")

@router.post("/validate", response_model=dict)
async def validate_wbs(tasks: List[WBSTask]):
    """Validate WBS structure and hours"""
    try:
        task_dicts = [task.dict() for task in tasks]
        validation = wbs_engine.validate_wbs(task_dicts)
        return validation
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/stats/{project_name}", response_model=dict)
async def get_wbs_stats(project_name: str):
    """Get WBS statistics for a project"""
    return {
        "project_name": project_name,
        "total_features": 0,
        "total_tasks": 0,
        "total_hours": 0,
        "dev_hours": 0,
        "rnd_hours": 0
    }
