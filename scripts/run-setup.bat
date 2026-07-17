@echo off
echo ========================================
echo   appmass — Appwrite Cloud Setup
echo ========================================
echo.
echo This script will create all database
echo collections and storage buckets.
echo.
node "%~dp0setup-appwrite.js"
if %errorlevel% neq 0 (
    echo.
    echo ❌ Setup failed. Make sure Node.js is installed.
    echo    Download from: https://nodejs.org
    pause
    exit /b 1
)
echo.
pause
