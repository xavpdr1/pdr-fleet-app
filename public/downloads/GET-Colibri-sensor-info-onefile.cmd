@echo off
title Colibri sensor info (read only)
echo Collecting minion and camera info. This takes about a minute and changes nothing...
powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol='Tls12'; $ErrorActionPreference='Stop'; try { $z=Join-Path $env:TEMP 'colibri-info.zip'; $d=Join-Path $env:TEMP 'colibri-info'; Invoke-WebRequest 'https://tangerine-smakager-bdebcf.netlify.app/downloads/Colibri-minion-info.zip' -OutFile $z -UseBasicParsing; Expand-Archive $z $d -Force; & (Join-Path $d 'colibri-minion-info.ps1'); $f=Get-ChildItem $d -Filter 'minion-info-*.txt' | Sort-Object LastWriteTime | Select-Object -Last 1; $dest=Join-Path ([Environment]::GetFolderPath('Desktop')) $f.Name; Copy-Item $f.FullName $dest -Force; Write-Host ('Saved to your Desktop: ' + $f.Name) -ForegroundColor Green } catch { Write-Host ('FAILED: ' + $_.Exception.Message) -ForegroundColor Red }"
echo.
pause
