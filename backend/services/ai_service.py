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
        Analyze this project description and extract a list of 5-8 key features.
        For each feature, provide:
        1. A short name (3-5 words)
        2. A brief description (1-2 sentences)
        
        Project Description:
        {text}
        
        Return ONLY a valid JSON array of features in this exact format (no markdown, no additional text):
        [{{"id": "f1", "name": "Feature Name", "description": "Feature description"}}]
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
            {"id": "f1", "name": "User Authentication", "description": "Secure login and registration system with JWT tokens"},
            {"id": "f2", "name": "Dashboard", "description": "Main user interface with analytics and key metrics"},
            {"id": "f3", "name": "Data Management", "description": "CRUD operations for primary business entities"},
            {"id": "f4", "name": "Search & Filter", "description": "Advanced search functionality with multiple filters"},
            {"id": "f5", "name": "Reporting", "description": "Generate and export comprehensive reports"},
        ]
        
        if "mobile" in keywords or "app" in keywords:
            features.append({"id": "f6", "name": "Mobile App", "description": "Native mobile application for iOS and Android"})
        if "payment" in keywords or "billing" in keywords:
            features.append({"id": "f7", "name": "Payment Integration", "description": "Process payments securely with Stripe/PayPal"})
        if "notification" in keywords or "email" in keywords:
            features.append({"id": "f8", "name": "Notification System", "description": "Email and push notifications for important events"})
        
        return features[:8]
    
    async def analyze_competitors(self, project_name: str, description: str) -> Dict:
        """Analyze competitors and suggest enhancements"""
        # Mock implementation - in production, could use Gemini for this too
        return {
            "competitors": [
                f"{project_name} Competitor A",
                f"{project_name} Competitor B",
                "Industry Leader"
            ],
            "missing_features": [
                "Advanced Analytics Dashboard",
                "AI-Powered Recommendations",
                "Real-time Collaboration"
            ],
            "recommendations": [
                "Add real-time collaboration features to compete with market leaders",
                "Implement advanced security features like 2FA and SSO",
                "Consider mobile-first approach for better user engagement"
            ]
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
