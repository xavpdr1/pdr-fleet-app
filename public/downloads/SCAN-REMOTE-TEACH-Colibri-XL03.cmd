@echo off
title Colibri XL03 - install phone scan remote (run on the MAIN PC)
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Asking for administrator permission...
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
echo.
echo Phone scan remote INSTALLER version 1.4 - teaches the scan form
echo Installing the phone scan remote for Colibri XL03 on this PC (%COMPUTERNAME%).
echo Keep the Colibri window open.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$t=[IO.File]::ReadAllText('%~f0'); $i=$t.LastIndexOf('#PS1-START'); $s=$t.Substring($t.IndexOf([char]10,$i)+1); $p=Join-Path $env:TEMP 'colibri-scan-remote.ps1'; [IO.File]::WriteAllText($p,$s); & powershell -NoProfile -ExecutionPolicy Bypass -File $p -Install -Unit 'Colibri XL03'"
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

$Version  = "1.4"
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
using System; using System.Text; using System.Collections.Generic; using System.Runtime.InteropServices;
public static class CsrNative {
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
  [StructLayout(LayoutKind.Sequential)] public struct POINT { public int X, Y; }
  public delegate bool EnumProc(IntPtr h, IntPtr p);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc f, IntPtr p);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool GetCursorPos(out POINT p);
  [DllImport("user32.dll")] public static extern IntPtr WindowFromPoint(POINT p);
  [DllImport("user32.dll")] public static extern IntPtr GetAncestor(IntPtr h, uint f);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint f, uint x, uint y, uint d, UIntPtr e);
  [DllImport("user32.dll")] public static extern void keybd_event(byte k, byte s, uint f, UIntPtr e);
  public static List<IntPtr> TopWindows() {
    var l = new List<IntPtr>();
    EnumWindows((h, p) => { if (IsWindowVisible(h)) l.Add(h); return true; }, IntPtr.Zero);
    return l;
  }
  public static string Title(IntPtr h) { var sb = new StringBuilder(512); GetWindowText(h, sb, 512); return sb.ToString(); }
}
"@

function Get-WinInfo([IntPtr]$h) {
  $procId = [uint32]0; [CsrNative]::GetWindowThreadProcessId($h, [ref]$procId) | Out-Null
  $pn = ""; try { $pn = (Get-Process -Id $procId -ErrorAction Stop).ProcessName } catch {}
  $r = New-Object CsrNative+RECT; [CsrNative]::GetWindowRect($h, [ref]$r) | Out-Null
  return [pscustomobject]@{ hwnd = $h; title = [CsrNative]::Title($h); proc = $pn; L = $r.L; T = $r.T; W = ($r.R - $r.L); H = ($r.B - $r.T) }
}

# Visible top-level windows, for the failure report.
function Get-WindowList {
  $out = @()
  foreach ($h in [CsrNative]::TopWindows()) { $i = Get-WinInfo $h; if ($i.title -and $i.W -gt 50) { $out += ("{0} [{1}]" -f $i.title, $i.proc) } }
  return $out
}

# The Colibri GUI window: the taught program if known, else a window titled "Colibri" that is not a browser/console.
function Find-ColibriWindow($cfg) {
  $skipProc = '(?i)^(msedge|chrome|firefox|teams|ms-teams|explorer|powershell|pwsh|cmd|conhost|windowsterminal|anydesk|notepad)$'
  $best = $null
  foreach ($h in [CsrNative]::TopWindows()) {
    $i = Get-WinInfo $h
    if ($i.W -lt 200 -or $i.H -lt 200 -and -not [CsrNative]::IsIconic($h)) { continue }
    $match = $false
    if ($cfg -and $cfg.button -and $cfg.button.proc) { $match = ($i.proc -eq $cfg.button.proc) }
    else { $match = ($i.title -match '(?i)colibri' -and $i.title -notmatch '(?i)colibri core|minion|update' -and $i.proc -notmatch $skipProc) }
    if ($match -and (-not $best -or ($i.W * $i.H) -gt ($best.W * $best.H))) { $best = $i }
  }
  return $best
}

function Bring-ToFront([IntPtr]$h) {
  if ([CsrNative]::IsIconic($h)) { [CsrNative]::ShowWindow($h, 9) | Out-Null; Start-Sleep -Milliseconds 500 }
  [CsrNative]::keybd_event(0x12, 0, 0, [UIntPtr]::Zero); [CsrNative]::keybd_event(0x12, 0, 2, [UIntPtr]::Zero)   # lets us take the foreground
  [CsrNative]::SetForegroundWindow($h) | Out-Null
  Start-Sleep -Milliseconds 300
}

function Click-At([int]$x, [int]$y) {
  [CsrNative]::SetCursorPos($x, $y) | Out-Null; Start-Sleep -Milliseconds 80
  [CsrNative]::mouse_event(0x0002, 0, 0, 0, [UIntPtr]::Zero); Start-Sleep -Milliseconds 60
  [CsrNative]::mouse_event(0x0004, 0, 0, 0, [UIntPtr]::Zero)
}

