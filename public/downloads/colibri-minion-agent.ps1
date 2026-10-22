<#
  Colibri minion sensor check (PDR-Team USA)
  ------------------------------------------
  Runs on a Colibri MINION PC. At install it records which cameras / LiDAR / USB devices and
  network ports are connected (the "baseline"). Every minute it checks they are all still there and
  reports anything missing to the Colibri Unit Status page.
  It only sends: unit, computer name, minion IP, and the names of devices/ports that are missing.
  It does not change or control the scanner software.

  INSTALL (with ALL sensors plugged in), as administrator:
      powershell -ExecutionPolicy Bypass -File .\colibri-minion-agent.ps1 -Install -Unit "Colibri XL03"
  Re-run -Install any time to take a new baseline (for example after replacing a camera).
  TEST:    ... -File .\colibri-minion-agent.ps1 -Test
  REMOVE:  ... -File .\colibri-minion-agent.ps1 -Uninstall
#>
param(
  [string]$Unit = "",
  [switch]$Install,
  [switch]$Uninstall,
  [switch]$Test
)

$ErrorActionPreference = "Stop"
$SB_URL   = "https://jedolnkjmlrruipkgqyd.supabase.co"
$SB_KEY   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZG9sbmtqbWxycnVpcGtncXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODk1ODQsImV4cCI6MjEwNjM2NTU4NH0.h3W7vimHuA_KPGmOjGN8HhM24k9apRta44l9D8xtF-Y"
$Version  = "m1.0"
$Home_    = Join-Path $env:ProgramData "ColibriMinionCheck"
$CfgPath  = Join-Path $Home_ "config.json"
$BasePath = Join-Path $Home_ "baseline.json"
$LogPath  = Join-Path $Home_ "check.log"
$TaskName = "Colibri Minion Sensor Check"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Write-Log([string]$m) {
  try {
    if (-not (Test-Path $Home_)) { New-Item -ItemType Directory -Path $Home_ -Force | Out-Null }
    if ((Test-Path $LogPath) -and ((Get-Item $LogPath).Length -gt 256KB)) { Move-Item $LogPath "$LogPath.old" -Force }
    Add-Content -Path $LogPath -Value ("{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $m)
  } catch {}
}

# Sensors = present USB devices (cameras, LiDAR adapters, etc.) except hubs/controllers/input devices,
# plus any device in the Camera / Image classes.
function Get-Sensors {
  $skip = '(?i)hub|host controller|root|composite|keyboard|mouse|hid|bluetooth|mass storage|disk|card reader|audio|printer|smart ?card|fingerprint'
  $list = @{}
  foreach ($d in (Get-PnpDevice -PresentOnly -ErrorAction SilentlyContinue)) {
    $id = [string]$d.InstanceId; $name = [string]$d.FriendlyName; $cls = [string]$d.Class
    if (-not $name) { continue }
    $isCam = $cls -match '^(?i)(Camera|Image)$'
    $isUsb = $id -like 'USB\*' -or $id -like 'USB4\*' -or $id -like 'USBVISION*'
    if ($isCam) { $list[$id] = $name }
    elseif ($isUsb -and ($name -notmatch $skip) -and ($cls -notmatch '(?i)^(USB|HIDClass|Keyboard|Mouse|Bluetooth|DiskDrive|AudioEndpoint|MEDIA|SoftwareDevice)$')) { $list[$id] = $name }
  }
  return $list
}

# Network ports = physical adapters that are connected (a LiDAR on its own port shows up here).
function Get-Ports {
  $p = @{}
  try { foreach ($a in (Get-NetAdapter -Physical -ErrorAction Stop | Where-Object { $_.Status -eq 'Up' })) { $p[$a.Name] = $a.InterfaceDescription } } catch {}
  return $p
}

function Get-MyIp {
  try { return (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop | Where-Object { $_.IPAddress -like '172.17.*' -or $_.IPAddress -like '10.*' -or $_.IPAddress -like '192.168.*' } | Select-Object -First 1).IPAddress } catch { return "" }
}

function Send-Row($row) {
  $h = @{ apikey = $SB_KEY; Authorization = "Bearer $SB_KEY"; Prefer = "resolution=merge-duplicates,return=minimal" }
  $body = ConvertTo-Json -InputObject @($row) -Depth 6 -Compress
  Invoke-RestMethod -Method Post -Uri "$SB_URL/rest/v1/fleet_records?on_conflict=kind,id" -Headers $h -ContentType "application/json; charset=utf-8" -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 20 | Out-Null
}

function New-Row($cfg) {
  $base = Get-Content $BasePath -Raw | ConvertFrom-Json
  $nowS = Get-Sensors; $nowP = Get-Ports
  $missing = @(); foreach ($pr in $base.sensors.PSObject.Properties) { if (-not $nowS.ContainsKey($pr.Name)) { $missing += [string]$pr.Value } }
  $portsDown = @(); foreach ($pr in $base.ports.PSObject.Properties) { if (-not $nowP.ContainsKey($pr.Name)) { $portsDown += "$($pr.Name) ($($pr.Value))" } }
  $now = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
  $data = [ordered]@{ unit = $cfg.unit; pc = $env:COMPUTERNAME; role = "Minion"; ip = (Get-MyIp); at = $now; ver = $Version
    sensors = [ordered]@{ base = @($base.sensors.PSObject.Properties).Count; ports = @($base.ports.PSObject.Properties).Count; missing = $missing; portsDown = $portsDown } }
  return [ordered]@{ kind = "colibri_hb"; id = "$($cfg.unit)|$env:COMPUTERNAME"; data = $data; deleted = $false; updated_at = $now }
}

if ($Install -or $Uninstall) {
  $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdmin) { Write-Host "Please run as administrator." -ForegroundColor Red; exit 1 }
  if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) { Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false }
  if ($Uninstall) { Write-Host "Colibri minion sensor check removed." -ForegroundColor Green; exit 0 }
  if (-not $Unit) { Write-Host "Add the unit name, for example -Unit ""Colibri XL03""" -ForegroundColor Red; exit 1 }
  try {
    New-Item -ItemType Directory -Path $Home_ -Force | Out-Null
    $dest = Join-Path $Home_ "colibri-minion-agent.ps1"
    Copy-Item -Path $PSCommandPath -Destination $dest -Force
    @{ unit = $Unit } | ConvertTo-Json | Set-Content -Path $CfgPath -Encoding UTF8
    $s = Get-Sensors; $p = Get-Ports
    @{ taken = (Get-Date).ToString("s"); sensors = $s; ports = $p } | ConvertTo-Json -Depth 4 | Set-Content -Path $BasePath -Encoding UTF8
    $exe = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
    $act = New-ScheduledTaskAction -Execute $exe -Argument "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dest`""
    $pri = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
    $set = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
    try { $trg = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration (New-TimeSpan -Days 3650)
          Register-ScheduledTask -TaskName $TaskName -Action $act -Trigger $trg -Principal $pri -Settings $set -ErrorAction Stop | Out-Null }
    catch { $trg = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 1)
          Register-ScheduledTask -TaskName $TaskName -Action $act -Trigger $trg -Principal $pri -Settings $set -ErrorAction Stop | Out-Null }
    Write-Host ""
    Write-Host ("Baseline recorded on " + $env:COMPUTERNAME + ":") -ForegroundColor Cyan
    foreach ($v in $s.Values) { Write-Host "  device: $v" }
    foreach ($k in $p.Keys) { Write-Host "  port:   $k ($($p[$k]))" }
  } catch { Write-Host "INSTALL FAILED: $($_.Exception.Message)" -ForegroundColor Red; Write-Log "install failed: $($_.Exception.Message)"; exit 1 }
  try { Send-Row (New-Row (Get-Content $CfgPath -Raw | ConvertFrom-Json)); Write-Host "Installed. $Unit / $env:COMPUTERNAME reported to the status page." -ForegroundColor Green }
  catch { Write-Host "Installed, but this minion can't reach the internet right now ($($_.Exception.Message))." -ForegroundColor Yellow; Write-Log "first report failed: $($_.Exception.Message)" }
  exit 0
}

try {
  $cfg = Get-Content $CfgPath -Raw | ConvertFrom-Json
  $row = New-Row $cfg
  Send-Row $row
  if ($Test) { Write-Host ("Sent. Missing devices: {0}; ports down: {1}" -f (@($row.data.sensors.missing).Count), (@($row.data.sensors.portsDown).Count)) -ForegroundColor Green }
} catch {
  Write-Log "check failed: $($_.Exception.Message)"
  if ($Test) { Write-Host "Check failed: $($_.Exception.Message)" -ForegroundColor Red; exit 1 }
}
