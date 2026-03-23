@echo off
echo Starting AlistoAI Developer Environment...
echo ------------------------------------------

if not exist node_modules (
    echo [1/2] Installing dependencies... This may take a minute.
    call npm install
) else (
    echo [1/2] node_modules found, skipping install.
)

echo [2/2] Starting Expo Server...
call npx expo start -c
pause
