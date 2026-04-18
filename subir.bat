@echo off
cls
echo Subiendo a GitHub...
echo.

if not exist ".git" (
    git init
    git remote add origin https://github.com/Cesarmonsalve/portafolio.git
)

git config user.name "Cesarmonsalve"
git config user.email "tu@email.com"

git add .
git commit -m "CM Design Portfolio"
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo Listo! Subido exitosamente
) else (
    echo Error al subir
)

pause