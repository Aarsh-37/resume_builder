# AI Resume Builder

A full-stack application that leverages AI to generate professional, ATS-friendly resumes perfectly tailored to specific job descriptions. 

## Features
- **AI-Powered Generation**: Built with CrewAI, the app uses agents to analyze job descriptions and optimize your profile.
- **LaTeX Export**: The resume is generated as a raw `.tex` file using a premium, 1-page professional template. It can be instantly compiled to PDF using Overleaf.
- **Next.js Frontend**: A sleek, dark-mode, glassmorphism UI built with Next.js (App Router).
- **FastAPI Backend**: A highly concurrent Python backend that bridges the AI agents with the frontend.

## Getting Started

### 1. Start the Backend
Navigate to the root directory and activate your virtual environment, then run:
```bash
uvicorn api:app --reload --port 8000
```

### 2. Start the Frontend
Navigate to the `frontend` directory and start the Next.js server:
```bash
cd frontend
npm run dev
```

Open `http://localhost:3000` in your browser.

## How to use the LaTeX Resume
1. Generate your resume using the UI.
2. Click **Download LaTeX (.tex)**.
3. Drag and drop the downloaded file into [Overleaf.com](https://www.overleaf.com/) to render your perfect PDF!
