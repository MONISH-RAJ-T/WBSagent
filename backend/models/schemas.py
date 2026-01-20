"""
Pydantic Models & Schemas for WBS Generator
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# ============ REQUEST MODELS ============

class ProjectRequest(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10)

class FeatureGenerateRequest(BaseModel):
    project_name: str
    description: str

# ============ FEATURE MODELS ============

class FeatureAnalysis(BaseModel):
    """Analysis results for intelligent task breakdown"""
    needs_rnd: bool = False
    needs_ui: bool = False
    needs_db: bool = False
    dev_complexity: str = "medium"  # simple | medium | complex
    dev_hours: float = 8.0
    rnd_hours: float = 0.0
    ui_hours: float = 0.0
    db_hours: float = 0.0
    unit_test_hours: float = 0.0  # Auto-calculated: 20% of dev
    qa_hours: float = 2.0  # Fixed
    total_hours: float = 0.0
    reasoning: str = ""

class Feature(BaseModel):
    id: str
    name: str
    description: str
    priority: Optional[str] = "medium"
    confidence: Optional[float] = 0.8
    execution_order: Optional[int] = None  # Sequential order: 1, 2, 3...
    reasoning: Optional[str] = None  # AI's explanation for ordering
    analysis: Optional[FeatureAnalysis] = None  # NEW: Intelligent task analysis

class FlowGenerateRequest(BaseModel):
    project_name: str
    description: str
    features: List[Feature]

class WBSGenerateRequest(BaseModel):
    project_name: str
    features: List[Feature]

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
    dependencies: List[str] = Field(default_factory=list)
    level: int = 1
    parent_id: Optional[str] = None
    task_type: str = "Dev"  # Dev | R&D | UI/UX | DB | Unit Testing | QA Testing

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
