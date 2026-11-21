@echo off
echo Starting Clipser Platform...
start "Clipser Backend API" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
start "Clipser Frontend UI" cmd /k "cd frontend && npm run dev"
echo Clipser is launching!
echo Backend Docs: http://localhost:8000/docs
echo Frontend App:  http://localhost:3000
