# appmass — Push to GitHub
# Run this in PowerShell:  powershell -ExecutionPolicy Bypass -File scripts\push-to-github.ps1

$repoPath = "C:\Users\student\Documents\appmass"
$repoUrl = "https://github.com/lab005-cyber/appmass.git"

Set-Location $repoPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  appmass — Pushing to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Init
Write-Host "`n[1/5] Initializing repo..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "[2/5] Adding files..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "[3/5] Committing..." -ForegroundColor Yellow
git commit -m "initial commit: appmass messaging + social media app"

# Branch
Write-Host "[4/5] Setting main branch..." -ForegroundColor Yellow
git branch -M main

# Push
Write-Host "[5/5] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "`nEnter your GitHub credentials when prompted" -ForegroundColor Gray
git remote add origin $repoUrl
git push -u origin main

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✅ Done!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " $repoUrl" -ForegroundColor Blue
pause
