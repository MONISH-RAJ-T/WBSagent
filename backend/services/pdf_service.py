"""
PDF Service - Extract text and features from PDF documents
Uses PyMuPDF for text extraction and Gemini for feature parsing
"""
import fitz  # PyMuPDF
from typing import List, Dict
import os
from google import genai
from config import settings
import logging
import pdfplumber
from services.ai_service import AIService

logging.basicConfig(level=logging.INFO)

class PDFService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            self.model_name = settings.GEMINI_MODEL
        else:
            self.client = None
            self.model_name = None
        
        self.ai_service = AIService()

    async def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract all text from PDF file using pdfplumber"""
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")

        try:
            logging.info(f"Opening PDF file: {pdf_path}")
            text_content = ""
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_content += page_text + "\n"
            logging.info("Text extraction completed.")
            return text_content.strip()
        except Exception as e:
            logging.error(f"Error during text extraction: {str(e)}")
            raise Exception(f"pdfplumber extraction failed: {str(e)}")
    
    async def parse_features_from_text(self, text: str, project_name: str) -> List[Dict]:
        """Use Gemini via AIService to extract workflow features"""
        
        try:
            # Use the new single-step extraction method
            features = await self.ai_service.extract_workflow_from_text(text)
            
            # If no features returned, raise error to trigger fallback or alert
            if not features:
                print("Warning: AI returned 0 features. Using defaults.")
                features = self._generate_default_features()

            # Post-process to add IDs and source if missing
            processed_features = []
            for i, f in enumerate(features):
                processed_features.append({
                    "id": f.get("id", f"pdf_{i+1}"),
                    "name": f.get("name", "Unnamed Feature"),
                    "description": f.get("description", ""),
                    "execution_order": f.get("order", i+1),
                    "dependencies": f.get("deps", []),
                    "source": "pdf",
                    "category": 1, # Default
                    "category_name": "PDF Extracted"
                })
                
            return processed_features
            
        except Exception as e:
            print(f"Workflow extraction CRITICAL ERROR: {e}")
            # Re-raise so we know, OR return defaults. 
            # If we want user to see the error, we should probably let it bubble up or handle gracefully.
            return self._generate_default_features()
    
    def _generate_default_features(self) -> List[Dict]:
        """Fallback features when parsing fails"""
        return [
            {
                "id": "f1",
                "name": "User Management",
                "description": "User registration, authentication, and profile management",
                "source": "pdf",
                "execution_order": 1
            },
            {
                "id": "f2",
                "name": "Dashboard",
                "description": "Main interface with overview and key metrics",
                "source": "pdf",
                "execution_order": 2
            }
        ]
    
    async def process_uploaded_pdf(self, pdf_path: str, project_name: str) -> Dict:
        """
        Hybrid Workflow: 
        1. Local Keyword Extraction (Free/Fast)
        2. AI Ordering (Gemini)
        """
        try:
            logging.info(f"Processing PDF for project: {project_name}")
            # Step 1: Extract Text (Free)
            text = await self.extract_text_from_pdf(pdf_path)
            if not text:
                raise Exception("No text extracted from PDF")

            # Step 2: Use AI to extract features directly from text
            raw_features = await self.ai_service.extract_workflow_from_text(text)
            
            # Step 3: If AI returns no features, use defaults
            if not raw_features:
                logging.warning("AI returned no features. Using defaults.")
                raw_features = self._generate_default_features()

            # Step 4: Normalize features to match expected schema
            features = []
            for i, feature in enumerate(raw_features):
                # Extract execution_order - handle both string and int formats
                exec_order = feature.get("order", feature.get("execution_order", i+1))
                
                # Convert string execution_order to integer
                if isinstance(exec_order, str):
                    # Extract first number from string like "1.1 Audio Ingestion..."
                    import re
                    match = re.search(r'^\d+', exec_order)
                    exec_order = int(match.group()) if match else i+1
                else:
                    exec_order = int(exec_order) if exec_order else i+1
                
                features.append({
                    "id": feature.get("id", f"f{i+1}"),
                    "name": feature.get("name", "Unnamed Feature"),
                    "description": feature.get("description", ""),
                    "execution_order": exec_order,
                    "priority": "medium",
                    "confidence": 0.8
                })

            logging.info(f"Feature extraction successful. Found {len(features)} features.")
            return {
                "success": True,
                "text": text,
                "features": features,
                "feature_count": len(features)
            }
        except FileNotFoundError as e:
            logging.error(str(e))
            return {
                "success": False,
                "error": str(e),
                "features": self._generate_default_features()
            }
        except Exception as e:
            logging.error(f"Unexpected error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "features": self._generate_default_features()
            }

    def _extract_features_locally(self, text: str) -> List[Dict]:
        """Simple keyword-based feature extraction (No AI)"""
        text_lower = text.lower()
        features = []
        
        # Expanded pattern list for better coverage
        feature_patterns = {
            "User Authentication": ["login", "signup", "auth", "password", "register", "signin"],
            "User Profile": ["profile", "account", "settings", "avatar", "preferences"],
            "Dashboard": ["dashboard", "overview", "home", "landing", "main"],
            "Audio Recording": ["record", "audio", "capture", "mic", "microphone", "voice"],
            "Transcription": ["transcribe", "speech to text", "conversion", "stt"],
            "Search & Filter": ["search", "filter", "find", "query", "lookup"],
            "Notifications": ["notification", "alert", "email", "push", "sms", "message"],
            "Payment Gateway": ["payment", "stripe", "credit card", "billing", "subscription"],
            "Admin Panel": ["admin", "moderator", "control panel", "manage users"],
            "Analytics & Reports": ["analytics", "chart", "graph", "report", "stats", "metrics"],
            "File Management": ["upload", "file", "image", "media", "storage", "download"],
            "API Integration": ["api", "integrate", "webhook", "third-party", "sync"],
            "Export Data": ["export", "pdf", "csv", "excel", "print"]
        }
        
        count = 1
        for name, keywords in feature_patterns.items():
            # Check if any keyword matches
            if any(k in text_lower for k in keywords):
                features.append({
                    "id": f"f{count}",
                    "name": name,
                    "description": f"Functionality related to {keywords[0]} (Detected from document)",
                    "execution_order": count, # Temporary order
                    "source": "pdf",
                    "category": 7, # Default to UI
                    "category_name": "Detected Feature"
                })
                count += 1
                
        return features

    async def extract_all_features(self, pdf_path: str):
        """Extract features from all pages of a PDF and process using AI service"""
        text_content = ""
        # Use pdfplumber to get clean text from all pages
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                # layout=True helps preserve columns and section headers
                text_content += page.extract_text(layout=True) + "\n"
        
        # Feed the FULL text to Gemini for intelligent parsing
        ai_service = AIService()
        return await ai_service.extract_workflow_from_text(text_content)
