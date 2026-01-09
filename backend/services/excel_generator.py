"""
Excel Generator - Creates formatted Excel files for WBS export
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from typing import List, Dict
import os
from datetime import datetime

class ExcelGenerator:
    def __init__(self):
        self.export_dir = "temp/exports"
        os.makedirs(self.export_dir, exist_ok=True)
    
    def generate_excel(self, project_name: str, tasks: List[Dict]) -> str:
        """Generate Excel file from WBS tasks"""
        wb = Workbook()
        ws = wb.active
        ws.title = "WBS"
        
        # Header styling
        header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
        header_font = Font(bold=True, color="FFFFFF", size=12)
        border = Border(
            left=Side(style='thin'),
            right=Side(style='thin'),
            top=Side(style='thin'),
            bottom=Side(style='thin')
        )
        
        # Headers
        headers = ["ID", "Task Name", "Description", "Type", "Hours", "Level", "Dependencies"]
        for col, header in enumerate(headers, 1):
            cell = ws.cell(row=1, column=col, value=header)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.border = border
        
        # Data rows
        for row_idx, task in enumerate(tasks, 2):
            # Task Type color coding
            if task.get("task_type") == "Dev":
                fill = PatternFill(start_color="E7E6FD", end_color="E7E6FD", fill_type="solid")
            else:  # R&D
                fill = PatternFill(start_color="FFF2CC", end_color="FFF2CC", fill_type="solid")
            
            # Write data
            data = [
                task.get("id", ""),
                task.get("name", ""),
                task.get("description", ""),
                task.get("task_type", ""),
                task.get("duration_hours", 0),
                task.get("level", 1),
                ", ".join(task.get("dependencies", []))
            ]
            
            for col, value in enumerate(data, 1):
                cell = ws.cell(row=row_idx, column=col, value=value)
                cell.border = border
                cell.alignment = Alignment(vertical="center", wrap_text=True)
                if col in [4, 5]:  # Type and Hours columns
                    cell.fill = fill
                    cell.alignment = Alignment(horizontal="center", vertical="center")
        
        # Column widths
        ws.column_dimensions['A'].width = 10
        ws.column_dimensions['B'].width = 40
        ws.column_dimensions['C'].width = 50
        ws.column_dimensions['D'].width = 10
        ws.column_dimensions['E'].width = 10
        ws.column_dimensions['F'].width = 8
        ws.column_dimensions['G'].width = 20
        
        # Summary section
        summary_row = len(tasks) + 3
        ws.cell(row=summary_row, column=1, value="Summary").font = Font(bold=True, size=14)
        
        total_hours = sum(task.get("duration_hours", 0) for task in tasks)
        dev_hours = sum(task.get("duration_hours", 0) for task in tasks if task.get("task_type") == "Dev")
        rnd_hours = sum(task.get("duration_hours", 0) for task in tasks if task.get("task_type") == "R&D")
        
        ws.cell(row=summary_row+1, column=1, value="Total Tasks:").font = Font(bold=True)
        ws.cell(row=summary_row+1, column=2, value=len(tasks))
        
        ws.cell(row=summary_row+2, column=1, value="Total Hours:").font = Font(bold=True)
        ws.cell(row=summary_row+2, column=2, value=total_hours)
        
        ws.cell(row=summary_row+3, column=1, value="Dev Hours:").font = Font(bold=True)
        ws.cell(row=summary_row+3, column=2, value=dev_hours)
        
        ws.cell(row=summary_row+4, column=1, value="R&D Hours:").font = Font(bold=True)
        ws.cell(row=summary_row+4, column=2, value=rnd_hours)
        
        # Save file
        safe_name = project_name.replace(" ", "_").replace("/", "_")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{safe_name}_WBS_{timestamp}.xlsx"
        filepath = os.path.join(self.export_dir, filename)
        
        wb.save(filepath)
        return filepath
