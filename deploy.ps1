# Quick Deployment Script for Vercel
# This script helps you deploy your Christmas Attendance System

Write-Host "🎄 Christmas Attendance System - Deployment Helper 🎄" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "You need to create .env file with your Supabase credentials." -ForegroundColor Yellow
    Write-Host "Copy env.example to .env and add your values." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Green
    git init
    git add .
    git commit -m "Initial commit - Christmas Attendance System"
    Write-Host "✅ Git initialized" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Next steps:" -ForegroundColor Yellow
    Write-Host "1. Create a GitHub repository" -ForegroundColor White
    Write-Host "2. Run: git remote add origin YOUR_GITHUB_REPO_URL" -ForegroundColor White
    Write-Host "3. Run: git push -u origin main" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✅ Git repository found" -ForegroundColor Green
}

# Check build
Write-Host ""
Write-Host "🔨 Testing build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Ready to deploy!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose deployment method:" -ForegroundColor Yellow
Write-Host "1. Via Vercel Dashboard (Recommended - Easiest)" -ForegroundColor White
Write-Host "   - Push to GitHub first" -ForegroundColor Gray
Write-Host "   - Go to https://vercel.com" -ForegroundColor Gray
Write-Host "   - Import your repository" -ForegroundColor Gray
Write-Host "   - Add environment variables" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Via Vercel CLI" -ForegroundColor White
Write-Host "   - Run: npm i -g vercel" -ForegroundColor Gray
Write-Host "   - Run: vercel login" -ForegroundColor Gray
Write-Host "   - Run: vercel" -ForegroundColor Gray
Write-Host ""


