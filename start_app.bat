@echo off
cd /d "C:\Users\shahreena\OneDrive\Desktop\HealthSphere AI\backend"
call .\venv\Scripts\activate.bat
start "Backend" cmd /k "python app/main.py"

cd /d "C:\Users\shahreena\OneDrive\Desktop\HealthSphere AI\website"
start "Frontend" cmd /k "python -m http.server 8001"

echo.
echo Backend and frontend have been started.
echo Open: http://localhost:8001
echo Health check: http://localhost:8000/health
echo.
exit /b 0
