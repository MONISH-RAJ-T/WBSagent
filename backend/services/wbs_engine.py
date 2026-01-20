"""
WBS Engine - Intelligent Work Breakdown Structure Generation
Uses conditional task generation with mandatory quality gates
"""
from typing import List, Dict
import uuid


class WBSEngine:
    def __init__(self):
        # Legacy support (no longer used)
        self.rule_82 = {"dev_hours": 8, "rnd_hours": 2}
        
    async def generate_wbs(self, project_name: str, features: List[Dict]) -> Dict:
        """
        Generate WBS from features using intelligent conditional task breakdown.
        
        Each feature is analyzed for:
        - Conditional R&D phase (if complex/new tech)
        - Conditional UI/UX design (if user-facing)
        - Conditional DB schema design (if data modeling)
        - Optimized development time (4-12 hours based on complexity)
        - MANDATORY Unit Testing (20% of dev time)
        - MANDATORY QA Testing (2 hours fixed)
        """
        tasks = []
        task_id_counter = 1
        
        # Helper to ensure dependencies are clean strings (NO None values)
        def clean_deps(deps):
            """Remove None values from dependencies list"""
            if not deps:
                return []
            return [d for d in deps if d and isinstance(d, str)]
        
        # Sort features by execution_order (handle None values)
        sorted_features = sorted(
            features, 
            key=lambda f: (f.get('execution_order') or 999) if hasattr(f, 'get') else (getattr(f, 'execution_order', None) or 999)
        )
        
        # Track the last task ID from previous feature for sequential dependencies
        previous_feature_last_task = None
        
        for idx, feature in enumerate(sorted_features, 1):
            # Extract feature data (handle both dict and object)
            feature_name = feature.name if hasattr(feature, 'name') else feature.get('name')
            feature_id = feature.id if hasattr(feature, 'id') else feature.get('id', f"F{idx}")
            feature_order = feature.execution_order if hasattr(feature, 'execution_order') else feature.get('execution_order', idx)
            
            # Get feature analysis (from FeatureAnalysisService)
            analysis = feature.analysis if hasattr(feature, 'analysis') else feature.get('analysis', {})
            
            # If no analysis exists, use default values
            if not analysis:
                analysis = {
                    'needs_rnd': False,
                    'needs_ui': True,
                    'needs_db': False,
                    'dev_hours': 8.0,
                    'rnd_hours': 0.0,
                    'ui_hours': 0.0,
                    'db_hours': 0.0,
                    'unit_test_hours': 1.6,
                    'qa_hours': 2.0,
                    'dev_complexity': 'medium'
                }
            else:
                # Convert to dict if it's an object
                if hasattr(analysis, 'dict'):
                    analysis = analysis.dict()
            
            # Start building tasks for this feature
            feature_tasks = []
            initial_deps = clean_deps([previous_feature_last_task]) if previous_feature_last_task else []
            current_deps = initial_deps.copy()
            
            # CONDITIONAL: R&D Phase
            if analysis.get('needs_rnd', False):
                rnd_hours = analysis.get('rnd_hours', 2.0)
                rnd_task_id = f"T{task_id_counter}"
                
                tasks.append({
                    "id": rnd_task_id,
                    "name": f"R&D: Research & Design - {feature_name}",
                    "description": f"Research technical approach, evaluate options, and design architecture for {feature_name}",
                    "duration_hours": rnd_hours,
                    "dependencies": clean_deps(current_deps),
                    "level": 1,
                    "parent_id": feature_id,
                    "task_type": "R&D"
                })
                current_deps = [rnd_task_id]
                task_id_counter += 1
            
            # CONDITIONAL: UI/UX Design Phase
            if analysis.get('needs_ui', False):
                ui_hours = analysis.get('ui_hours', 2.0)
                ui_task_id = f"T{task_id_counter}"
                
                tasks.append({
                    "id": ui_task_id,
                    "name": f"UI/UX Design - {feature_name}",
                    "description": f"Design user interface, mockups, and user experience flow for {feature_name}",
                    "duration_hours": ui_hours,
                    "dependencies": clean_deps(current_deps),
                    "level": 1,
                    "parent_id": feature_id,
                    "task_type": "UI/UX"
                })
                current_deps = [ui_task_id]
                task_id_counter += 1
            
            # CONDITIONAL: Database Schema Design Phase
            if analysis.get('needs_db', False):
                db_hours = analysis.get('db_hours', 2.0)
                db_task_id = f"T{task_id_counter}"
                
                tasks.append({
                    "id": db_task_id,
                    "name": f"DB Schema Design - {feature_name}",
                    "description": f"Design database schema, models, and data relationships for {feature_name}",
                    "duration_hours": db_hours,
                    "dependencies": clean_deps(current_deps),
                    "level": 1,
                    "parent_id": feature_id,
                    "task_type": "DB"
                })
                current_deps = [db_task_id]
                task_id_counter += 1
            
            # ALWAYS: Development Tasks
            dev_hours = analysis.get('dev_hours', 8.0)
            dev_complexity = analysis.get('dev_complexity', 'medium')
            
            # Generate development tasks based on total dev hours
            dev_tasks = self._generate_dev_tasks(
                feature_name=feature_name,
                feature_id=feature_id,
                total_dev_hours=dev_hours,
                complexity=dev_complexity,
                initial_deps=current_deps,
                task_id_start=task_id_counter
            )
            
            tasks.extend(dev_tasks)
            
            # Track last dev task ID
            last_dev_task = dev_tasks[-1]['id']
            task_id_counter += len(dev_tasks)
            
            # MANDATORY: Unit Testing (20% of dev time)
            unit_test_hours = analysis.get('unit_test_hours', round(dev_hours * 0.2, 1))
            unit_test_task_id = f"T{task_id_counter}"
            
            tasks.append({
                "id": unit_test_task_id,
                "name": f"Unit Testing - {feature_name}",
                "description": f"Write and execute unit tests for {feature_name} (20% dev time)",
                "duration_hours": unit_test_hours,
                "dependencies": clean_deps([last_dev_task]),
                "level": 2,
                "parent_id": feature_id,
                "task_type": "Unit Testing"
            })
            task_id_counter += 1
            
            # MANDATORY: QA Testing (Fixed 2 hours)
            qa_hours = analysis.get('qa_hours', 2.0)
            qa_task_id = f"T{task_id_counter}"
            
            tasks.append({
                "id": qa_task_id,
                "name": f"QA Testing - {feature_name}",
                "description": f"Manual QA validation and quality assurance for {feature_name}",
                "duration_hours": qa_hours,
                "dependencies": clean_deps([unit_test_task_id]),
                "level": 2,
                "parent_id": feature_id,
                "task_type": "QA Testing"
            })
            
            # Store last task of this feature for next feature's dependency
            previous_feature_last_task = qa_task_id
            task_id_counter += 1
        
        total_hours = sum(task["duration_hours"] for task in tasks)
        
        return {
            "project_name": project_name,
            "tasks": tasks,
            "total_tasks": len(tasks),
            "total_hours": round(total_hours, 1)
        }
    
    def _generate_dev_tasks(
        self, 
        feature_name: str, 
        feature_id: str,
        total_dev_hours: float,
        complexity: str,
        initial_deps: List[str],
        task_id_start: int
    ) -> List[Dict]:
        """Generate development tasks based on total hours and complexity"""
        
        # Determine how many tasks to create based on hours
        if total_dev_hours <= 4:
            # Simple: 2 tasks
            num_tasks = 2
            task_names = [
                ("Implementation", "Implement core functionality"),
                ("Testing & Polish", "Test and polish implementation")
            ]
        elif total_dev_hours <= 8:
            # Medium: 4 tasks
            num_tasks = 4
            task_names = [
                ("Core Implementation", "Implement core functionality"),
                ("UI/Backend Integration", "Build and integrate UI/backend components"),
                ("Integration Testing", "Integrate with system and test"),
                ("Bug Fixes & Polish", "Fix bugs and polish implementation")
            ]
        else:
            # Complex: 6 tasks
            num_tasks = 6
            task_names = [
                ("Core Architecture", "Build foundational architecture"),
                ("Core Implementation", "Implement core functionality"),
                ("UI Development", "Build user interface components"),
                ("Backend Integration", "Integrate backend services"),
                ("System Integration", "Integrate with existing system"),
                ("Bug Fixes & Optimization", "Fix bugs and optimize performance")
            ]
        
        hours_per_task = round(total_dev_hours / num_tasks, 1)
        dev_tasks = []
        previous_task = initial_deps[0] if initial_deps else None
        
        for i, (task_name, task_desc) in enumerate(task_names, 1):
            task_id = f"T{task_id_start + i - 1}"
            
            # Clean dependencies to prevent None values
            clean_previous = [previous_task] if previous_task and isinstance(previous_task, str) else []
            
            dev_tasks.append({
                "id": task_id,
                "name": f"{task_name} - {feature_name}",
                "description": f"{task_desc} for {feature_name}",
                "duration_hours": hours_per_task,
                "dependencies": clean_previous,
                "level": 2,
                "parent_id": feature_id,
                "task_type": "Dev"
            })
            previous_task = task_id
        
        return dev_tasks
    
    def validate_wbs(self, tasks: List[Dict]) -> Dict:
        """Validate WBS structure and quality gates"""
        total_hours = sum(task.get("duration_hours", 0) for task in tasks)
        dev_hours = sum(task.get("duration_hours", 0) for task in tasks if task.get("task_type") == "Dev")
        rnd_hours = sum(task.get("duration_hours", 0) for task in tasks if task.get("task_type") == "R&D")
        ui_hours = sum(task.get("duration_hours", 0) for task in tasks if task.get("task_type") == "UI/UX")
        db_hours = sum(task.get("duration_hours", 0) for task in tasks if task.get("task_type") == "DB")
        unit_test_hours = sum(task.get("duration_hours", 0) for task in tasks if task.get("task_type") == "Unit Testing")
        qa_hours = sum(task.get("duration_hours", 0) for task in tasks if task.get("task_type") == "QA Testing")
        
        issues = []
        
        # Validate mandatory quality gates
        unit_test_tasks = [t for t in tasks if t.get("task_type") == "Unit Testing"]
        qa_test_tasks = [t for t in tasks if t.get("task_type") == "QA Testing"]
        
        # Count unique features (by parent_id)
        feature_ids = set(task.get("parent_id") for task in tasks if task.get("parent_id"))
        num_features = len(feature_ids)
        
        if len(unit_test_tasks) < num_features:
            issues.append(f"Missing unit testing tasks: expected {num_features}, found {len(unit_test_tasks)}")
        
        if len(qa_test_tasks) < num_features:
            issues.append(f"Missing QA testing tasks: expected {num_features}, found {len(qa_test_tasks)}")
        
        # Validate unit testing is approximately 20% of dev time
        if dev_hours > 0 and unit_test_hours > 0:
            test_ratio = unit_test_hours / dev_hours
            if test_ratio < 0.15 or test_ratio > 0.25:
                issues.append(f"Unit test ratio ({test_ratio:.1%}) should be ~20% of dev time")
        
        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "total_hours": round(total_hours, 1),
            "dev_hours": round(dev_hours, 1),
            "rnd_hours": round(rnd_hours, 1),
            "ui_hours": round(ui_hours, 1),
            "db_hours": round(db_hours, 1),
            "unit_test_hours": round(unit_test_hours, 1),
            "qa_hours": round(qa_hours, 1),
            "total_tasks": len(tasks),
            "num_features": num_features
        }
