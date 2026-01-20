"""
WBS Router - Work Breakdown Structure Generation
"""
from fastapi import APIRouter, HTTPException
from typing import List
from services.wbs_engine import WBSEngine
from services.ai_service import AIService
from services.feature_analysis_service import FeatureAnalysisService
from models.schemas import WBSResponse, WBSTask, WBSGenerateRequest

router = APIRouter()
wbs_engine = WBSEngine()
ai_service = AIService()
feature_analyzer = FeatureAnalysisService(ai_service)

@router.post("/generate", response_model=WBSResponse)
async def generate_wbs(request: WBSGenerateRequest):
    """Generate WBS from features using intelligent conditional task breakdown"""
    try:
        # Convert features to list of dicts
        features_list = [f.dict() if hasattr(f, 'dict') else f for f in request.features]
        
        # Separate features that need analysis
        features_to_analyze = []
        features_already_analyzed = []
        
        for feature in features_list:
            if not feature.get('analysis'):
                features_to_analyze.append(feature)
            else:
                features_already_analyzed.append(feature)
        
        # Batch analyze features that need it (using hybrid approach)
        if features_to_analyze:
            print(f"⚙️ Analyzing {len(features_to_analyze)} features using hybrid approach...")
            analyzed_batch = await feature_analyzer.analyze_features_batch(features_to_analyze)
            features_already_analyzed.extend(analyzed_batch)
        else:
            print(f"✅ All {len(features_already_analyzed)} features already analyzed")
        
        analyzed_features = features_already_analyzed
        
        # Generate WBS with analyzed features
        print(f"🏗️ Generating WBS for {len(analyzed_features)} features...")
        wbs_data = await wbs_engine.generate_wbs(
            project_name=request.project_name,
            features=analyzed_features
        )
        
        print(f"✅ Generated {wbs_data['total_tasks']} tasks, {wbs_data['total_hours']} hours")
        
        # Manually validate before returning to catch the 500 error cause
        try:
            return WBSResponse(**wbs_data)
        except Exception as ve:
            print(f"❌ VALIDATION ERROR: {ve}")
            print(f"   WBS Data: {wbs_data}")
            raise HTTPException(status_code=500, detail=f"Data validation failed: {str(ve)}")
        
    except Exception as e:
        import traceback
        traceback.print_exc()
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