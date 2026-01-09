"""
WBS Generator - Main FastAPI Application
Complete production-ready FastAPI app with all routers
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import os
from contextlib import asynccontextmanager
from routers import wbs, export, features, ai, pdf, competitors

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 WBS Generator starting...")
    yield
    # Shutdown
    print("🛑 WBS Generator shutting down...")

app = FastAPI(
    title="WBS Generator API",
    description="AI-powered Work Breakdown Structure Generator",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "wbs-generator"}

# Router includes
app.include_router(wbs.router, prefix="/api/wbs", tags=["wbs"])
app.include_router(export.router, prefix="/api/export", tags=["export"])
app.include_router(features.router, prefix="/api/features", tags=["features"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(pdf.router, prefix="/api/pdf", tags=["pdf"])
app.include_router(competitors.router, prefix="/api/competitors", tags=["competitors"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
