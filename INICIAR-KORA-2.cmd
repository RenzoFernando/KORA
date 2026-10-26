@echo off
cd /d "%~dp0"
if not exist "node_modules\vite\bin\vite.js" call npm install
call npm run dev -- --open
pause
