# 🚀 Quick Start - Run WBS Generator

## Install & Run in 3 Steps

### Step 1: Backend
```powershell
cd backend
.\venv\Scripts\Activate
pip install -r requirements.txt
python app.py
```
→ Backend runs on http://localhost:8000

### Step 2: Frontend
```powershell
cd frontend
npm install
npm run dev
```
→ Frontend runs on http://localhost:3001

### Step 3: Configure
Edit `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```
Get key: https://makersuite.google.com/app/apikey

---

## ✅ All Required Packages

### Backend (`requirements.txt`)
```
fastapi==0.115.0
uvicorn[standard]==0.30.6
pydantic>=2.10.0
pydantic-settings>=2.6.0
python-multipart==0.0.9
openpyxl==3.1.5
PyPDF2==3.0.1
httpx==0.27.0
python-dotenv==1.0.1
google-genai>=0.2.0
pytesseract>=0.3.10
Pillow>=10.0.0
PyMuPDF>=1.23.0
reportlab>=4.0.0
```

### Frontend (`package.json` dependencies)
```json
{
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "@mui/icons-material": "^7.3.7",
  "@mui/material": "^7.3.7",
  "axios": "^1.7.7",
  "clsx": "^2.1.1",
  "next": "^14.2.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

---

## 🧪 Test It
- Backend health: http://localhost:8000/health
- API docs: http://localhost:8000/docs
- Frontend: http://localhost:3001/project

Done! 🎉
