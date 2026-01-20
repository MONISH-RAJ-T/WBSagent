"""
Feature Analysis Service - Intelligent Task Requirement Detection
Uses AI to determine which pre-development phases are needed for each feature
"""
from typing import Dict, List
import re
from services.ai_service import AIService


import asyncio

class FeatureAnalysisService:
    """Analyzes features to determine conditional task requirements"""
    
    def __init__(self, ai_service: AIService):
        self.ai = ai_service
        self.semaphore = asyncio.Semaphore(5)  # Limit concurrent AI calls
        
    async def analyze_feature(self, feature: Dict) -> Dict:
        """
        Analyze a feature to determine required phases and hours.
        Uses keyword-first approach with AI only for ambiguous cases.
        """
        # ALWAYS use keyword analysis first (fast and reliable)
        keyword_analysis = self._keyword_analyze_feature(feature)
        
        # Only use AI if the feature is truly ambiguous
        # (This reduces API calls by ~80%)
        needs_ai = self._is_ambiguous(feature, keyword_analysis)
        
        if needs_ai and self.ai.client:
            async with self.semaphore:
                try:
                    ai_analysis = await self._ai_analyze_feature(feature)
                    if ai_analysis:
                        # Merge AI insights with keyword analysis
                        keyword_analysis.update(ai_analysis)
                except Exception as e:
                    # Silently fall back to keyword analysis
                    pass
        
        # Calculate hours based on analysis
        return self._calculate_hours(keyword_analysis)
    
    def _is_ambiguous(self, feature: Dict, keyword_analysis: Dict) -> bool:
        """Determine if a feature needs AI analysis (only ~20% of features)"""
        name = feature.get('name', '').lower()
        desc = feature.get('description', '').lower()
        text = f"{name} {desc}"
        
        # Skip AI for clearly simple features
        simple_indicators = ['export', 'import', 'csv', 'json', 'pdf', 'print', 'download', 'upload']
        if any(indicator in text for indicator in simple_indicators):
            return False
        
        # Skip AI for clearly UI features
        ui_indicators = ['dashboard', 'form', 'page', 'screen', 'button', 'menu']
        if any(indicator in text for indicator in ui_indicators) and len(desc) < 100:
            return False
        
        # Only use AI for genuinely complex/ambiguous cases
        complex_indicators = ['algorithm', 'optimization', 'real-time', 'machine learning', 'ai', 'distributed']
        return any(indicator in text for indicator in complex_indicators)
    
    async def analyze_features_batch(self, features: List[Dict]) -> List[Dict]:
        """Analyze multiple features (mostly using keyword analysis)"""
        tasks = []
        for feature in features:
            tasks.append(self.analyze_feature(feature))
            
        # Run all analysis tasks concurrently
        results = await asyncio.gather(*tasks)
        
        # Merge analysis back into feature objects
        analyzed_features = []
        for feature, analysis in zip(features, results):
            feature_with_analysis = {**feature, "analysis": analysis}
            analyzed_features.append(feature_with_analysis)
            
        return analyzed_features
    
    async def _ai_analyze_feature(self, feature: Dict) -> Dict:
        """Use AI to analyze feature requirements"""
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
            result = await self.ai._call_gemini(prompt)
            if result and isinstance(result, list) and len(result) > 0:
                return result[0]
            elif result and isinstance(result, dict):
                return result
        except Exception as e:
            print(f"AI feature analysis failed: {e}")
        
        return None
    
    def _keyword_analyze_feature(self, feature: Dict) -> Dict:
        """Fallback: Keyword-based analysis when AI is unavailable"""
        name = feature.get('name', '').lower()
        desc = feature.get('description', '').lower()
        text = f"{name} {desc}"
        
        # R&D indicators
        rnd_keywords = [
            'research', 'algorithm', 'machine learning', 'ai', 'optimization',
            'real-time', 'websocket', 'blockchain', 'performance', 'scalability',
            'architecture', 'proof of concept', 'poc', 'feasibility', 'complex'
        ]
        needs_rnd = any(keyword in text for keyword in rnd_keywords)
        
        # UI indicators
        ui_keywords = [
            'ui', 'ux', 'interface', 'dashboard', 'form', 'page', 'screen',
            'button', 'display', 'view', 'visualization', 'chart', 'graph',
            'modal', 'dialog', 'menu', 'navigation', 'user-facing', 'frontend'
        ]
        needs_ui = any(keyword in text for keyword in ui_keywords)
        
        # DB indicators
        db_keywords = [
            'database', 'schema', 'table', 'model', 'migration', 'data structure',
            'entity', 'relationship', 'store', 'persist', 'save', 'crud',
            'collection', 'document', 'sql', 'nosql', 'query'
        ]
        needs_db = any(keyword in text for keyword in db_keywords)
        
        # Complexity assessment
        complexity_indicators = {
            'complex': ['complex', 'advanced', 'sophisticated', 'real-time', 'distributed', 'scalable'],
            'simple': ['simple', 'basic', 'straightforward', 'easy', 'quick', 'export', 'utility']
        }
        
        dev_complexity = 'medium'  # Default
        if any(keyword in text for keyword in complexity_indicators['complex']):
            dev_complexity = 'complex'
        elif any(keyword in text for keyword in complexity_indicators['simple']):
            dev_complexity = 'simple'
        
        return {
            'needs_rnd': needs_rnd,
            'needs_ui': needs_ui,
            'needs_db': needs_db,
            'dev_complexity': dev_complexity,
            'reasoning': 'Keyword-based analysis (AI unavailable)'
        }
    
    def _calculate_hours(self, analysis: Dict) -> Dict:
        """Calculate hours for all phases based on analysis"""
        
        # R&D hours (conditional)
        rnd_hours = 0.0
        if analysis.get('needs_rnd', False):
            complexity = analysis.get('dev_complexity', 'medium')
            rnd_hours = 2.0 if complexity in ['simple', 'medium'] else 4.0
        
        # UI/UX hours (conditional)
        ui_hours = 2.0 if analysis.get('needs_ui', False) else 0.0
        
        # DB Schema hours (conditional)
        db_hours = 2.0 if analysis.get('needs_db', False) else 0.0
        
        # Development hours (based on complexity)
        complexity_hours = {
            'simple': 4.0,
            'medium': 8.0,
            'complex': 12.0
        }
        dev_complexity = analysis.get('dev_complexity', 'medium')
        dev_hours = complexity_hours.get(dev_complexity, 8.0)
        
        # MANDATORY: Unit Testing (20% of dev time)
        unit_test_hours = round(dev_hours * 0.2, 1)
        
        # MANDATORY: QA Testing (fixed 2 hours)
        qa_hours = 2.0
        
        # Total hours
        total_hours = rnd_hours + ui_hours + db_hours + dev_hours + unit_test_hours + qa_hours
        
        return {
            'needs_rnd': analysis.get('needs_rnd', False),
            'needs_ui': analysis.get('needs_ui', False),
            'needs_db': analysis.get('needs_db', False),
            'dev_complexity': dev_complexity,
            'dev_hours': dev_hours,
            'rnd_hours': rnd_hours,
            'ui_hours': ui_hours,
            'db_hours': db_hours,
            'unit_test_hours': unit_test_hours,
            'qa_hours': qa_hours,
            'total_hours': round(total_hours, 1),
            'reasoning': analysis.get('reasoning', 'Analysis completed')
        }
    
    def get_summary_stats(self, analyzed_features: List[Dict]) -> Dict:
        """Get summary statistics for analyzed features"""
        total_features = len(analyzed_features)
        
        features_needing_rnd = sum(1 for f in analyzed_features if f.get('analysis', {}).get('needs_rnd', False))
        features_needing_ui = sum(1 for f in analyzed_features if f.get('analysis', {}).get('needs_ui', False))
        features_needing_db = sum(1 for f in analyzed_features if f.get('analysis', {}).get('needs_db', False))
        
        total_hours = sum(f.get('analysis', {}).get('total_hours', 0) for f in analyzed_features)
        total_dev_hours = sum(f.get('analysis', {}).get('dev_hours', 0) for f in analyzed_features)
        total_test_hours = sum(
            f.get('analysis', {}).get('unit_test_hours', 0) + f.get('analysis', {}).get('qa_hours', 0)
            for f in analyzed_features
        )
        
        return {
            'total_features': total_features,
            'features_needing_rnd': features_needing_rnd,
            'features_needing_ui': features_needing_ui,
            'features_needing_db': features_needing_db,
            'total_hours': round(total_hours, 1),
            'total_dev_hours': round(total_dev_hours, 1),
            'total_test_hours': round(total_test_hours, 1),
            'avg_hours_per_feature': round(total_hours / total_features, 1) if total_features > 0 else 0
        }
