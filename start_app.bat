@echo off
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%backend"

if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment for backend...
    python -m venv venv
    call .\venv\Scripts\activate.bat
    echo Installing backend dependencies...
    pip install -r requirements.txt
) else (
    call .\venv\Scripts\activate.bat
)

start "Anamaya AI Backend" cmd /k "python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

cd /d "%SCRIPT_DIR%website"
start "Anamaya AI Web Frontend" cmd /k "python -m http.server 8001"

echo.
echo Anamaya AI Backend and Frontend have been started.
echo Web UI: http://localhost:8001
echo API Health Check: http://localhost:8000/health
echo API Docs (Swagger): http://localhost:8000/docs
echo.
exit /b 0
