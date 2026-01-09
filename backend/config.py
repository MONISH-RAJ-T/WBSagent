"""
Configuration management for WBS Generator
"""
import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api"
    
    # Gemini AI Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # File paths
    UPLOAD_DIR: str = "temp/uploads"
    EXPORT_DIR: str = "temp/exports"
    
    # CORS
    ALLOWED_HOSTS: list = ["http://localhost:3000", "http://localhost:3001"]
    
    class Config:
        env_file = ".env"

settings = Settings()
