@echo off
echo ========================================================
echo  Starting GDG Event Website at http://localhost:8000
echo ========================================================
start http://localhost:8000
py -m http.server 8000
