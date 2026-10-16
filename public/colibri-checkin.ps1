<#
  Colibri check-in script  (PDR-Team USA)
  ----------------------------------------
  Tells the "Colibri Unit Status" page that this PC is on.
  - Sends a check-in every minute while Windows is running.
  - Sends a "came online" entry each time Windows starts.
  It only sends: unit name, computer name, role, Windows version, last boot time and a time stamp.
  It does not read, change or control anything else on this PC.

  INSTALL (once per PC, in PowerShell "Run as administrator"):
      powershell -ExecutionPolicy Bypass -File .\colibri-checkin.ps1 -Install -Unit "Colibri 19" -Role "Control cabinet"

  TEST (sends one check-in now and shows the result):
      powershell -ExecutionPolicy Bypass -File .\colibri-checkin.ps1 -Test -Unit "Colibri 19"

  REMOVE:
      powershell -ExecutionPolicy Bypass -File .\colibri-checkin.ps1 -Uninstall
#>
param(
  [string]$Unit = "",
  [string]$Role = "",
  [switch]$Install,
  [switch]$Uninstall,
  [switch]$Test,
  [switch]$Startup
)

$ErrorActionPreference = "Stop"
$SB_URL   = "https://jedolnkjmlrruipkgqyd.supabase.co"
$SB_KEY   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZG9sbmtqbWxycnVpcGtncXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODk1ODQsImV4cCI6MjEwNjM2NTU4NH0.h3W7vimHuA_KPGmOjGN8HhM24k9apRta44l9D8xtF-Y"
$Version  = "1.0"
$Home_    = Join-Path $env:ProgramData "ColibriCheckin"
$CfgPath  = Join-Path $Home_ "config.json"
$LogPath  = Join-Path $Home_ "checkin.log"
$TaskBeat = "Colibri Check-in"
$TaskBoot = "Colibri Check-in (startup)"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Write-Log([string]$msg) {
  try {
    if (-not (Test-Path $Home_)) { New-Item -ItemType Directory -Path $Home_ -Force | Out-Null }
    if ((Test-Path $LogPath) -and ((Get-Item $LogPath).Length -gt 512KB)) { Move-Item $LogPath "$LogPath.old" -Force }
    Add-Content -Path $LogPath -Value ("{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg)
  } catch {}
}

function Get-Config {
  $cfg = @{ unit = $Unit; role = $Role }
  if ((-not $cfg.unit) -and (Test-Path $CfgPath)) {
    $saved = Get-Content $CfgPath -Raw | ConvertFrom-Json
    $cfg.unit = $saved.unit; if (-not $cfg.role) { $cfg.role = $saved.role }
  }
  if (-not $cfg.unit) { throw "No unit name. Run with -Unit ""Colibri 19"" (use the same name as in the Colibri Maintenance app)." }
  return $cfg
}

function Send-Rows($rows) {
  $headers = @{
    apikey        = $SB_KEY
    Authorization = "Bearer $SB_KEY"
    Prefer        = "resolution=merge-duplicates,return=minimal"
  }
  $body = ConvertTo-Json -InputObject @($rows) -Depth 6 -Compress
  Invoke-RestMethod -Method Post -Uri "$SB_URL/rest/v1/fleet_records?on_conflict=kind,id" -Headers $headers `
    -ContentType "application/json; charset=utf-8" -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 20 | Out-Null
}

function New-CheckinRows($cfg, [bool]$withStartup) {
  $nowUtc = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
  $pc = $env:COMPUTERNAME
  $boot = ""; $os = ""
  try { $w = Get-CimInstance Win32_OperatingSystem; $boot = $w.LastBootUpTime.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ"); $os = $w.Caption } catch {}
  $data = [ordered]@{ unit = $cfg.unit; pc = $pc; role = $cfg.role; at = $nowUtc; boot = $boot; os = $os; ver = $Version }
  $rows = @([ordered]@{ kind = "colibri_hb"; id = "$($cfg.unit)|$pc"; data = $data; deleted = $false; updated_at = $nowUtc })
  if ($withStartup) {
    $ev = [ordered]@{ unit = $cfg.unit; pc = $pc; event = "online"; at = $nowUtc; boot = $boot }
    $rows += [ordered]@{ kind = "colibri_unitev"; id = "$($cfg.unit)|$pc|$nowUtc"; data = $ev; deleted = $false; updated_at = $nowUtc }
  }
  return $rows
}

# ---------------- install / uninstall ----------------
if ($Install -or $Uninstall) {
  $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdmin) { Write-Host "Please run PowerShell as administrator (right-click > Run as administrator)." -ForegroundColor Red; exit 1 }
  foreach ($t in @($TaskBeat, $TaskBoot)) { if (Get-ScheduledTask -TaskName $t -ErrorAction SilentlyContinue) { Unregister-ScheduledTask -TaskName $t -Confirm:$false } }
  if ($Uninstall) { Write-Host "Colibri check-in removed from this PC." -ForegroundColor Green; exit 0 }

  if (-not $Unit) { Write-Host "Add the unit name, for example: -Unit ""Colibri 19""" -ForegroundColor Red; exit 1 }
  New-Item -ItemType Directory -Path $Home_ -Force | Out-Null
  $dest = Join-Path $Home_ "colibri-checkin.ps1"
  Copy-Item -Path $PSCommandPath -Destination $dest -Force
  @{ unit = $Unit; role = $Role } | ConvertTo-Json | Set-Content -Path $CfgPath -Encoding UTF8

  $exe  = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
  $args1 = "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dest`""
  $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
  $settings  = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

  $beatTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration (New-TimeSpan -Days 3650)
  Register-ScheduledTask -TaskName $TaskBeat -Action (New-ScheduledTaskAction -Execute $exe -Argument $args1) -Trigger $beatTrigger -Principal $principal -Settings $settings -Description "Sends a check-in to the PDR-Team Colibri Unit Status page every minute." | Out-Null

  $bootTrigger = New-ScheduledTaskTrigger -AtStartup
  Register-ScheduledTask -TaskName $TaskBoot -Action (New-ScheduledTaskAction -Execute $exe -Argument "$args1 -Startup") -Trigger $bootTrigger -Principal $principal -Settings $settings -Description "Tells the PDR-Team Colibri Unit Status page this PC just started." | Out-Null

  try { Send-Rows (New-CheckinRows (Get-Config) $true); Write-Host "Installed. $Unit ($env:COMPUTERNAME) just checked in and should show Online on the status page." -ForegroundColor Green }
  catch { Write-Host "Installed, but the first check-in failed: $($_.Exception.Message). Check the internet connection; it will keep trying every minute." -ForegroundColor Yellow }
  exit 0
}

# ---------------- check-in ----------------
try {
  $cfg = Get-Config
  if ($Startup) {
    # Network may not be up yet right after boot: keep trying for up to 10 minutes.
    $deadline = (Get-Date).AddMinutes(10)
    while ($true) {
      try { Send-Rows (New-CheckinRows $cfg $true); Write-Log "startup check-in sent ($($cfg.unit))"; break }
      catch { if ((Get-Date) -gt $deadline) { throw }; Start-Sleep -Seconds 20 }
    }
  } else {
    Send-Rows (New-CheckinRows $cfg $false)
    if ($Test) { Write-Host "Check-in sent for $($cfg.unit) ($env:COMPUTERNAME). It should show Online on the status page within 20 seconds." -ForegroundColor Green }
  }
} catch {
  Write-Log "check-in failed: $($_.Exception.Message)"
  if ($Test) { Write-Host "Check-in failed: $($_.Exception.Message)" -ForegroundColor Red; exit 1 }
}
