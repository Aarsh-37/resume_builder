# 🚀 Agentic AI Resume Builder

A full-stack, AI-powered application that leverages **CrewAI Agents** to generate professional, ATS-friendly resumes perfectly tailored to specific job descriptions. 

This project evolved from a standard markdown resume generator into a **Professional Career Hub** complete with live job scraping, interactive editable templates, and an end-to-end multi-agent coaching system.

---

## ✨ Features

- **🤖 Multi-Agent AI System (CrewAI)**: A team of highly specialized AI agents (Resume Writer, ATS Reviewer, Career Coach) work sequentially to evaluate and build your profile.
- **📝 Live Interactive UI Editor**: The generated resume isn't just static text—it's rendered into a beautiful, two-column CSS grid that you can click and edit *live* before exporting.
- **🌐 Real-Time Remote Job Scraping**: Integrates directly with the **Remotive API** to fetch live, verified software development jobs based on your exact profile.
- **💯 AI Job Scoring**: Every live job fetched is automatically scored against your profile (0-100%) by the ATS AI Agent, giving you clear insight into your match strength.
- **📄 Drag-and-Drop PDF Parsing**: Automatically extract your existing skills and experience by dropping your old resume PDF right into the browser.
- **📥 Flawless Export (PDF & Word)**: Export your heavily stylized, modified resume directly to an ATS-friendly PDF or Microsoft Word `.doc` file with absolute precision.
- **💼 Comprehensive Career Toolkit**: In addition to the resume, the AI generates:
  - **Cover Letters** tailored exactly to the target job (no hallucinated companies!).
  - **Skill Gap & ATS Reports** highlighting missing keywords.
  - **Improvement Plans** mapping out projects and certs to bridge your gaps.
  - **Interview Prep** grouped by Tech Stack, Projects, and Behavioral categories.

## 🛠️ Technology Stack

- **Frontend**: Next.js (React), Vanilla CSS (Glassmorphism + Dark Mode UI)
- **Backend**: Python, FastAPI
- **AI Orchestration**: CrewAI, Ollama (Llama 3.2 local model)
- **Utilities**: PyPDF2 (PDF Extraction), `@react-pdf/renderer` (PDF Export)

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Python 3.10+**
- **Ollama** installed and running locally with the `llama3.2` model.

### 2. Start the Backend
Navigate to the root directory, activate your virtual environment, and install dependencies:
```bash
pip install -r requirements.txt
```
Run the FastAPI server:
```bash
uvicorn api:app --reload --port 8000
```

### 3. Start the Frontend
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser and start building!

## 📌 Usage Flow
1. **Upload** your current resume PDF or paste your details.
2. **Define** your target job role (or paste a full Job Description).
3. **Generate** the AI suite to receive your parsed Resume, Cover Letter, ATS Report, and Interview Questions.
4. **Edit** your newly generated two-column resume interactively.
5. **Fetch Matches** to pull and score live remote jobs related to your field.
6. **Export** your polished resume to PDF or Word.
