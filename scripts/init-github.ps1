# appmass — GitHub Setup Script
# Paste this entire script into PowerShell and press Enter
# It will: install Git, init the repo, commit, and push

$ErrorActionPreference = "Stop"
$repoPath = "C:\Users\student\Documents\appmass"
$repoUrl = "https://github.com/lab005-cyber/appmass.git"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  appmass — GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Install Git if not present
try {
    $gitVersion = git --version
    Write-Host "✅ Git already installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "📥 Installing Git..." -ForegroundColor Yellow
    $gitUrl = "https://github.com/git-for-windows/git/releases/download/v2.45.0.windows.1/Git-2.45.0-64-bit.exe"
    $installer = "$env:TEMP\git-installer.exe"
    
    Write-Host "   Downloading..." -ForegroundColor Gray
    Invoke-WebRequest -Uri $gitUrl -OutFile $installer -UseBasicParsing
    
    Write-Host "   Installing (silent)..." -ForegroundColor Gray
    Start-Process -Wait -FilePath $installer -ArgumentList "/VERYSILENT", "/NORESTART", "/NOCANCEL", "/SP-", "/CLOSEAPPLICATIONS", "/RESTARTAPPLICATIONS", "/SUPPRESSMSGBOXES", "/DIR=C:\Program Files\Git"
    
    # Add Git to PATH for this session
    $env:Path += ";C:\Program Files\Git\bin;C:\Program Files\Git\cmd"
    [Environment]::SetEnvironmentVariable("Path", $env:Path, [EnvironmentVariableTarget]::Process)
    
    Write-Host "   ✅ Git installed!" -ForegroundColor Green
}

# Step 2: Configure Git
Write-Host "`n🔧 Configuring Git..." -ForegroundColor Yellow
git config --global user.name "lab005-cyber"
git config --global user.email "lab005-cyber@users.noreply.github.com"

# Step 3: Ask for GitHub token
Write-Host "`n🔑 GitHub Authentication Required" -ForegroundColor Yellow
Write-Host "Create a token at: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host "Required scopes: repo (full control), workflow`n" -ForegroundColor Gray
$token = Read-Host "Paste your GitHub Personal Access Token"

# Step 4: Init repo
Set-Location $repoPath
Write-Host "`n📦 Initializing repository..." -ForegroundColor Yellow
git init
git add .
git commit -m "initial commit: appmass messaging + social media app"

# Step 5: Push to GitHub
Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git remote add origin $repoUrl
$authUrl = "https://lab005-cyber:$token@github.com/lab005-cyber/appmass.git"
git remote set-url origin $authUrl
git push -u origin main
git remote set-url origin $repoUrl  # Remove token from remote URL

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✅ Repository Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n🌐 $repoUrl" -ForegroundColor Blue
Write-Host "`nNext: Connect to Appwrite Sites for auto-deploy" -ForegroundColor Gray
Write-Host "      Console → Sites → appmass → Connect Repository`n" -ForegroundColor Gray

pause
