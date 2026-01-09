"""
PDF Parser Service - Extract text from specification PDFs
"""
import PyPDF2
import tempfile
import os
from typing import List, Dict

class PDFParser:
    def __init__(self):
        self.supported_formats = ['.pdf']
    
    def extract_text(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                return self._clean_text(text)
        except Exception as e:
            raise Exception(f"PDF parsing failed: {str(e)}")
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize extracted text"""
        lines = text.split('\n')
        cleaned = []
        for line in lines:
            line = line.strip()
            if len(line) > 3 and not line.startswith('Page '):
                cleaned.append(line)
        return ' '.join(cleaned[:5000])  # Limit to first 5000 chars
    
    def parse_features_from_pdf(self, text: str, project_name: str) -> List[Dict]:
        """Extract potential features from PDF text"""
        # Simple heuristic-based feature extraction
        feature_keywords = [
            'feature', 'function', 'user story', 'requirement', 'as a', 'should',
            'login', 'register', 'dashboard', 'search', 'profile', 'payment'
        ]
        
        sentences = text.split('.')
        potential_features = []
        
        for sentence in sentences:
            sentence_lower = sentence.lower()
            if any(keyword in sentence_lower for keyword in feature_keywords):
                potential_features.append({
                    "name": sentence.strip()[:100],
                    "description": sentence.strip(),
                    "confidence": 0.7  # Heuristic score
                })
        
        return potential_features[:20]  # Top 20 features
