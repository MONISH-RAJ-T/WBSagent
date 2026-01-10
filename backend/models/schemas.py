"""
Pydantic Models & Schemas for WBS Generator
"""
from pydantic import BaseModel, Field
from typing import List, Optional

# ============ REQUEST MODELS ============

class ProjectRequest(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10)

class FeatureGenerateRequest(BaseModel):
    project_name: str
    description: str

class WBSGenerateRequest(BaseModel):
    project_name: str
    features: List[str]

# ============ FEATURE MODELS ============

class Feature(BaseModel):
    id: str
    name: str
    description: str
    priority: Optional[str] = "medium"
    confidence: Optional[float] = 0.8

class FeatureListResponse(BaseModel):
    project_name: str
    features: List[Feature]
    total_features: int

# ============ WBS MODELS ============

class WBSTask(BaseModel):
    id: str
    name: str
    description: str
    duration_hours: float
    dependencies: List[str] = []
    level: int = 1
    parent_id: Optional[str] = None
    task_type: str = "Dev"  # Dev or R&D

class WBSResponse(BaseModel):
    project_name: str
    tasks: List[WBSTask]
    total_tasks: int
    total_hours: float

# ============ EXPORT MODELS ============

class ExportRequest(BaseModel):
    project_name: str
    tasks: List[WBSTask]
    format: str = "excel"

# ============ COMPETITOR ANALYSIS ============

class Competitor(BaseModel):
    name: str
    features: List[str]

class CompetitorAnalysisResponse(BaseModel):
    competitors: List[Competitor]
    missing_features: List[str]
    recommendations: List[str]
