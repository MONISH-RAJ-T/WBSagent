"""
WBS Engine - Generates Work Breakdown Structure using 8+2 rule
"""
from typing import List, Dict
import uuid

class WBSEngine:
    def __init__(self):
        self.rule_82 = {"dev_hours": 8, "rnd_hours": 2}
    
    async def generate_wbs(self, project_name: str, features: List[Dict]) -> Dict:
        """Generate WBS from features using 8+2 rule with sequential execution order"""
        tasks = []
        task_id_counter = 1
        
        # Sort features by execution_order (features without order go last)
        sorted_features = sorted(
            features, 
            key=lambda f: f.get('execution_order') if hasattr(f, 'get') else getattr(f, 'execution_order', 999) or 999
        )
        
        # Track the last task ID from previous feature for linking
        previous_feature_last_task = None
        
        for idx, feature in enumerate(sorted_features, 1):
            # Handle feature as object or dict
            feature_name = feature.name if hasattr(feature, 'name') else feature.get('name')
            feature_id = feature.id if hasattr(feature, 'id') else feature.get('id', f"F{idx}")
            feature_order = feature.execution_order if hasattr(feature, 'execution_order') else feature.get('execution_order', idx)

            # R&D Tasks (2 hours total)
            # First R&D task depends on previous feature's last task
            initial_deps = [previous_feature_last_task] if previous_feature_last_task else []
            
            tasks.append({
                "id": f"T{task_id_counter}",
                "name": f"Research & Feasibility for {feature_name}",
                "description": f"Research technical approach and feasibility for {feature_name}",
                "duration_hours": 1.0,
                "dependencies": initial_deps,
                "level": 1,
                "parent_id": feature_id,
                "task_type": "R&D"
            })
            task_id_counter += 1
            
            tasks.append({
                "id": f"T{task_id_counter}",
                "name": f"Design & Architecture for {feature_name}",
                "description": f"Design system architecture and data models for {feature_name}",
                "duration_hours": 1.0,
                "dependencies": [f"T{task_id_counter-1}"],
                "level": 1,
                "parent_id": feature_id,
                "task_type": "R&D"
            })
            rnd_task_id = f"T{task_id_counter}"
            task_id_counter += 1
            
            # Development Tasks (8 hours total - 4 tasks x 2h each)
            dev_tasks = [
                ("Core Implementation", "Implement core functionality"),
                ("UI/UX Development", "Build user interface and experience"),
                ("Integration & Testing", "Integrate with system and test"),
                ("Bug Fixes & Polish", "Fix bugs and polish implementation")
            ]
            
            previous_task = rnd_task_id
            
            for task_name, task_desc in dev_tasks:
                tasks.append({
                    "id": f"T{task_id_counter}",
                    "name": f"{task_name} - {feature_name}",
                    "description": f"{task_desc} for {feature_name}",
                    "duration_hours": 2.0,
                    "dependencies": [previous_task],
                    "level": 2,
                    "parent_id": feature_id,
                    "task_type": "Dev"
                })
                previous_task = f"T{task_id_counter}"
                task_id_counter += 1
            
            # Store last task of this feature for next feature's dependency
            previous_feature_last_task = previous_task
        
        total_hours = sum(task["duration_hours"] for task in tasks)
        
        return {
            "project_name": project_name,
            "tasks": tasks,
            "total_tasks": len(tasks),
            "total_hours": total_hours
        }
    
    def validate_wbs(self, tasks: List[Dict]) -> Dict:
        """Validate WBS structure"""
        total_hours = sum(task.get("duration_hours", 0) for task in tasks)
        dev_hours = sum(task.get("duration_hours", 0) for task in tasks if task.get("task_type") == "Dev")
        rnd_hours = sum(task.get("duration_hours", 0) for task in tasks if task.get("task_type") == "R&D")
        
        issues = []
        
        # Check 8+2 rule compliance
        if dev_hours > 0 and rnd_hours > 0:
            ratio = dev_hours / rnd_hours
            if ratio < 3.5 or ratio > 4.5:  # Should be 4:1 ratio
                issues.append(f"Dev/R&D ratio ({ratio:.1f}:1) doesn't match 8+2 rule (4:1)")
        
        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "total_hours": total_hours,
            "dev_hours": dev_hours,
            "rnd_hours": rnd_hours,
            "total_tasks": len(tasks)
        }
