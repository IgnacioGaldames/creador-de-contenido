@echo off
title Hites MKT - Servidor de Desarrollo

echo.
echo  ========================================
echo    Hites MKT - Iniciando Proyecto...
echo  ========================================
echo.

:: --- Verificar Node.js ---
where node >nul 2>nul
if %errorlevel% neq 0 goto :NO_NODE

echo  [OK] Node.js encontrado:
node --version
echo.
echo  [OK] npm encontrado:
call npm --version
echo.

:: --- Instalar dependencias si no existe node_modules ---
if exist "node_modules" goto :START_DEV

echo  [INFO] Primera vez: instalando dependencias...
echo  (Esto puede tardar 1-3 minutos segun tu conexion)
echo.
call npm install
if %errorlevel% neq 0 goto :INSTALL_ERROR

echo.
echo  [OK] Dependencias instaladas correctamente.
echo.

:START_DEV
echo  ========================================
echo    Levantando servidor de desarrollo...
echo    La app se abrira en: http://localhost:5173/
echo    Para detener el servidor presiona Ctrl+C
echo  ========================================
echo.

call npm run dev -- --open

echo.
echo  Servidor detenido.
pause
goto :eof

:NO_NODE
echo  [ERROR] Node.js NO esta instalado en este equipo.
echo.
echo  Descargalo desde: https://nodejs.org/
echo  Instala la version LTS y reinicia tu computador.
echo.
echo  Consulta el README.md para instrucciones detalladas.
echo.
pause
exit /b 1

:INSTALL_ERROR
echo.
echo  [ERROR] Fallo la instalacion de dependencias.
echo  Revisa tu conexion a Internet o consulta el README.md
echo.
pause
exit /b 1
