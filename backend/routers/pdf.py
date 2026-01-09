"""
PDF Router - Handle PDF upload and feature extraction
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from services.pdf_service import PDFService
import os
import uuid

router = APIRouter()
pdf_service = PDFService()

class PDFExtractionResponse(BaseModel):
    success: bool
    features: List[Dict]
    text: str = ""
    error: str = ""

@router.post("/upload", response_model=PDFExtractionResponse)
async def upload_and_extract_pdf(
    file: UploadFile = File(...),
    project_name: str = "Unnamed Project"
):
    """
    Upload PDF and extract features
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save uploaded file temporarily
    upload_dir = "temp/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_id = str(uuid.uuid4())
    file_path = os.path.join(upload_dir, f"{file_id}.pdf")
    
    try:
        # Save file
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Process PDF
        result = await pdf_service.process_uploaded_pdf(file_path, project_name)
        
        # Clean up
        os.remove(file_path)
        
        return PDFExtractionResponse(
            success=result.get("success", False),
            features=result.get("features", []),
            text=result.get("text", "")[:500],  # Limit text length
            error=result.get("error", "")
        )
    
    except Exception as e:
        # Clean up on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(e)}")
