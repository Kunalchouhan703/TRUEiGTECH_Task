Write-Host "Installing Instagram Clone Project Dependencies" -ForegroundColor Green
Write-Host ""

Write-Host "Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path "node_modules") {
    Write-Host "Backend node_modules already exists. Skipping..." -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
}
Set-Location ..

Write-Host ""
Write-Host "Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path "node_modules") {
    Write-Host "Frontend node_modules already exists. Skipping..." -ForegroundColor Gray
} else {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Frontend dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}
Set-Location ..

Write-Host ""
Write-Host "Checking for .env files..." -ForegroundColor Yellow

if (-not (Test-Path "backend\.env")) {
    Write-Host "Creating backend/.env from .env.example..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "Please update backend/.env with your actual configuration" -ForegroundColor Cyan
} else {
    Write-Host "Backend .env file already exists" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env with your MongoDB connection string and JWT secret" -ForegroundColor White
Write-Host "2. Make sure MongoDB is running" -ForegroundColor White
Write-Host "3. Start backend: cd backend && npm start" -ForegroundColor White
Write-Host "4. Start frontend: cd frontend && npm run dev" -ForegroundColor White

