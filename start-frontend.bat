@echo off
title JobConnect Frontend Server
cd /d "%~dp0frontend"
echo ==========================================
echo Starting JobConnect Frontend on Port 5173...
echo ==========================================
npm run dev
pause
