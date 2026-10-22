@echo off
title Colibri XL03 - minion sensor check (install)
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Asking for administrator permission...
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
echo.
echo Make sure ALL cameras and LiDAR on this minion are plugged in. Recording them now...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol='Tls12'; try { $p=Join-Path $env:TEMP 'colibri-minion-agent.ps1'; Invoke-WebRequest 'https://tangerine-smakager-bdebcf.netlify.app/downloads/colibri-minion-agent.ps1' -OutFile $p -UseBasicParsing -ErrorAction Stop; & $p -Install -Unit 'Colibri XL03' } catch { Write-Host ('FAILED: ' + $_.Exception.Message) -ForegroundColor Red }"
echo.
pause
