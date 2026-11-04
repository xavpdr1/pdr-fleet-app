@echo off
title Colibri XL05 - install phone scan remote (run on the MAIN PC)
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Asking for administrator permission...
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
echo.
echo Installing the phone scan remote for Colibri XL05 on this PC (%COMPUTERNAME%).
echo Keep the Colibri window open.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$t=[IO.File]::ReadAllText('%~f0'); $i=$t.LastIndexOf('#PS1-START'); $s=$t.Substring($t.IndexOf([char]10,$i)+1); $p=Join-Path $env:TEMP 'colibri-scan-remote.ps1'; [IO.File]::WriteAllText($p,$s); & powershell -NoProfile -ExecutionPolicy Bypass -File $p -Install -Unit 'Colibri XL05'"
echo.
echo Phone remote: https://tangerine-smakager-bdebcf.netlify.app/scan.html
echo.
pause
exit /b
#PS1-START
# Colibri scan remote - runs on a Colibri unit's MAIN PC (the one with the Colibri window).
# Watches for "Start scan" presses from the phone page (scan.html) and presses Automatic Start in the Colibri window.
#   Install:   powershell -ExecutionPolicy Bypass -File colibri-scan-remote.ps1 -Install -Unit "Colibri 20"
#   Uninstall: powershell -ExecutionPolicy Bypass -File colibri-scan-remote.ps1 -Uninstall
#   Find test: powershell -ExecutionPolicy Bypass -File colibri-scan-remote.ps1 -FindTest   (finds Automatic Start, does NOT press it)
param([switch]$Install, [switch]$Uninstall, [string]$Unit, [string]$Pin, [switch]$FindTest)

$Version  = "1.2"
$SB_URL   = "https://jedolnkjmlrruipkgqyd.supabase.co"
$SB_KEY   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZG9sbmtqbWxycnVpcGtncXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODk1ODQsImV4cCI6MjEwNjM2NTU4NH0.h3W7vimHuA_KPGmOjGN8HhM24k9apRta44l9D8xtF-Y"
$Home_    = Join-Path $env:ProgramData "ColibriScanRemote"
$CfgPath  = Join-Path $Home_ "config.json"
$LogPath  = Join-Path $Home_ "remote.log"
$TaskName = "Colibri Scan Remote"
$ButtonText = "Automatic Start"
$UpdateUrl  = "https://tangerine-smakager-bdebcf.netlify.app/downloads/colibri-scan-remote.ps1"
$MaxAgeSec  = 45

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Write-Log($m) {
  try {
    if ((Test-Path $LogPath) -and ((Get-Item $LogPath).Length -gt 1MB)) { Move-Item $LogPath "$LogPath.old" -Force }
    Add-Content -Path $LogPath -Value ("{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $m)
  } catch {}
}

function Get-Hash([string]$s) {
  $sha = [Security.Cryptography.SHA256]::Create()
  return (($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($s)) | ForEach-Object { $_.ToString("x2") }) -join "")
}

Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes
Add-Type @"
using System; using System.Runtime.InteropServices;
public static class CsrNative {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint f, uint x, uint y, uint d, UIntPtr e);
}
"@

# Finds the Automatic Start button in a window whose title contains "Colibri". Returns @{ el; win } or $null.
function Find-NewScan {
  $AE = [Windows.Automation.AutomationElement]
  $nameCond = New-Object Windows.Automation.PropertyCondition($AE::NameProperty, $ButtonText, [Windows.Automation.PropertyConditionFlags]::IgnoreCase)
  for ($try = 1; $try -le 4; $try++) {
    $wins = $AE::RootElement.FindAll([Windows.Automation.TreeScope]::Children, [Windows.Automation.Condition]::TrueCondition)
    foreach ($w in $wins) {
      $title = ""; try { $title = [string]$w.Current.Name } catch {}
      if ($title -notmatch '(?i)colibri' -or $title -match '(?i)colibri core|minion|update') { continue }
      try {
        $h = [IntPtr]$w.Current.NativeWindowHandle
        if ($h -ne [IntPtr]::Zero -and [CsrNative]::IsIconic($h)) { [CsrNative]::ShowWindow($h, 9) | Out-Null; Start-Sleep -Milliseconds 400 }
        $el = $w.FindFirst([Windows.Automation.TreeScope]::Descendants, $nameCond)
        if ($el) { return @{ el = $el; win = $w } }
      } catch {}
    }
    Start-Sleep -Milliseconds 600   # Chrome-based windows build their button list on the first request
  }
  return $null
}

