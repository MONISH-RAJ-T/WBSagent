# 🚀 WBS Generator - AI-Powered Work Breakdown Structure Tool

Transform project descriptions into structured, actionable task hierarchies using the proven **8+2 rule** (8 hours development + 2 hours R&D per feature).

## ✨ Features

- **AI-Powered Feature Extraction**: Automatically extracts features from project descriptions
- **8+2 Rule Engine**: Every feature = exactly 10 hours (8h Dev + 2h R&D)
- **Interactive Feature Editor**: Add, remove, and prioritize features
- **Professional Exports**: Excel, CSV, and JSON formats
- **Local AI Support**: Works with Ollama (DeepSeek-R1, Llama2) or Gemini API
- **No Database Required**: Stateless architecture for simplicity

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Fast, modern Python web framework
- **Ollama** - Local AI (DeepSeek-R1 or Llama2)
- **Gemini API** - Cloud AI fallback
- **openpyxl** - Excel generation
- **PyPDF2** - PDF parsing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Axios** - API client

## 📋 Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **npm or yarn**
- **Ollama** (optional, for local AI)

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend
cd backend
# Create virtual environment (if not already activated)
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Copy environment template
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac

# Start backend server
python app.py
```

Backend will run on: **http://localhost:8000**  
API Documentation: **http://localhost:8000/docs**

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

## 🔧 Configuration

### Backend (.env file)

```env
# Ollama (Local AI)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=deepseek-r1:7b
USE_OLLAMA=true

# Google Gemini (Cloud AI Fallback)
GEMINI_API_KEY=your_gemini_api_key_here
USE_GEMINI=false
```

### Frontend (.env.local file)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📖 Usage

1. **Start a New Project**
   - Go to http://localhost:3000
   - Click "Start New Project"
   - Enter project name and description
   - Or upload a PDF specification

2. **Review Generated Features**
   - AI extracts features automatically
   - Edit, add, or remove features as needed
   - Set priorities for each feature

3. **Generate WBS**
   - Click "Generate WBS"
   - Each feature is broken down into tasks
   - 8h Development + 2h R&D per feature

4. **Export Results**
   - Download as Excel (.xlsx)
   - Download as CSV (.csv)
   - Export as JSON

## 🎯 The 8+2 Rule

Every feature is broken down into exactly **10 hours**:
- **8 hours**: Development tasks (4 tasks × 2h each)
- **2 hours**: Research & Design (2 tasks × 1h each)

This ensures consistent, realistic project planning.

## 📁 Project Structure

```
wbs-application/
├── backend/                 # FastAPI Backend
│   ├── app.py              # Main application
│   ├── config.py           # Configuration
│   ├── requirements.txt    # Python dependencies
│   ├── routers/            # API endpoints
│   │   ├── wbs.py          # WBS generation
│   │   ├── export.py       # Export functionality
│   │   ├── features.py     # Feature extraction
│   │   └── ai.py           # AI testing
│   ├── services/           # Business logic
│   │   ├── ai_service.py   # AI integration
│   │   ├── wbs_engine.py   # WBS generation
│   │   ├── excel_generator.py  # Excel export
│   │   └── pdf_parser.py   # PDF parsing
│   └── models/             # Data models
│       └── schemas.py      # Pydantic models
│
└── frontend/               # Next.js Frontend
    ├── src/
    │   ├── app/            # Next.js pages
    │   ├── components/     # React components
    │   ├── services/       # API client
    │   └── types/          # TypeScript types
    ├── package.json
    └── tailwind.config.js
```

## 🔌 API Endpoints

### Features
- `POST /api/features/generate` - Generate features from description
- `POST /api/features/extract-pdf` - Extract features from PDF
- `POST /api/features/competitors` - Analyze competitors
- `POST /api/features/validate` - Validate feature list

### WBS
- `POST /api/wbs/generate` - Generate WBS from features
- `POST /api/wbs/validate` - Validate WBS structure
- `GET /api/wbs/stats/{project_name}` - Get WBS statistics

### Export
- `POST /api/export/excel` - Export to Excel
- `POST /api/export/csv` - Export to CSV
- `POST /api/export/json` - Export to JSON

### AI
- `POST /api/ai/test-ollama` - Test Ollama connection
- `POST /api/ai/test-gemini` - Test Gemini connection
- `GET /api/ai/models` - List available models

## 🐳 Docker Setup (Optional)

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down
```

## 🛠️ Development

### Backend Development
```bash
cd backend
# Auto-reload on file changes
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## 🧪 Testing

### Test Backend
```bash
cd backend
# Test API endpoints
curl http://localhost:8000/health
```

### Test AI Connection
```bash
# Test Ollama
curl -X POST http://localhost:8000/api/ai/test-ollama

# List models
curl http://localhost:8000/api/ai/models
```

## 📝 Example Workflow

### Path A: With Product Specs
1. Upload PDF specification → 
2. Extract features → 
3. Generate execution flow → 
4. Confirm → 
5. Generate WBS (8+2 rule) → 
6. Validate → 
7. Export to Excel

### Path B: Without Product Specs
1. Enter project name & description → 
2. AI researches competitors → 
3. Suggests features + enhancements → 
4. User edits feature list → 
5. Confirm → 
6. Generate WBS (8+2 rule) → 
7. Export to Excel

## 🤝 Contributing

Contributions welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Troubleshooting

### Backend won't start
- Make sure virtual environment is activated
- Install dependencies: `pip install -r requirements.txt`
- Check Python version: `python --version` (3.9+)

### Frontend won't start
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check Node version: `node --version` (18+)

### Ollama not working
- Install Ollama from https://ollama.ai
- Pull a model: `ollama pull deepseek-r1:7b`
- Check service: `ollama list`
- Use Gemini API as fallback

### Excel export fails
- Ensure `temp/exports` directory exists
- Check file permissions
- Try CSV export instead

## 🌟 Features Coming Soon
- [ ] PDF report generation
- [ ] Real-time collaboration
- [ ] Multiple project management
- [ ] Gantt chart visualization
- [ ] Team assignment features
- [ ] Time tracking integration

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check API documentation at `/docs`
- Review example workflows in documentation

---

**Built with ❤️ using FastAPI and Next.js**