$FieldList = @(
  @{ key = "plate"; label = "LICENSE PLATE box" },
  @{ key = "vin";   label = "VIN box" },
  @{ key = "claim"; label = "CLAIM NO. box" },
  @{ key = "brand"; label = "CAR BRAND box" },
  @{ key = "model"; label = "CAR MODEL box" }
)

# Teach one spot: the user hovers the mouse over it and presses Enter; we store where it is inside the Colibri window.
function Teach-Point([string]$label, $old) {
  Write-Host ""
  Write-Host ("Move the mouse over the " + $label + " (don't click), then press Enter.") -ForegroundColor Cyan
  if ($old) { Write-Host "   K + Enter = keep the spot saved before.   S + Enter = skip." }
  else      { Write-Host "   S + Enter = skip." }
  while ($true) {
    $a = Read-Host "   Ready"
    if ($a -match '^(?i)k' -and $old) { Write-Host "   Kept." -ForegroundColor Yellow; return $old }
    if ($a -match '^(?i)s') { Write-Host "   Skipped." -ForegroundColor Yellow; return $null }
    $pt = New-Object CsrNative+POINT; [CsrNative]::GetCursorPos([ref]$pt) | Out-Null
    $root = [CsrNative]::GetAncestor([CsrNative]::WindowFromPoint($pt), 2)
    $i = Get-WinInfo $root
    if ($i.W -le 0 -or $i.proc -match '(?i)^(powershell|cmd|conhost|windowsterminal|explorer)$') { Write-Host "   The mouse wasn't over the Colibri window. Try again." -ForegroundColor Red; continue }
    $b = [ordered]@{ proc = $i.proc; title = $i.title; fx = [math]::Round(($pt.X - $i.L) / $i.W, 4); fy = [math]::Round(($pt.Y - $i.T) / $i.H, 4); w = $i.W; h = $i.H }
    Write-Host ("   Saved ({0:P0} across, {1:P0} down)." -f $b.fx, $b.fy) -ForegroundColor Green
    return $b
  }
}

function Teach-All($oldCfg) {
  Write-Host ""
  Write-Host "TEACH THE SCAN FORM" -ForegroundColor Cyan
  Write-Host "First open the scan form in the Colibri window (License Plate, VIN ... Automatic Start)."
  Write-Host "Make the Colibri window the size you normally use it (maximized is best) and keep it that way."
  $oldF = $null; if ($oldCfg -and $oldCfg.fields) { $oldF = $oldCfg.fields }
  $fields = [ordered]@{}
  foreach ($f in $FieldList) {
    $old = $null; if ($oldF -and $oldF.($f.key)) { $old = $oldF.($f.key) }
    $p = Teach-Point $f.label $old
    if ($p) { $fields[$f.key] = $p }
  }
  $oldB = $null; if ($oldCfg -and $oldCfg.button) { $oldB = $oldCfg.button }
  $btn = Teach-Point "AUTOMATIC START button" $oldB
  return @{ fields = $fields; button = $btn }
}

function Esc-Keys([string]$t) {
  return (($t.ToCharArray() | ForEach-Object { if ('+^%~(){}[]'.IndexOf($_) -ge 0) { '{' + $_ + '}' } else { [string]$_ } }) -join '')
}

function Clean-Value($v) {
  if ($null -eq $v) { return "" }
  $t = ([string]$v) -replace '[\x00-\x1F]', ' '
  $t = $t.Trim(); if ($t.Length -gt 40) { $t = $t.Substring(0, 40) }
  return $t
}

