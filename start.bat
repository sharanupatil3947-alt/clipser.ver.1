@echo off
echo Starting Clipser Platform...
start cmd /k "cd backend && uvicorn app.main:app --reload --port 8000"
start cmd /k "cd frontend && npm run dev"
echo Clipser is launching!
echo Backend: http://localhost:8000/docs
echo Frontend: http://localhost:3000