function Press-NewScan {
  $f = Find-NewScan
  if (-not $f) { return "Could not find the Automatic Start button. Fill in the scan form on the PC so Automatic Start is showing." }
  try { $f.el.GetCurrentPattern([Windows.Automation.InvokePattern]::Pattern).Invoke(); return "ok" } catch {}
  try {
    $h = [IntPtr]$f.win.Current.NativeWindowHandle
    if ($h -ne [IntPtr]::Zero) { [CsrNative]::SetForegroundWindow($h) | Out-Null; Start-Sleep -Milliseconds 250 }
    $r = $f.el.Current.BoundingRectangle
    if ($r.Width -le 0) { return "The Automatic Start button is not visible on screen." }
    [CsrNative]::SetCursorPos([int]($r.X + $r.Width / 2), [int]($r.Y + $r.Height / 2)) | Out-Null
    Start-Sleep -Milliseconds 80
    [CsrNative]::mouse_event(0x0002, 0, 0, 0, [UIntPtr]::Zero); Start-Sleep -Milliseconds 60
    [CsrNative]::mouse_event(0x0004, 0, 0, 0, [UIntPtr]::Zero)
    return "ok"
  } catch { return "Click failed: $($_.Exception.Message)" }
}

function Get-ListenerPids {
  @(Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match 'ColibriScanRemote\\colibri-scan-remote\.ps1' -and $_.CommandLine -notmatch '-Install' -and $_.ProcessId -ne $PID } | ForEach-Object { $_.ProcessId })
}

function SB-Headers { @{ apikey = $SB_KEY; Authorization = "Bearer $SB_KEY" } }
function SB-Upsert($row) {
  $h = SB-Headers; $h.Prefer = "resolution=merge-duplicates,return=minimal"
  $body = ConvertTo-Json -InputObject @($row) -Depth 6 -Compress
  Invoke-RestMethod -Method Post -Uri "$SB_URL/rest/v1/fleet_records?on_conflict=kind,id" -Headers $h -ContentType "application/json; charset=utf-8" -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 15 | Out-Null
}
function Now-Iso { (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ") }

function Send-Ready($cfg, $note) {
  $now = Now-Iso
  SB-Upsert ([ordered]@{ kind = "colibri_remote"; id = $cfg.unit; deleted = $false; updated_at = $now
    data = [ordered]@{ unit = $cfg.unit; pc = $env:COMPUTERNAME; at = $now; ver = $Version; note = $note } })
}

function Handle-Commands($cfg) {
  $u = [Uri]::EscapeDataString($cfg.unit)
  $rows = Invoke-RestMethod -Method Get -Uri "$SB_URL/rest/v1/fleet_records?select=id,data&kind=eq.colibri_cmd&deleted=eq.false&data->>unit=eq.$u&data->>status=eq.new&order=updated_at.asc&limit=5" -Headers (SB-Headers) -TimeoutSec 10
  foreach ($r in @($rows)) {
    if (-not $r) { continue }
    $d = $r.data; $status = "failed"; $msg = ""
    $age = 999; try { $age = ((Get-Date).ToUniversalTime() - [DateTime]::Parse($d.at).ToUniversalTime()).TotalSeconds } catch {}
    if ($age -gt $MaxAgeSec)            { $status = "expired"; $msg = "Too old, ignored." }
    elseif ([string]$d.pin -ne $cfg.pinHash) { $status = "denied";  $msg = "Wrong PIN." }
    else {
      $res = Press-NewScan
      if ($res -eq "ok") { $status = "started"; $msg = "Automatic Start pressed on $env:COMPUTERNAME." } else { $msg = $res }
    }
    Write-Log "command $($r.id): $status $msg"
    $now = Now-Iso
    SB-Upsert ([ordered]@{ kind = "colibri_cmd"; id = $r.id; deleted = $false; updated_at = $now
      data = [ordered]@{ unit = $d.unit; cmd = $d.cmd; at = $d.at; by = $d.by; status = $status; msg = $msg; done = $now } })
  }
}

if ($FindTest) {
  $f = Find-NewScan
  if ($f) { Write-Host "Found the Automatic Start button in '$($f.win.Current.Name)'. (Not pressed.)" -ForegroundColor Green; exit 0 }
  Write-Host "Could not find the Automatic Start button. Open the scan form in the Colibri window and try again." -ForegroundColor Red; exit 1
}

if ($Install -or $Uninstall) {
  $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdmin) { Write-Host "Please run as administrator." -ForegroundColor Red; exit 1 }
  if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) { Stop-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue; Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false }
  foreach ($lp in (Get-ListenerPids)) { Stop-Process -Id $lp -Force -ErrorAction SilentlyContinue }
  if ($Uninstall) { Write-Host "Colibri scan remote removed." -ForegroundColor Green; exit 0 }
  if (-not $Unit) { Write-Host "Add the unit name, for example -Unit ""Colibri 20""" -ForegroundColor Red; exit 1 }
  while (-not ($Pin -match '^\d{4,8}$')) { $Pin = Read-Host "Choose a PIN for the phone remote (4 to 8 digits)" }
  New-Item -ItemType Directory -Path $Home_ -Force | Out-Null
  $dest = Join-Path $Home_ "colibri-scan-remote.ps1"
  if ($PSCommandPath -ne $dest) { Copy-Item -Path $PSCommandPath -Destination $dest -Force }
  @{ unit = $Unit; pinHash = (Get-Hash $Pin) } | ConvertTo-Json | Set-Content -Path $CfgPath -Encoding UTF8
  $user = [Security.Principal.WindowsIdentity]::GetCurrent().Name
  $exe  = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
  $act  = New-ScheduledTaskAction -Execute $exe -Argument "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dest`""
  $trg  = New-ScheduledTaskTrigger -AtLogOn -User $user
  $pri  = New-ScheduledTaskPrincipal -UserId $user -LogonType Interactive -RunLevel Highest
  $set  = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1)
  try { Register-ScheduledTask -TaskName $TaskName -Action $act -Trigger $trg -Principal $pri -Settings $set -ErrorAction Stop | Out-Null }
  catch { Write-Host "INSTALL FAILED: $($_.Exception.Message)" -ForegroundColor Red; exit 1 }
  Start-ScheduledTask -TaskName $TaskName
  Write-Host ""
  $started = $false
  for ($i = 0; $i -lt 10 -and -not $started; $i++) { Start-Sleep -Seconds 1; $started = [bool](Get-ListenerPids) }
  if (-not $started) {
    Write-Log "scheduled task did not start the listener; starting it directly"
    Start-Process -FilePath $exe -ArgumentList "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dest`"" -WindowStyle Hidden
    for ($i = 0; $i -lt 10 -and -not $started; $i++) { Start-Sleep -Seconds 1; $started = [bool](Get-ListenerPids) }
  }
  if ($started) { Write-Host "Listener is running." -ForegroundColor Green }
  else { Write-Host "The listener did not start. Send Claude a photo of this window." -ForegroundColor Red; if (Test-Path $LogPath) { Get-Content $LogPath -Tail 8 } }
  $f = Find-NewScan
  if ($f) { Write-Host "Found the Automatic Start button. (Not pressed.)" -ForegroundColor Green }
  else    { Write-Host "OK: Automatic Start isn't showing right now. That's fine; it only needs to be showing when a scan is started." -ForegroundColor Yellow }
  try { Send-Ready (Get-Content $CfgPath -Raw | ConvertFrom-Json) "installed"; Write-Host "Installed. The phone remote for $Unit is ready." -ForegroundColor Green }
  catch { Write-Host "Installed, but couldn't reach the internet right now ($($_.Exception.Message))." -ForegroundColor Yellow }
  exit 0
}

