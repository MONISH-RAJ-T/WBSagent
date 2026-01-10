"""
PDF Service - Extract text and features from PDF documents
Uses PyMuPDF for text extraction and Gemini for feature parsing
"""
import fitz  # PyMuPDF
from typing import List, Dict
import os
from google import genai
from config import settings

class PDFService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            self.model_name = settings.GEMINI_MODEL
        else:
            self.client = None
            self.model_name = None
    
    async def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract all text from PDF file"""
        try:
            doc = fitz.open(pdf_path)
            text_content = ""
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                text_content += page.get_text()
            
            doc.close()
            return text_content.strip()
        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")
    
    async def parse_features_from_text(self, text: str, project_name: str) -> List[Dict]:
        """Use Gemini to extract features from PDF text content"""
        if not self.client:
            return self._generate_default_features()
        
        prompt = f"""
        You are analyzing a product specification document for a project called "{project_name}".
        
        CRITICAL INSTRUCTIONS:
        1. ONLY extract features that are EXPLICITLY mentioned in the document text below.
        2. Do NOT invent, generate, or suggest any features that are not in the document.
        3. Do NOT add common features like "user authentication" unless the document specifically mentions them.
        4. If a feature is partially described, extract only what is explicitly stated.
        5. If no features are clearly mentioned, return an empty array [].
        
        For each feature found in the document:
        - Use the exact feature name from the document if available
        - Provide a description based ONLY on what the document says
        
        Document Text:
        {text[:6000]}
        
        Return ONLY a valid JSON array in this exact format (no markdown, no additional text):
        [{{\"id\": \"f1\", \"name\": \"Feature Name from Document\", \"description\": \"Description based on document content\", \"source\": \"pdf\"}}]
        
        If no features are explicitly stated in the document, return: []
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            if response.text:
                features = self._parse_json_response(response.text)
                return features if features else []
        except Exception as e:
            print(f"Gemini parsing error: {e}")
        
        # Return empty list - we don't generate features for PDF mode
        return []
    
    def _parse_json_response(self, response: str) -> List[Dict]:
        """Parse JSON from AI response"""
        import json
        try:
            # Remove markdown code blocks if present
            response = response.strip()
            if response.startswith('```'):
                lines = response.split('\n')
                response = '\n'.join(lines[1:-1]) if len(lines) > 2 else response
            
            # Find JSON array
            start = response.find('[')
            end = response.rfind(']') + 1
            
            if start != -1 and end > start:
                json_str = response[start:end]
                features = json.loads(json_str)
                
                # Ensure proper structure
                if isinstance(features, list):
                    for i, feature in enumerate(features):
                        if 'id' not in feature:
                            feature['id'] = f"f{i+1}"
                        if 'source' not in feature:
                            feature['source'] = 'pdf'
                    return features
        except Exception as e:
            print(f"JSON parse error: {e}")
        
        return []
    
    def _generate_default_features(self) -> List[Dict]:
        """Fallback features when parsing fails"""
        return [
            {
                "id": "f1",
                "name": "User Management",
                "description": "User registration, authentication, and profile management",
                "source": "pdf"
            },
            {
                "id": "f2",
                "name": "Dashboard",
                "description": "Main interface with overview and key metrics",
                "source": "pdf"
            },
            {
                "id": "f3",
                "name": "Data Processing",
                "description": "Core data processing and business logic",
                "source": "pdf"
            }
        ]
    
    async def process_uploaded_pdf(self, pdf_path: str, project_name: str) -> Dict:
        """Complete PDF processing: extract text and parse features"""
        try:
            # Extract text
            text = await self.extract_text_from_pdf(pdf_path)
            
            if not text:
                raise Exception("No text could be extracted from PDF")
            
            # Parse features
            features = await self.parse_features_from_text(text, project_name)
            
            return {
                "success": True,
                "text": text,
                "features": features,
                "feature_count": len(features)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "features": self._generate_default_features()
            }
