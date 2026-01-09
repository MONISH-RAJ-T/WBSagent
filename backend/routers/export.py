"""
Export Router - Excel, CSV, JSON exports
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from typing import List
from services.excel_generator import ExcelGenerator
from models.schemas import WBSTask
import io
import json
import csv

router = APIRouter()
excel_gen = ExcelGenerator()

class ExportRequest(BaseModel):
    project_name: str
    tasks: List[WBSTask]

@router.post("/excel")
async def export_to_excel(request: ExportRequest):
    """Export WBS to Excel format"""
    try:
        file_path = excel_gen.generate_excel(
            project_name=request.project_name,
            tasks=[task.dict() for task in request.tasks]
        )
        return FileResponse(
            path=file_path,
            filename=f"{request.project_name}_WBS.xlsx",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Excel export failed: {str(e)}")

@router.post("/csv")
async def export_to_csv(request: ExportRequest):
    """Export WBS to CSV format"""
    try:
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(['ID', 'Task Name', 'Description', 'Type', 'Hours', 'Level', 'Dependencies'])
        
        # Data
        for task in request.tasks:
            writer.writerow([
                task.id,
                task.name,
                task.description,
                task.task_type,
                task.duration_hours,
                task.level,
                ', '.join(task.dependencies)
            ])
        
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={request.project_name}_WBS.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV export failed: {str(e)}")

@router.post("/json")
async def export_to_json(request: ExportRequest):
    """Export WBS to JSON format"""
    try:
        data = {
            "project_name": request.project_name,
            "tasks": [task.dict() for task in request.tasks],
            "total_tasks": len(request.tasks),
            "total_hours": sum(task.duration_hours for task in request.tasks)
        }
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"JSON export failed: {str(e)}")
