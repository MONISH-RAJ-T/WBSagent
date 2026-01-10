"""
AI Service - Gemini API Integration
Handles all AI-powered feature extraction using Google's Gemini
"""
import json
from typing import List, Dict
from google import genai
from config import settings

class AIService:
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        
        # Configure Gemini API client
        if self.gemini_key:
            self.client = genai.Client(api_key=self.gemini_key)
        else:
            self.client = None
    
    async def extract_features_from_text(self, text: str) -> List[Dict]:
        """Extract features from project description using Gemini AI"""
        prompt = f"""
        Analyze this project description and extract a COMPREHENSIVE list of 15-25 features required to build a PRODUCTION-GRADE application.
        The list should cover core functionality, UI/UX, security, backend, database, and DevOps/deployment aspects.
        
        For each feature, provide:
        1. A short name (3-5 words)
        2. A brief description (1-2 sentences)
        
        Project Description:
        {text}
        
        Return ONLY a valid JSON array of features in this exact format (no markdown, no additional text):
        [{{"id": "f1", "name": "Feature Name", "description": "Feature description"}}]
        
        Ensure the features are detailed enough to form a complete Work Breakdown Structure (WBS).
        """
        
        try:
            if self.client:
                features = await self._call_gemini(prompt)
                if features:
                    return features
        except Exception as e:
            print(f"Gemini API failed: {e}")
        
        # Fallback to mock data
        return self._generate_mock_features(text)
    
    async def _call_gemini(self, prompt: str) -> List[Dict]:
        """Call Gemini API for feature extraction"""
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            
            if response.text:
                return self._parse_ai_response(response.text)
            
            return []
        except Exception as e:
            print(f"Gemini error: {e}")
            return []
    
    def _parse_ai_response(self, response: str) -> List[Dict]:
        """Parse AI response into structured features"""
        try:
            # Remove markdown code blocks if present
            response = response.strip()
            if response.startswith('```'):
                # Find the actual JSON content
                lines = response.split('\n')
                response = '\n'.join(lines[1:-1]) if len(lines) > 2 else response
            
            # Try to find JSON array in response
            start = response.find('[')
            end = response.rfind(']') + 1
            
            if start != -1 and end > start:
                json_str = response[start:end]
                features = json.loads(json_str)
                
                # Validate structure
                if isinstance(features, list) and len(features) > 0:
                    for i, feature in enumerate(features):
                        if 'id' not in feature:
                            feature['id'] = f"f{i+1}"
                    return features
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
        except Exception as e:
            print(f"Parse error: {e}")
        
        return []
    
    def _generate_mock_features(self, text: str) -> List[Dict]:
        """Generate mock features when AI is unavailable"""
        keywords = text.lower().split()
        features = [
            {"id": "f1", "name": "User Authentication & Authorization", "description": "Secure login, registration, and role-based access control using JWT"},
            {"id": "f2", "name": "Interactive Dashboard", "description": "Main landing page with real-time data visualization and activity summaries"},
            {"id": "f3", "name": "Scalable Database Schema Design", "description": "Highly optimized SQL/NoSQL schema for data integrity and performance"},
            {"id": "f4", "name": "Advanced Search & Filtering", "description": "Full-text search capabilities with complex metadata filtering"},
            {"id": "f5", "name": "Comprehensive Reporting System", "description": "Automated generation and export of PDF/Excel/CSV reports"},
            {"id": "f6", "name": "RESTful API Layer", "description": "Secure and documented API endpoints for frontend and 3rd party consumption"},
            {"id": "f7", "name": "Responsive Frontend UI", "description": "Modern, mobile-first user interface built with React/Next.js and Material UI"},
            {"id": "f8", "name": "Real-time Notifications", "description": "WebSocket-based in-app notifications and email alerts for key system events"},
            {"id": "f9", "name": "Automated Testing Suite", "description": "Unit and integration tests ensuring code quality and regression prevention"},
            {"id": "f10", "name": "CI/CD Pipeline Integration", "description": "Automated build, test, and deployment workflows using GitHub Actions/GitLab CI"},
            {"id": "f11", "name": "System Security Hardening", "description": "Protection against OWASP Top 10 vulnerabilities and secure header implementation"},
            {"id": "f12", "name": "Logging & Observability", "description": "Centralized logging and health monitoring for production maintenance"},
            {"id": "f13", "name": "User Profile Management", "description": "Comprehensive user settings, profile customization, and preferences"},
            {"id": "f14", "name": "Asset Storage & Management", "description": "Secure file upload and storage using cloud-native solutions like S3"},
            {"id": "f15", "name": "Audit Trail & Logging", "description": "Detailed tracking of user activities for security and compliance audits"},
        ]
        
        if "mobile" in keywords or "app" in keywords:
            features.append({"id": "f16", "name": "Native Mobile Support", "description": "Dedicated mobile optimization and Progressive Web App features"})
        if "payment" in keywords or "billing" in keywords:
            features.append({"id": "f17", "name": "Global Payment Processing", "description": "Secure multi-currency payment gateway integration with Stripe"})
        if "admin" in keywords or "management" in keywords:
            features.append({"id": "f18", "name": "Administrative Control Panel", "description": "High-level management UI for system configuration and user support"})
        
        return features[:20]
    
    async def analyze_competitors(self, project_name: str, description: str) -> Dict:
        """Analyze competitors and suggest enhancements using Gemini AI"""
        prompt = f"""
        Research and analyze top competitors for this project.
        Project: {project_name}
        Description: {description}
        
        Provide:
        1. A list of 3-4 top competitors.
        2. For each competitor, list 2-3 key features they offer.
        3. A list of "gap features" (value propositions) this project could offer to stay competitive.
        
        Return ONLY a valid JSON object in this exact format (no markdown, no additional text):
        {{
            "competitors": [
                {{
                    "name": "Competitor Name",
                    "features": ["Feature 1", "Feature 2"]
                }}
            ],
            "missing_features": ["Feature A", "Feature B"],
            "recommendations": ["Strategy 1", "Strategy 2"]
        }}
        """
        
        try:
            if self.client:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt
                )
                if response.text:
                    # Robust parsing for JSON object
                    text = response.text.strip()
                    
                    # Try to find JSON object in response
                    start = text.find('{')
                    end = text.rfind('}') + 1
                    
                    if start != -1 and end > start:
                        json_str = text[start:end]
                        try:
                            return json.loads(json_str)
                        except json.JSONDecodeError:
                            # Try one more time by stripping potential markdown code block markers
                            clean_json = json_str.replace('```json', '').replace('```', '').strip()
                            return json.loads(clean_json)
        except Exception as e:
            print(f"Competitor analysis failed: {e}")
            
        # Fallback to mock data if AI fails
        return {
            "competitors": [
                {"name": f"{project_name} Competitor A", "features": ["Feature 1", "Feature 2"]},
                {"name": f"{project_name} Competitor B", "features": ["Feature 3", "Feature 4"]}
            ],
            "missing_features": ["Advanced Analytics Dashboard", "Real-time Collaboration"],
            "recommendations": ["Focus on mobile-first experience"]
        }
    
    async def test_gemini_connection(self) -> Dict:
        """Test Gemini API connection"""
        if not self.gemini_key:
            raise Exception("Gemini API key not configured")
        
        try:
            # Simple test prompt
            response = self.client.models.generate_content(
                model=self.model_name,
                contents="Say 'Hello'"
            )
            if response.text:
                return {
                    "status": "connected",
                    "model": self.model_name,
                    "message": "Gemini API is working correctly"
                }
        except Exception as e:
            raise Exception(f"Gemini connection failed: {str(e)}")
        
        raise Exception("Unexpected error testing Gemini")
