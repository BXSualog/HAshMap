# AlistoAI - Single Click Startup Script
Write-Host "Starting AlistoAI Developer Environment..." -ForegroundColor Cyan

if (-not (Test-Path "node_modules")) {
    Write-Host "[1/2] Installing dependencies... This may take a minute." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "[1/2] node_modules found, skipping install." -ForegroundColor Green
}

Write-Host "[2/2] Starting Expo Server..." -ForegroundColor Cyan
npx expo start -c
