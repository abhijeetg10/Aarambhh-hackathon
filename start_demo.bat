@echo off
echo ====================================================
echo Starting BedFlow Platform...
echo ====================================================

echo [1/3] Checking Python Backend dependencies...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

echo [2/3] Starting FastAPI Backend on port 8000...
start "BedFlow Backend API" cmd /k "uvicorn main:app --reload --port 8000"

echo [3/3] Starting Vite Frontend on port 5173...
cd ..\frontend
start "BedFlow Frontend UI" cmd /k "npm run dev"

echo ====================================================
echo All services launched! 
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000/docs
echo ====================================================
