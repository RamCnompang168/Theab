@echo off
title Launching Somboth Full-Stack App...

echo ===================================================
echo   Starting Somboth Wedding Management Platform
echo ===================================================
echo.
echo [1/2] Starting Backend API on http://localhost:5000 ...
start "Somboth Backend API (Port 5000)" cmd /k "cd /d "%~dp0theab_api" && npm start"

echo.
echo [2/2] Starting Frontend App on http://localhost:3000 ...
start "Somboth Frontend App (Port 3000)" cmd /k "cd /d "%~dp0theab" && npm run dev"

echo.
echo ===================================================
echo   Both servers launched in separate windows!
echo   - Backend:  http://localhost:5000
echo   - Frontend: http://localhost:3000
echo ===================================================
timeout /t 5
