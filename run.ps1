Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting GDG Event Website at http://localhost:8000" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Start-Process "http://localhost:8000"
py -m http.server 8000
