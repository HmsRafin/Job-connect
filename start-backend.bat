@echo off
title JobConnect Backend Server
cd /d "%~dp0backend"
echo ==========================================
echo Starting JobConnect Backend on Port 8000...
echo ==========================================
if exist "C:\Users\saifs\.config\herd-lite\bin\php.exe" (
    "C:\Users\saifs\.config\herd-lite\bin\php.exe" artisan serve --host=127.0.0.1 --port=8000
) else if exist "C:\Users\hmsra\php\php.exe" (
    "C:\Users\hmsra\php\php.exe" artisan serve --host=127.0.0.1 --port=8000
) else (
    php artisan serve --host=127.0.0.1 --port=8000
)
pause
