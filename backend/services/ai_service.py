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
        PROJECT: {text}
        
        TASK: List 15-20 core features for this software project.
        
        REQUIREMENTS:
        - Cover: Auth, UI, Backend, DB, DevOps
        - Format: JSON Array only
        - NO explanations
        
        RETURN JSON:
        [{{"id": "f1", "name": "Feature Name", "description": "Brief description"}}]
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
    
    async def extract_workflow_from_text(self, text: str):
        prompt = f"""
        Analyze this Product Specification PDF text. 
        
        TEXT: {text[:15000]}
        
        TASK:
        1. Locate the 'Key Product Features' section.
        2. Extract EVERY individual feature mentioned. I am expecting approximately 17 features.
        3. For each, provide the exact 'name' used in the PDF and a clear 'description'.
        4. Arrange them in technical 'execution_order' (e.g., Core Engine -> UI -> Integrations).
        
        FORMAT: Return ONLY a valid JSON array.
        """
        # Use your existing _call_gemini method to get the ordered JSON
        return await self._call_gemini(prompt)
    
    async def analyze_feature_requirements(self, feature: Dict) -> Dict:
        """
        Analyze a feature to determine required work phases.
        Used by FeatureAnalysisService for intelligent task breakdown.
        
        Returns dict with: needs_rnd, needs_ui, needs_db, dev_complexity, reasoning
        """
        feature_name = feature.get('name', '')
        feature_desc = feature.get('description', '')
        
        prompt = f"""
Analyze this software feature to determine what work phases are needed.

Feature: {feature_name}
Description: {feature_desc}

Determine:
1. **needs_rnd**: Does it need Research & Development?
   - TRUE if: New technology, unclear implementation, complex algorithms, proof-of-concept needed
   - FALSE if: Well-known patterns, straightforward implementation

2. **needs_ui**: Does it have a user interface component?
   - TRUE if: User-facing screens, dashboards, forms, visualizations, any UI elements
   - FALSE if: Backend-only, API, background jobs, utilities

3. **needs_db**: Does it require database design work?
   - TRUE if: New tables/collections, schema changes, data modeling, migrations
   - FALSE if: Read-only queries, no data structure changes

4. **dev_complexity**: How complex is the development?
   - "simple": 1-2 days work, straightforward implementation
   - "medium": 3-5 days work, moderate complexity
   - "complex": 1-2 weeks work, significant complexity

Return ONLY valid JSON (no markdown, no explanations):
{{
    "needs_rnd": true/false,
    "needs_ui": true/false,
    "needs_db": true/false,
    "dev_complexity": "simple/medium/complex",
    "reasoning": "brief explanation of decisions"
}}
"""
        
        try:
            result = await self._call_gemini(prompt)
            if result and isinstance(result, list) and len(result) > 0:
                return result[0]
            elif result and isinstance(result, dict):
                return result
        except Exception as e:
            print(f"AI feature requirement analysis failed: {e}")
        
        return None

    async def _call_gemini(self, prompt: str) -> List[Dict]:
        """Call Gemini API using proper async support with client.aio"""
        if not self.client:
            return []
        
        max_retries = 3
        base_delay = 2  # seconds
        
        for attempt in range(max_retries):
            try:
                # IMPORTANT: Use self.client.aio for true async support
                response = await self.client.aio.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                
                if response.text:
                    return self._parse_ai_response(response.text)
                
                return []
                
            except Exception as e:
                # Check for overload/unavailable/quota errors
                error_str = str(e)
                if "503" in error_str or "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                    print(f"⚠️  Gemini API quota/limit reached. Using keyword-based fallback analysis.")
                    # Don't retry on quota errors, immediately return empty to trigger fallback
                    return []
                
                print(f"Gemini error (attempt {attempt+1}/{max_retries}): {e}")
                if attempt == max_retries - 1:
                    return []
        return []
    
    def _parse_ai_response(self, response: str) -> List[Dict]:
        """Robust parsing to prevent 500 errors from bad AI formatting"""
        try:
            text = response.strip()
            
            # Remove markdown markers
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            
            # Find JSON boundaries
            start_idx = text.find('[') if '[' in text else text.find('{')
            end_idx = (text.rfind(']') if ']' in text else text.rfind('}')) + 1
            
            if start_idx != -1 and end_idx > 0:
                json_str = text[start_idx:end_idx]
                features = json.loads(json_str)
                
                # Validate structure
                if isinstance(features, list) and len(features) > 0:
                    for i, feature in enumerate(features):
                        if 'id' not in feature:
                            feature['id'] = f"f{i+1}"
                    return features
                elif isinstance(features, dict):
                    # Single object returned, wrap in list
                    return [features]
            
            return []
            
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            return []
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
                # Use proper async client
                response = await self.client.aio.models.generate_content(
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
            # Simple test prompt using async client
            response = await self.client.aio.models.generate_content(
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
