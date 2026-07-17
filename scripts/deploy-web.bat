@echo off
title appmass — Deploy to Appwrite Sites
cd /d "%~dp0.."

echo ========================================
echo   appmass — Deploy to Appwrite Sites
echo ========================================
echo.

:: Step 1: Build web
echo [1/3] Building Expo web export...
call npx expo export:web
if %errorlevel% neq 0 (
    echo FAILED: Build error
    pause
    exit /b 1
)
echo Done.
echo.

:: Step 2: Check Appwrite CLI
echo [2/3] Checking Appwrite CLI...
appwrite --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Appwrite CLI not found. Installing...
    call npm install -g appwrite-cli
    echo Run 'appwrite login' first, then run this script again.
    pause
    exit /b 1
)
echo Done.
echo.

:: Step 3: Deploy
echo [3/3] Deploying to Appwrite Sites...
node scripts\deploy-appwrite-sites.js
if %errorlevel% neq 0 (
    echo.
    echo FAILED: Deploy error.
    echo Try manual deploy: Console ^> Sites ^> Create Site
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Done! Site is live on Appwrite Sites
echo ========================================
echo.
pause