function Press-NewScan($cfg, $vals) {
  if (-not ($cfg -and $cfg.button)) { return "The Automatic Start button hasn't been taught yet. Run the installer on the PC again." }
  $w = Find-ColibriWindow $cfg
  if (-not $w) { return "The Colibri window ($($cfg.button.proc)) isn't open on the PC." }
  Bring-ToFront $w.hwnd
  $w = Get-WinInfo $w.hwnd
  $at = { param($p) @([int]($w.L + $p.fx * $w.W), [int]($w.T + $p.fy * $w.H)) }
  $note = ""
  $any = $false; foreach ($f in $FieldList) { if ((Clean-Value $vals.($f.key)) -ne "") { $any = $true } }
  if ($any) {
    Add-Type -AssemblyName System.Windows.Forms
    $notTaught = @()
    # bottom-up, so a suggestion list under a box never covers the next box we click
    foreach ($f in @($FieldList)[($FieldList.Count - 1)..0]) {
      $v = Clean-Value $vals.($f.key)
      $p = $null; if ($cfg.fields) { $p = $cfg.fields.($f.key) }
      if (-not $p) { if ($v) { $notTaught += $f.key }; continue }
      $xy = & $at $p; Click-At $xy[0] $xy[1]; Start-Sleep -Milliseconds 200
      [System.Windows.Forms.SendKeys]::SendWait("^a"); Start-Sleep -Milliseconds 60
      [System.Windows.Forms.SendKeys]::SendWait("{DEL}"); Start-Sleep -Milliseconds 60
      if ($v) { [System.Windows.Forms.SendKeys]::SendWait((Esc-Keys $v)) }
      Start-Sleep -Milliseconds 250
    }
    [System.Windows.Forms.SendKeys]::SendWait("{TAB}"); Start-Sleep -Milliseconds 500
    if ($notTaught.Count) { $note = " (not filled, box not taught: " + ($notTaught -join ", ") + ")" }
  }
  $xy = & $at $cfg.button; Click-At $xy[0] $xy[1]
  return "ok$note"
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
      $res = "ok"; try { $res = Press-NewScan $cfg $d.fields } catch { $res = "Error: $($_.Exception.Message)" }
      if ($res -like "ok*") { $status = "started"; $msg = "Automatic Start pressed on $env:COMPUTERNAME." + $res.Substring(2) }
      else { $msg = $res; try { Write-Log ("windows: " + ((Get-WindowList) -join " | ")) } catch {}; $script:checkNow = $true }
    }
    Write-Log "command $($r.id): $status $msg"
    $now = Now-Iso
    SB-Upsert ([ordered]@{ kind = "colibri_cmd"; id = $r.id; deleted = $false; updated_at = $now
      data = [ordered]@{ unit = $d.unit; cmd = $d.cmd; at = $d.at; by = $d.by; status = $status; msg = $msg; done = $now } })
  }
}

if ($FindTest) {
  $c = $null; try { $c = Get-Content $CfgPath -Raw | ConvertFrom-Json } catch {}
  $w = Find-ColibriWindow $c
  if ($w) { Write-Host "Colibri window: '$($w.title)' ($($w.proc))" -ForegroundColor Green } else { Write-Host "Colibri window not found." -ForegroundColor Red }
  Write-Host "Open windows:"; Get-WindowList | ForEach-Object { Write-Host "  $_" }
  exit 0
}

if ($Install -or $Uninstall) {
  $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdmin) { Write-Host "Please run as administrator." -ForegroundColor Red; exit 1 }
  if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) { Stop-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue; Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false }
  foreach ($lp in (Get-ListenerPids)) { Stop-Process -Id $lp -Force -ErrorAction SilentlyContinue }
  if ($Uninstall) { Write-Host "Colibri scan remote removed." -ForegroundColor Green; exit 0 }
  if (-not $Unit) { Write-Host "Add the unit name, for example -Unit ""Colibri 20""" -ForegroundColor Red; exit 1 }
  $oldCfg = $null; try { $oldCfg = Get-Content $CfgPath -Raw | ConvertFrom-Json } catch {}
  $pinHash = $null
  while (-not $pinHash) {
    if (-not $Pin) { $Pin = Read-Host ("Choose a PIN for the phone remote (4 to 8 digits)" + $(if ($oldCfg) { ", or just press Enter to keep the current PIN" } else { "" })) }
    if (-not $Pin -and $oldCfg -and $oldCfg.pinHash) { $pinHash = $oldCfg.pinHash }
    elseif ($Pin -match '^\d{4,8}$') { $pinHash = Get-Hash $Pin }
    else { $Pin = "" }
  }
  New-Item -ItemType Directory -Path $Home_ -Force | Out-Null
  $dest = Join-Path $Home_ "colibri-scan-remote.ps1"
  if ($PSCommandPath -ne $dest) { Copy-Item -Path $PSCommandPath -Destination $dest -Force }
  $t = Teach-All $oldCfg
  $button = $t.button
  [ordered]@{ unit = $Unit; pinHash = $pinHash; button = $button; fields = $t.fields } | ConvertTo-Json -Depth 5 | Set-Content -Path $CfgPath -Encoding UTF8
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
  if (-not $button) { Write-Host "Automatic Start wasn't taught: the phone remote won't work until you run this again." -ForegroundColor Red }
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
  if ($script:checkNow -or ((Get-Date) - $lastUpd).TotalMinutes -ge 10) { $script:checkNow = $false; $lastUpd = Get-Date; Check-Update }
  try { $cfg = Get-Content $CfgPath -Raw | ConvertFrom-Json } catch {}
  try {
    if (((Get-Date) - $lastReady).TotalSeconds -ge 30) { Send-Ready $cfg "listening"; $lastReady = Get-Date }
    Handle-Commands $cfg
  } catch { Write-Log "loop error: $($_.Exception.Message)"; try { Send-Ready $cfg ("error: " + $_.Exception.Message); $lastReady = Get-Date } catch {}; Start-Sleep -Seconds 5 }
  Start-Sleep -Seconds 2
}
