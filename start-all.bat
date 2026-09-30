@echo off
echo ==========================================
echo Starting JobConnect Full Stack Platform...
echo ==========================================
start "JobConnect Backend" cmd /c "%~dp0start-backend.bat"
start "JobConnect Frontend" cmd /c "%~dp0start-frontend.bat"
echo.
echo Both servers are launching in separate windows!
echo Frontend: http://localhost:5173
echo Backend:  http://127.0.0.1:8000
echo ==========================================
timeout /t 5