# Every 10 minutes: if the site has a newer version, replace this file and restart.
function Check-Update {
  try {
    $txt = (Invoke-WebRequest -Uri $UpdateUrl -UseBasicParsing -TimeoutSec 20).Content
    if ($txt -is [byte[]]) { $txt = [Text.Encoding]::UTF8.GetString($txt) }
    if ($txt -notmatch '\$Version\s*=\s*"([\d.]+)"') { return }
    if ([version]$Matches[1] -le [version]$Version) { return }
    if ($txt -notmatch 'function Press-NewScan') { return }
    $me = $PSCommandPath
    [IO.File]::WriteAllText($me, $txt)
    Write-Log "updated $Version -> $($Matches[1]); restarting"
    $exe = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
    Start-Process -FilePath $exe -ArgumentList "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$me`"" -WindowStyle Hidden
    $mutex.ReleaseMutex(); exit 0
  } catch { Write-Log "update check failed: $($_.Exception.Message)" }
}

# ---- Listener (started by the scheduled task when the user logs on) ----
try {
  $mutex = New-Object Threading.Mutex($false, "Global\ColibriScanRemote")
  if (-not $mutex.WaitOne(20000)) { Write-Log "another listener is already running"; exit 0 }
  $cfg = Get-Content $CfgPath -Raw | ConvertFrom-Json
} catch {
  Write-Log "listener failed to start: $($_.Exception.Message)"
  try { $c = Get-Content $CfgPath -Raw | ConvertFrom-Json; Send-Ready $c ("start failed: " + $_.Exception.Message) } catch {}
  exit 1
}
Write-Log "listener started v$Version for $($cfg.unit)"
$lastReady = [DateTime]::MinValue
$lastUpd   = Get-Date
while ($true) {
  if (((Get-Date) - $lastUpd).TotalMinutes -ge 10) { $lastUpd = Get-Date; Check-Update }
  try {
    if (((Get-Date) - $lastReady).TotalSeconds -ge 30) { Send-Ready $cfg "listening"; $lastReady = Get-Date }
    Handle-Commands $cfg
  } catch { Write-Log "loop error: $($_.Exception.Message)"; try { Send-Ready $cfg ("error: " + $_.Exception.Message); $lastReady = Get-Date } catch {}; Start-Sleep -Seconds 5 }
  Start-Sleep -Seconds 2
}
