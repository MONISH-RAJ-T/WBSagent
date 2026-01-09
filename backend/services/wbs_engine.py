"""
WBS Engine - Generates Work Breakdown Structure using 8+2 rule
"""
from typing import List, Dict
import uuid

class WBSEngine:
    def __init__(self):
        self.rule_82 = {"dev_hours": 8, "rnd_hours": 2}
    
    async def generate_wbs(self, project_name: str, features: List[str]) -> Dict:
        """Generate WBS from features using 8+2 rule"""
        tasks = []
        task_id_counter = 1
        
        for idx, feature in enumerate(features, 1):
            feature_id = f"F{idx}"
            
            # R&D Tasks (2 hours total)
            tasks.append({
                "id": f"T{task_id_counter}",
                "name": f"Research & Feasibility for {feature}",
                "description": f"Research technical approach and feasibility for {feature}",
                "duration_hours": 1.0,
                "dependencies": [],
                "level": 1,
                "parent_id": feature_id,
                "task_type": "R&D"
            })
            task_id_counter += 1
            
            tasks.append({
                "id": f"T{task_id_counter}",
                "name": f"Design & Architecture for {feature}",
                "description": f"Design system architecture and data models for {feature}",
                "duration_hours": 1.0,
                "dependencies": [f"T{task_id_counter-1}"],
                "level": 1,
                "parent_id": feature_id,
                "task_type": "R&D"
            })
            rnd_task_id = task_id_counter
            task_id_counter += 1
            
            # Development Tasks (8 hours total - 4 tasks x 2h each)
            dev_tasks = [
                ("Core Implementation", "Implement core functionality"),
                ("UI/UX Development", "Build user interface and experience"),
                ("Integration & Testing", "Integrate with system and test"),
                ("Bug Fixes & Polish", "Fix bugs and polish implementation")
            ]
            
            for task_name, task_desc in dev_tasks:
                tasks.append({
                    "id": f"T{task_id_counter}",
                    "name": f"{task_name} - {feature}",
                    "description": f"{task_desc} for {feature}",
                    "duration_hours": 2.0,
                    "dependencies": [f"T{rnd_task_id}"],
                    "level": 2,
                    "parent_id": feature_id,
                    "task_type": "Dev"
                })
                task_id_counter += 1
        
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
