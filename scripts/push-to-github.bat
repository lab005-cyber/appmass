@echo off
cd /d "C:\Users\student\Documents\appmass"

echo ========================================
echo   appmass — Push to GitHub
echo ========================================
echo.

echo [1/5] Initializing repo...
git init
if %errorlevel% neq 0 goto :error

echo [2/5] Adding files...
git add .
if %errorlevel% neq 0 goto :error

echo [3/5] Committing...
git commit -m "initial commit: appmass messaging + social media app"
if %errorlevel% neq 0 goto :error

echo [4/5] Setting main branch...
git branch -M main
if %errorlevel% neq 0 goto :error

echo [5/5] Pushing to GitHub...
echo.
echo When prompted, enter your GitHub username and Personal Access Token
echo (Create token at: https://github.com/settings/tokens)
echo.
git remote add origin https://github.com/lab005-cyber/appmass.git
git push -u origin main
if %errorlevel% neq 0 goto :error

echo.
echo ========================================
echo   ✅ Done! Pushed to GitHub
echo ========================================
echo   https://github.com/lab005-cyber/appmass
echo.
pause
exit /b 0

:error
echo.
echo ❌ Failed at a step above. Check the error message.
pause
exit /b 1
