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
You are a senior software architect estimating development effort. Analyze the feature and decide WHICH development layers are needed.

Feature: {feature_name}
Description: {feature_desc}

LAYER DEFINITIONS — set true/false for each:

1. needs_rnd       — TRUE only for: ML/AI, new algorithms, blockchain, real-time systems, proof-of-concept work. FALSE for standard CRUD, UI, auth, reporting.
2. needs_ui_design — TRUE if the feature has any user-facing screen (form, page, dashboard, modal, table, chart). FALSE for background jobs or pure APIs with no screen.
3. needs_frontend  — TRUE if needs_ui_design is TRUE (you cannot design a screen and not build it). Also TRUE for any interactive client-side component.
4. needs_db        — TRUE if the feature stores, updates, or deletes data (new tables, schema changes, migrations). FALSE if it only reads existing data.
5. needs_backend   — TRUE for ANY feature that has: API endpoints, business logic, authentication, data processing, cron jobs, webhooks, email, payments. FALSE ONLY for pure static front-end pages with absolutely no server interaction.

STRICT CO-DEPENDENCY RULES (you MUST follow these):
- If needs_ui_design = true  → needs_frontend MUST also be true
- If needs_frontend = true   → needs_backend MUST also be true (frontend always calls an API)
- If needs_db = true         → needs_backend MUST also be true (DB access happens on server side)
- unit_test and qa are ALWAYS required for every feature, no exceptions

For each TRUE layer, estimate hours:
- human: realistic hours for a skilled developer to complete this layer
- agent: hours for an AI agent + human review (typically 30-50% of human time)

Return ONLY valid JSON. All numeric values MUST be valid numbers (decimals/floats), not strings.

{{
    "needs_rnd": true,
    "needs_ui_design": true,
    "needs_frontend": true,
    "needs_db": true,
    "needs_backend": true,
    "subtasks": {{
        "rnd":       {{"human": 0.0, "agent": 0.0}},
        "ui_design": {{"human": 0.0, "agent": 0.0}},
        "frontend":  {{"human": 0.0, "agent": 0.0}},
        "db":        {{"human": 0.0, "agent": 0.0}},
        "backend":   {{"human": 0.0, "agent": 0.0}},
        "unit_test": {{"human": 0.0, "agent": 0.0}},
        "qa":        {{"human": 0.0, "agent": 0.0}}
    }},
    "reasoning": "explain which layers are needed and why"
}}

