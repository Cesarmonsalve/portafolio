@echo off
echo ============================================
echo    CM DESIGN — Publicando cambios...
echo ============================================
echo.

cd /d "%~dp0"

git add -A
git commit -m "Update portfolio — %date%"
git push origin main

echo.
echo ============================================
echo    Listo! Cambios publicados en GitHub
echo    Vercel se actualizara automaticamente
echo ============================================
echo.
pause
