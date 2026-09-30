@echo off
title Job Connect Launcher
cd /d "%~dp0"
python run.py
if errorlevel 1 (
    echo.
    echo Python failed or not found in PATH. Trying fallback batch scripts...
    call "start-all.bat"
)
pause