CRITICAL INSTRUCTION: Replace every 0.0 with the ACTUAL REALISTIC NUMBER OF HOURS you estimate for that layer. DO NOT leave them as 0.0 if the layer is TRUE. Use realistic floating point numbers (e.g., 2.5, 4.0).
"""
        
        try:
            result = await self.ai._call_gemini(prompt)
            if result and isinstance(result, list) and len(result) > 0:
                return self._fix_analysis(result[0])
            elif result and isinstance(result, dict):
                return self._fix_analysis(result)
        except Exception as e:
            print(f"AI feature analysis failed: {e}")
        
        return None

    def _fix_analysis(self, analysis: Dict) -> Dict:
        """Enforce co-dependency rules that the AI may have missed."""
        if not analysis or not isinstance(analysis, dict):
            return analysis

        # Rule: ui_design → frontend
        if analysis.get('needs_ui_design') and not analysis.get('needs_frontend'):
            analysis['needs_frontend'] = True
            subtasks = analysis.setdefault('subtasks', {})
            if 'frontend' not in subtasks or not subtasks['frontend']:
                subtasks['frontend'] = {"human": 4.0, "agent": 1.5}

        # Rule: frontend → backend
        if analysis.get('needs_frontend') and not analysis.get('needs_backend'):
            analysis['needs_backend'] = True
            subtasks = analysis.setdefault('subtasks', {})
            if 'backend' not in subtasks or not subtasks['backend']:
                subtasks['backend'] = {"human": 4.0, "agent": 1.5}

        # Rule: database → backend
        if analysis.get('needs_db') and not analysis.get('needs_backend'):
            analysis['needs_backend'] = True
            subtasks = analysis.setdefault('subtasks', {})
            if 'backend' not in subtasks or not subtasks['backend']:
                subtasks['backend'] = {"human": 3.0, "agent": 1.0}

        # Catch-all: If AI ignored instructions and returned FALSE for ALL build layers
        build_layers = ['needs_ui_design', 'needs_frontend', 'needs_db', 'needs_backend']
        if not any(analysis.get(layer) for layer in build_layers):
            # Force standard full-stack for generic features
            analysis['needs_ui_design'] = True
            analysis['needs_frontend'] = True
            analysis['needs_db'] = True
            analysis['needs_backend'] = True
            
            subtasks = analysis.setdefault('subtasks', {})
            subtasks.setdefault('ui_design', {"human": 3.0, "agent": 1.0})
            subtasks.setdefault('frontend', {"human": 5.0, "agent": 2.0})
            subtasks.setdefault('db', {"human": 3.0, "agent": 1.0})
            subtasks.setdefault('backend', {"human": 5.0, "agent": 2.0})

        # Rule: unit_test and qa ALWAYS present with realistic values
        subtasks = analysis.setdefault('subtasks', {})
        if 'unit_test' not in subtasks or float(subtasks.get('unit_test', {}).get('human', 0)) < 0.5:
            subtasks['unit_test'] = {"human": 2.0, "agent": 0.5}
        if 'qa' not in subtasks or float(subtasks.get('qa', {}).get('human', 0)) < 0.5:
            subtasks['qa'] = {"human": 2.0, "agent": 0.5}

        # Safety: zero-hour entries for active layers → apply sensible defaults
        defaults = {
            'rnd': (5.0, 2.0), 'ui_design': (3.0, 1.0), 'frontend': (5.0, 2.0),
            'db': (3.0, 1.0), 'backend': (5.0, 1.5)
        }
        flag_map = {
            'rnd': 'needs_rnd', 'ui_design': 'needs_ui_design',
            'frontend': 'needs_frontend', 'db': 'needs_db', 'backend': 'needs_backend'
        }
        for key, (h_def, a_def) in defaults.items():
            if analysis.get(flag_map[key]):
                entry = subtasks.get(key, {})
                if not entry or float(entry.get('human', 0)) < 0.5:
                    subtasks[key] = {"human": h_def, "agent": a_def}

        return analysis
    
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
        
        # UI/UX Design indicators
        ui_design_keywords = [
            'wireframe', 'mockup', 'prototype', 'ux flow', 'user flow',
            'design system', 'figma', 'sketch', 'layout design'
        ]
        needs_ui_design = any(keyword in text for keyword in ui_design_keywords) or any(
            keyword in text for keyword in ['dashboard', 'landing page', 'form', 'ui', 'ux']
        )
        
        # Frontend indicators
        frontend_keywords = [
            'ui', 'interface', 'dashboard', 'form', 'page', 'screen',
            'button', 'display', 'view', 'visualization', 'chart', 'graph',
            'modal', 'dialog', 'menu', 'navigation', 'user-facing', 'frontend',
            'react', 'component', 'css', 'html'
        ]
        needs_frontend = any(keyword in text for keyword in frontend_keywords)
        
        # DB indicators
        db_keywords = [
            'database', 'schema', 'table', 'model', 'migration', 'data structure',
            'entity', 'relationship', 'store', 'persist', 'save', 'crud',
            'collection', 'document', 'sql', 'nosql', 'query'
        ]
        needs_db = any(keyword in text for keyword in db_keywords)
        
        # Backend indicators
        backend_keywords = [
            'api', 'server', 'endpoint', 'route', 'middleware', 'authentication',
            'authorization', 'backend', 'service', 'controller', 'logic',
            'cron', 'job', 'webhook', 'integration', 'payment', 'email'
        ]
        needs_backend = any(keyword in text for keyword in backend_keywords)
        
        return {
            'needs_rnd': needs_rnd,
            'needs_ui_design': needs_ui_design,
            'needs_frontend': needs_frontend,
            'needs_db': needs_db,
            'needs_backend': needs_backend,
            'subtasks': {},  # No AI hours available in fallback — WBS engine will use defaults
            'reasoning': 'Keyword-based analysis (AI unavailable)'
        }
    
    def _calculate_hours(self, analysis: Dict) -> Dict:
        """Calculate hours for all phases based on analysis"""
        
        # If AI provided subtasks with per-layer hours, pass directly to WBS engine
        if 'subtasks' in analysis:
            return {**analysis}
        
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
