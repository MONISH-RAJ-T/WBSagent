# 🚀 QUICK START GUIDE - WBS Generator

Get up and running in **5 minutes**!

## ⚡ Prerequisites Check

```bash
# Check Python version (need 3.9+)
python --version

# Check Node version (need 18+)
node --version

# Check npm
npm --version
```

## 🎯 Step-by-Step Setup

### Step 1: Backend Setup (3 minutes)

```powershell
# Open PowerShell in project root

# Navigate to backend
cd backend

# IMPORTANT: Activate virtual environment
.\venv\Scripts\activate

# You should see (venv) in your terminal now

# Install ALL dependencies
pip install -r requirements.txt

# This installs:
# - fastapi
# - uvicorn
# - pydantic
# - pydantic-settings
# - python-multipart
# - openpyxl
# - PyPDF2
# - httpx
# - python-dotenv

# Create environment file
copy .env.example .env

# Start backend server
python app.py
```

**Expected Output:**
```
🚀 WBS Generator starting...
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test it:** Open browser → http://localhost:8000/docs  
You should see the FastAPI Swagger UI! ✅

---

### Step 2: Frontend Setup (2 minutes)

```powershell
# Open NEW PowerShell window

# Navigate to frontend
cd frontend

# Install dependencies (takes 1-2 minutes)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

**Test it:** Open browser → http://localhost:3000  
You should see the beautiful WBS Generator home page! ✅

---

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:8000
- [ ] API docs visible at http://localhost:8000/docs
- [ ] Frontend running on http://localhost:3000
- [ ] Home page displays correctly
- [ ] No console errors

## 🎉 You're Ready!

### Try It Out:

1. Click "Start New Project" on home page
2. Enter project details:
   - **Project Name**: "Meeting Notes App"
   - **Description**: "A mobile app to record and transcribe meeting notes with AI"
3. Click "Generate Features"
4. See AI-generated features appear!

---

## 🐛 Troubleshooting

### ❌ "ModuleNotFoundError: No module named 'fastapi'"

**Problem:** Virtual environment not activated or dependencies not installed

**Solution:**
```powershell
cd backend
.\venv\Scripts\activate  # You MUST see (venv) in terminal
pip install -r requirements.txt
python app.py
```

### ❌ "npm install" fails

**Problem:** Node modules corrupted or version mismatch

**Solution:**
```powershell
cd frontend
rm -rf node_modules package-lock.json  # or delete manually
npm install
```

### ❌ Frontend shows "Failed to fetch"

**Problem:** Backend not running

**Solution:**
1. Check backend is running on port 8000
2. Visit http://localhost:8000/health - should return `{"status":"healthy"}`
3. Restart backend if needed

### ❌ Port already in use

**Backend (8000):**
```powershell
# Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <process_id> /F
```

**Frontend (3000):**
```powershell
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

---

## 🚀 Next Steps

### Optional: Setup Ollama (Local AI)

1. **Download Ollama**: https://ollama.ai
2. **Install** and start Ollama
3. **Pull a model**:
   ```bash
   ollama pull deepseek-r1:7b
   # or
   ollama pull llama2
   ```
4. **Update .env**:
   ```env
   USE_OLLAMA=true
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=deepseek-r1:7b
   ```
5. **Restart backend**

**Test AI:**
```bash
curl -X POST http://localhost:8000/api/ai/test-ollama
```

### Without Ollama (Mock Mode)

Don't worry! The app works perfectly without Ollama:
- Uses intelligent mock data
- Generates realistic features
- All functionality works

To use Gemini API instead:
1. Get API key from https://makersuite.google.com/app/apikey
2. Update `.env`: `GEMINI_API_KEY=your_key_here`
3. Set `USE_GEMINI=true`

---

## 📚 What's Working Now

✅ **Backend:**
- All API endpoints functional
- Feature extraction (with AI or mocks)
- WBS generation (8+2 rule)
- Excel/CSV/JSON export
- API documentation

✅ **Frontend:**
- Beautiful home page
- Project input form
- Feature editor (interactive)
- WBS table display
- Type-safe API calls

---

## 🎯 Complete Workflow

1. **Home page** → Click "Start New Project"
2. **Project form** → Enter name & description → "Generate Features"
3. **Features list** → Edit/add/remove features → "Generate WBS"
4. **WBS table** → Review tasks (8h Dev + 2h R&D per feature)
5. **Export** → Download as Excel/CSV/JSON

---

## Need Help?

- **API Docs**: http://localhost:8000/docs
- **Check logs**: Look at terminal output for errors
- **Test API**: Use Swagger UI to test individual endpoints
- **Frontend errors**: Check browser console (F12)

---

**Time to complete**:  
Backend: 3 minutes  
Frontend: 2 minutes  
**Total: 5 minutes** ⚡

**You're all set! Start building incredible WBS structures!** 🚀
