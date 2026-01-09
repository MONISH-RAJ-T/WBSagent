"""
Competitor Research Service - Uses Gemini to research competitors and suggest features
"""
from typing import List, Dict
from google import genai
from config import settings
import json

class CompetitorService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            self.model_name = settings.GEMINI_MODEL
        else:
            self.client = None
            self.model_name = None
    
    async def research_competitors(self, project_name: str, description: str) -> Dict:
        """
        Research 3 competitors and extract their features
        """
        if not self.client:
            return self._generate_mock_research(project_name)
        
        prompt = f"""
        Research competitors for this project:
        
        Project Name: {project_name}
        Description: {description}
        
        Please provide:
        1. Three main competitors in this space
        2. Key features of each competitor
        3. Three unique enhancement suggestions that would make this project stand out
        
        Return ONLY valid JSON in this format:
        {{
          "competitors": [
            {{
              "name": "Competitor 1",
              "features": ["feature1", "feature2", "feature3"]
            }}
          ],
          "enhancements": [
            {{
              "id": "e1",
              "name": "Enhancement Name",
              "description": "Why this would be valuable",
              "priority": "high"
            }}
          ]
        }}
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            if response.text:
                result = self._parse_research_response(response.text)
                if result:
                    return result
        except Exception as e:
            print(f"Gemini research error: {e}")
        
        return self._generate_mock_research(project_name)
    
    async def generate_feature_list(self, 
                                   project_name: str,
                                   description: str,
                                   competitors: List[Dict],
                                   enhancements: List[Dict]) -> List[Dict]:
        """
        Generate initial feature list based on competitors and enhancements
        """
        if not self.client:
            return self._generate_default_features(enhancements)
        
        # Combine competitor features
        all_competitor_features = []
        for comp in competitors:
            all_competitor_features.extend(comp.get('features', []))
        
        prompt = f"""
        Generate a comprehensive feature list for this project:
        
        Project: {project_name}
        Description: {description}
        
        Competitor Features (for reference):
        {', '.join(all_competitor_features[:10])}
        
        Recommended Enhancements:
        {json.dumps([e.get('name') for e in enhancements])}
        
        Create 6-10 unique features that combine standard features with innovative enhancements.
        
        Return ONLY valid JSON array:
        [{{
          "id": "f1",
          "name": "Feature Name",
          "description": "Detailed description",
          "priority": "high",
          "source": "competitor" or "enhancement" or "suggested"
        }}]
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            if response.text:
                features = self._parse_features_response(response.text)
                if features:
                    return features
        except Exception as e:
            print(f"Feature generation error: {e}")
        
        return self._generate_default_features(enhancements)
    
    def _parse_research_response(self, response: str) -> Dict:
        """Parse competitor research response"""
        try:
            # Remove markdown
            response = response.strip()
            if response.startswith('```'):
                lines = response.split('\n')
                response = '\n'.join(lines[1:-1]) if len(lines) > 2 else response
            
            # Find JSON object
            start = response.find('{')
            end = response.rfind('}') + 1
            
            if start != -1 and end > start:
                json_str = response[start:end]
                data = json.loads(json_str)
                
                # Validate structure
                if 'competitors' in data and 'enhancements' in data:
                    return data
        except Exception as e:
            print(f"Parse error: {e}")
        
        return None
    
    def _parse_features_response(self, response: str) -> List[Dict]:
        """Parse feature list response"""
        try:
            response = response.strip()
            if response.startswith('```'):
                lines = response.split('\n')
                response = '\n'.join(lines[1:-1]) if len(lines) > 2 else response
            
            start = response.find('[')
            end = response.rfind(']') + 1
            
            if start != -1 and end > start:
                json_str = response[start:end]
                features = json.loads(json_str)
                
                if isinstance(features, list):
                    for i, feature in enumerate(features):
                        if 'id' not in feature:
                            feature['id'] = f"f{i+1}"
                    return features
        except Exception as e:
            print(f"Parse error: {e}")
        
        return []
    
    def _generate_mock_research(self, project_name: str) -> Dict:
        """Generate mock competitor research"""
        return {
            "competitors": [
                {
                    "name": f"{project_name} - Competitor A",
                    "features": [
                        "User authentication",
                        "Dashboard analytics",
                        "Data export"
                    ]
                },
                {
                    "name": f"{project_name} - Competitor B",
                    "features": [
                        "Real-time updates",
                        "Mobile app",
                        "API integration"
                    ]
                },
                {
                    "name": "Industry Leader",
                    "features": [
                        "Advanced reporting",
                        "Team collaboration",
                        "Custom workflows"
                    ]
                }
            ],
            "enhancements": [
                {
                    "id": "e1",
                    "name": "AI-Powered Insights",
                    "description": "Leverage AI to provide intelligent recommendations and predictions",
                    "priority": "high"
                },
                {
                    "id": "e2",
                    "name": "Voice Interface",
                    "description": "Enable hands-free operation through voice commands",
                    "priority": "medium"
                },
                {
                    "id": "e3",
                    "name": "Blockchain Integration",
                    "description": "Ensure data immutability and transparency",
                    "priority": "medium"
                }
            ]
        }
    
    def _generate_default_features(self, enhancements: List[Dict]) -> List[Dict]:
        """Generate default feature list"""
        features = [
            {
                "id": "f1",
                "name": "User Authentication",
                "description": "Secure login and registration system",
                "priority": "high",
                "source": "suggested"
            },
            {
                "id": "f2",
                "name": "Dashboard",
                "description": "Main user interface with key metrics",
                "priority": "high",
                "source": "suggested"
            },
            {
                "id": "f3",
                "name": "Data Management",
                "description": "CRUD operations for primary entities",
                "priority": "high",
                "source": "suggested"
            }
        ]
        
        # Add enhancements as features
        for i, enhancement in enumerate(enhancements[:3]):
            features.append({
                "id": f"f{len(features) + 1}",
                "name": enhancement.get('name', 'Enhancement'),
                "description": enhancement.get('description', ''),
                "priority": enhancement.get('priority', 'medium'),
                "source": "enhancement"
            })
        
        return features
