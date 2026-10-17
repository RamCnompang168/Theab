Write-Host "=================================================" -ForegroundColor Yellow
Write-Host "  Starting Somboth Wedding Management Platform" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Yellow
Write-Host ""

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[1/2] Starting Backend API (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\theab_api'; Write-Host '--- Somboth Backend API ---' -ForegroundColor Green; npm start"

Write-Host "[2/2] Starting Frontend App (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\theab'; Write-Host '--- Somboth Frontend Next.js ---' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "=================================================" -ForegroundColor Yellow
Write-Host "  Both servers launched successfully!" -ForegroundColor Green
Write-Host "  • Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "  • Frontend App: http://localhost:3000" -ForegroundColor White
Write-Host "=================================================" -ForegroundColor Yellow
