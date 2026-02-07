@echo off
echo Starting Image Update Fix...
cd /d "%~dp0backend"

echo Installing dependencies...
call npm init -y
call npm install pg axios dotenv

echo Running update script...
call node update_images.js

echo.
echo ==========================================
echo Fix completed! Please check if images exist in backend/uploads/products.
echo You can now close this window.
echo ==========================================
pause
