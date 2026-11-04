<#
  Colibri check-in script  (PDR-Team USA)
  ----------------------------------------
  Tells the "Colibri Unit Status" page that this PC is on.
  - Sends a check-in every minute while Windows is running.
  - Sends a "came online" entry each time Windows starts.
  It only sends: unit name, computer name, role, Windows version, last boot time, a time stamp,
  the approximate city/state and network provider of the internet connection (looked up from ipinfo.io),
  and how many minions are connected to Colibri Core (counted from this PC's local network connections).
  It does not change or control the scanner software.

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
$Version  = "1.4.1"
$Home_    = Join-Path $env:ProgramData "ColibriCheckin"
$CfgPath  = Join-Path $Home_ "config.json"
$LogPath  = Join-Path $Home_ "checkin.log"
$GeoPath  = Join-Path $Home_ "geo.json"
$NamesPath = Join-Path $Home_ "minion-names.json"
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

# Approximate location from the internet connection (city/state + network provider).
# Looked up at startup and then every 30 minutes; the last result is kept in geo.json.
function Get-Geo([bool]$force) {
  $cache = $null
  try { if (Test-Path $GeoPath) { $cache = Get-Content $GeoPath -Raw | ConvertFrom-Json } } catch {}
  $nowS = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  if ($cache -and (-not $force) -and (($nowS - [int64]$cache.ts) -lt 1800)) { return $cache }
  try {
    $r = Invoke-RestMethod -Uri "https://ipinfo.io/json" -TimeoutSec 10
    $org = [string]$r.org -replace '^AS\d+\s+', ''
    $geo = [ordered]@{ city = [string]$r.city; region = [string]$r.region; country = [string]$r.country; loc = [string]$r.loc; net = $org; ts = $nowS }
    try {
      if (-not (Test-Path $Home_)) { New-Item -ItemType Directory -Path $Home_ -Force | Out-Null }
      ($geo | ConvertTo-Json -Compress) | Set-Content -Path $GeoPath -Encoding UTF8
    } catch {}
    return $geo
  } catch { return $cache }
}

# Count minions connected to Colibri Core: each minion keeps a TCP connection to the core PC
# on the local scanner network. Find the server port with the most distinct local-network peers.
# Minion names come from the Remote Desktop shortcuts (.rdp) on this PC's desktops, e.g. "Top-653.rdp".
# Only the "full address" line of each shortcut is read. The name list is refreshed every 30 minutes.
function Get-MinionNames {
  $nowS = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  try { if (Test-Path $NamesPath) { $c = Get-Content $NamesPath -Raw | ConvertFrom-Json; if (($nowS - [int64]$c.ts) -lt 1800) { $m = @{}; foreach ($p in $c.map.PSObject.Properties) { $m[$p.Name] = $p.Value }; return $m } } } catch {}
  $map = @{}
  $dirs = @()
  if ($env:PUBLIC) { $dirs += (Join-Path $env:PUBLIC "Desktop") }
  try {
    foreach ($u in (Get-ChildItem "C:\Users" -Directory -ErrorAction SilentlyContinue)) {
      $dirs += (Join-Path $u.FullName "Desktop")
      foreach ($od in (Get-ChildItem $u.FullName -Directory -Filter "OneDrive*" -ErrorAction SilentlyContinue)) { $dirs += (Join-Path $od.FullName "Desktop") }
    }
  } catch {}
  foreach ($d in $dirs) {
    foreach ($f in (Get-ChildItem $d -Filter "*.rdp" -ErrorAction SilentlyContinue)) {
      try {
        $line = Select-String -Path $f.FullName -Pattern '^\s*full address:s:(.+)$' -ErrorAction Stop | Select-Object -First 1
        if (-not $line) { $map["unresolved:" + $f.BaseName] = $f.BaseName; continue }
        $addr = $line.Matches[0].Groups[1].Value.Trim() -replace ':\d+$', ''
        $ips = @()
        if ($addr -match '^\d+\.\d+\.\d+\.\d+$') { $ips = @($addr) }
        else { try { $ips = @([Net.Dns]::GetHostAddresses($addr) | Where-Object { $_.AddressFamily -eq 'InterNetwork' } | ForEach-Object { $_.IPAddressToString }) } catch {} }
        if ($ips.Count -eq 0) { $map["unresolved:" + $f.BaseName] = $f.BaseName }
        foreach ($ip in $ips) { $map[$ip] = $f.BaseName }
      } catch {}
    }
  }
  try { (@{ ts = $nowS; map = $map } | ConvertTo-Json -Compress) | Set-Content -Path $NamesPath -Encoding UTF8 } catch {}
  return $map
}

function Get-Minions {
  try {
    $byPid = @{}; Get-Process | ForEach-Object { $byPid[$_.Id] = $_.ProcessName }
    $listen = @{}; Get-NetTCPConnection -State Listen -ErrorAction Stop | ForEach-Object { $listen[[int]$_.LocalPort] = $true }
    $est = Get-NetTCPConnection -State Established -ErrorAction Stop | Where-Object { $_.RemoteAddress -match '^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)' -and $_.RemoteAddress -notmatch '\.1$' }
    if (-not $est) { return [ordered]@{ up = 0; how = "no local connections" } }
    $groups = $est | Group-Object { if ($listen[[int]$_.LocalPort]) { "in:" + $_.LocalPort } else { "out:" + $_.RemotePort } }
    $best = $null; $bestIps = @()
    foreach ($g in $groups) {
      $ips = @($g.Group | ForEach-Object { $_.RemoteAddress } | Sort-Object -Unique)
      if ($ips.Count -gt $bestIps.Count) { $best = $g; $bestIps = $ips }
    }
    $prog = $byPid[[int]($best.Group[0].OwningProcess)]
    $res = [ordered]@{ up = $bestIps.Count; how = "$($best.Name) $prog"; ips = ($bestIps -join " ") }
    try {
      $names = Get-MinionNames
      if ($names.Count -gt 0) {
        $res.named = @($names.GetEnumerator() | Sort-Object Value | ForEach-Object { [ordered]@{ n = $_.Value; ip = $_.Key; up = ($bestIps -contains $_.Key) } })
      }
    } catch {}
    return $res
  } catch { return [ordered]@{ up = $null; how = "error: $($_.Exception.Message)" } }
}

function New-CheckinRows($cfg, [bool]$withStartup) {
  $nowUtc = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
  $pc = $env:COMPUTERNAME
  $boot = ""; $os = ""
  try { $w = Get-CimInstance Win32_OperatingSystem; $boot = $w.LastBootUpTime.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ"); $os = $w.Caption } catch {}
  $data = [ordered]@{ unit = $cfg.unit; pc = $pc; role = $cfg.role; at = $nowUtc; boot = $boot; os = $os; ver = $Version }
  $g = Get-Geo $withStartup
  if ($g) { $data.geo = [ordered]@{ city = $g.city; region = $g.region; country = $g.country; loc = $g.loc; net = $g.net } }
  $data.minions = Get-Minions
  $rows = @([ordered]@{ kind = "colibri_hb"; id = "$($cfg.unit)|$pc"; data = $data; deleted = $false; updated_at = $nowUtc })
  if ($withStartup) {
    $ev = [ordered]@{ unit = $cfg.unit; pc = $pc; event = "online"; at = $nowUtc; boot = $boot }
    if ($data.geo) { $ev.geo = $data.geo }
    $rows += [ordered]@{ kind = "colibri_unitev"; id = "$($cfg.unit)|$pc|$nowUtc"; data = $ev; deleted = $false; updated_at = $nowUtc }
  }
  return $rows
}

# ---------------- install / uninstall ----------------
function Save-InstallLog([string]$msg) {
  $line = "{0}  v{1}  {2}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Version, $msg
  Write-Log $line
  try { Add-Content -Path (Join-Path $PSScriptRoot "install-log.txt") -Value $line } catch {}
}
if ($Install -or $Uninstall) {
  $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdmin) { Write-Host "Please run PowerShell as administrator (right-click > Run as administrator)." -ForegroundColor Red; exit 1 }
  foreach ($t in @($TaskBeat, $TaskBoot)) { if (Get-ScheduledTask -TaskName $t -ErrorAction SilentlyContinue) { Unregister-ScheduledTask -TaskName $t -Confirm:$false } }
  if ($Uninstall) { Write-Host "Colibri check-in removed from this PC." -ForegroundColor Green; exit 0 }

  if (-not $Unit) { Write-Host "Add the unit name, for example: -Unit ""Colibri 19""" -ForegroundColor Red; exit 1 }
  $step = "starting"
  try {
  $step = "creating C:\ProgramData\ColibriCheckin"
  New-Item -ItemType Directory -Path $Home_ -Force | Out-Null
  Remove-Item $NamesPath -Force -ErrorAction SilentlyContinue
  $dest = Join-Path $Home_ "colibri-checkin.ps1"
  $step = "copying the script"
  Copy-Item -Path $PSCommandPath -Destination $dest -Force
  @{ unit = $Unit; role = $Role } | ConvertTo-Json | Set-Content -Path $CfgPath -Encoding UTF8

  $exe  = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
  $args1 = "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dest`""
  $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
  $settings  = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

  $step = "creating the every-minute task"
  $beatAction = New-ScheduledTaskAction -Execute $exe -Argument $args1
  $beatDesc = "Sends a check-in to the PDR-Team Colibri Unit Status page every minute."
  try {
    $beatTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration (New-TimeSpan -Days 3650)
    Register-ScheduledTask -TaskName $TaskBeat -Action $beatAction -Trigger $beatTrigger -Principal $principal -Settings $settings -Description $beatDesc -ErrorAction Stop | Out-Null
  } catch {
    # Some Windows builds reject long repeat durations: fall back to "repeat indefinitely".
    $beatTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 1)
    Register-ScheduledTask -TaskName $TaskBeat -Action $beatAction -Trigger $beatTrigger -Principal $principal -Settings $settings -Description $beatDesc -ErrorAction Stop | Out-Null
  }

  $step = "creating the startup task"
  $bootTrigger = New-ScheduledTaskTrigger -AtStartup
  Register-ScheduledTask -TaskName $TaskBoot -Action (New-ScheduledTaskAction -Execute $exe -Argument "$args1 -Startup") -Trigger $bootTrigger -Principal $principal -Settings $settings -Description "Tells the PDR-Team Colibri Unit Status page this PC just started." | Out-Null

  } catch {
    $msg = "INSTALL FAILED while $step : $($_.Exception.Message)"
    Write-Host $msg -ForegroundColor Red
    Write-Host "A copy of this message is saved in install-log.txt next to the installer. Send a photo or that file to Xavier." -ForegroundColor Red
    Save-InstallLog $msg
    exit 1
  }
  Save-InstallLog "Installed $Unit ($Role) on $env:COMPUTERNAME, version $Version"
  try { Send-Rows (New-CheckinRows (Get-Config) $true); Write-Host "Installed. $Unit ($env:COMPUTERNAME) just checked in and should show Online on the status page." -ForegroundColor Green }
  catch {
    Save-InstallLog "first check-in failed: $($_.Exception.Message)"
    Write-Host "Installed OK, but this PC can't reach the internet right now ($($_.Exception.Message))." -ForegroundColor Yellow
    Write-Host "Nothing else to do: it will check in by itself as soon as the internet (Starlink) is connected." -ForegroundColor Yellow
  }
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
