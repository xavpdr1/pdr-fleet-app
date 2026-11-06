# Colibri scan remote - runs on a Colibri unit's MAIN PC (the one with the Colibri window).
# Watches for "Start scan" presses from the phone page (scan.html) and presses Automatic Start in the Colibri window.
#   Install:   powershell -ExecutionPolicy Bypass -File colibri-scan-remote.ps1 -Install -Unit "Colibri 20"
#   Uninstall: powershell -ExecutionPolicy Bypass -File colibri-scan-remote.ps1 -Uninstall
#   Find test: powershell -ExecutionPolicy Bypass -File colibri-scan-remote.ps1 -FindTest   (finds Automatic Start, does NOT press it)
param([switch]$Install, [switch]$Uninstall, [string]$Unit, [string]$Pin, [switch]$FindTest, [switch]$Repair)

$Version  = "1.8"
$SB_URL   = "https://jedolnkjmlrruipkgqyd.supabase.co"
$SB_KEY   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZG9sbmtqbWxycnVpcGtncXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODk1ODQsImV4cCI6MjEwNjM2NTU4NH0.h3W7vimHuA_KPGmOjGN8HhM24k9apRta44l9D8xtF-Y"
$Home_    = Join-Path $env:ProgramData "ColibriScanRemote"
$CfgPath  = Join-Path $Home_ "config.json"
$LogPath  = Join-Path $Home_ "remote.log"
$BeatPath = Join-Path $Home_ "beat.txt"
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
  [DllImport("user32.dll")] public static extern IntPtr GetDC(IntPtr h);
  [DllImport("user32.dll")] public static extern int ReleaseDC(IntPtr h, IntPtr dc);
  [DllImport("gdi32.dll")] public static extern uint GetPixel(IntPtr dc, int x, int y);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h, int x, int y, int w, int hh, bool repaint);
  [DllImport("user32.dll")] public static extern bool IsZoomed(IntPtr h);
  public static List<IntPtr> TopWindows() {
    var l = new List<IntPtr>();
    EnumWindows((h, p) => { if (IsWindowVisible(h)) l.Add(h); return true; }, IntPtr.Zero);
    return l;
  }
  public static string Title(IntPtr h) { var sb = new StringBuilder(512); GetWindowText(h, sb, 512); return sb.ToString(); }
}
"@
try { [CsrNative]::SetProcessDPIAware() | Out-Null } catch {}

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

# Color of the Start/Cancel button: blue = Automatic Start (ready), red = Cancel Scan (scanning).
function Get-ButtonColor([int]$x, [int]$y) {
  $dc = [CsrNative]::GetDC([IntPtr]::Zero); $r = 0; $g = 0; $b = 0; $n = 0
  try { foreach ($dx in -6, 0, 6) { foreach ($dy in -3, 0, 3) { $c = [CsrNative]::GetPixel($dc, $x + $dx, $y + $dy); if ($c -eq 0xFFFFFFFF) { continue }; $r += $c -band 0xFF; $g += ($c -shr 8) -band 0xFF; $b += ($c -shr 16) -band 0xFF; $n++ } } }
  finally { [CsrNative]::ReleaseDC([IntPtr]::Zero, $dc) | Out-Null }
  if ($n -eq 0) { return @{ kind = "unknown"; rgb = "" } }
  $r = [int]($r / $n); $g = [int]($g / $n); $b = [int]($b / $n)
  $kind = "other"
  if ($r -gt 140 -and $r -gt $g + 60 -and $r -gt $b + 60) { $kind = "red" }
  elseif ($b -gt 110 -and $b -gt $r + 40) { $kind = "blue" }
  return @{ kind = $kind; rgb = "$r,$g,$b" }
}

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class CsrVision {
  // Finds the lowest wide blue (Automatic Start) or red (Cancel Scan) bar in the lower 3/4 of the image.
  // Returns {x, y, w, h, kind} with kind 1 = blue, 2 = red; or null.
  public static int[] FindButton(Bitmap bmp) {
    int W = bmp.Width, H = bmp.Height;
    var d = bmp.LockBits(new Rectangle(0, 0, W, H), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    int st = d.Stride; byte[] px = new byte[st * H]; Marshal.Copy(d.Scan0, px, 0, px.Length); bmp.UnlockBits(d);
    int[] best = null; int bestY = -1;
    for (int kind = 1; kind <= 2; kind++) {
      int[] cnt = new int[H], mn = new int[H], mx = new int[H];
      for (int y = H / 4; y < H; y++) {
        int c = 0, a = W, z = -1, o = y * st;
        for (int x = 0; x < W; x++) {
          int b = px[o + x * 4], g = px[o + x * 4 + 1], r = px[o + x * 4 + 2];
          bool hit = kind == 1 ? (b > 110 && b - r > 70 && g > 40 && g < 130 && r < 80) : (r > 160 && r - g > 90 && r - b > 90);
          if (hit) { c++; if (x < a) a = x; if (x > z) z = x; }
        }
        cnt[y] = c; mn[y] = a; mx[y] = z;
      }
      int thr = Math.Max(40, (int)(W * 0.10)), y0 = -1;
      for (int y = H / 4; y <= H; y++) {
        bool on = y < H && cnt[y] >= thr && cnt[y] < W * 0.85;
        if (on && y0 < 0) y0 = y;
        if (!on && y0 >= 0) {
          int hh = y - y0;
          if (hh >= 12 && hh <= 160) {
            int a = W, z = 0; for (int k = y0; k < y; k++) { if (mn[k] < a) a = mn[k]; if (mx[k] > z) z = mx[k]; }
            int ww = z - a;
            if (ww >= 60 && ww < W * 0.8 && y0 > bestY) { best = new int[] { a, y0, ww, hh, kind }; bestY = y0; }
          }
          y0 = -1;
        }
      }
    }
    return best;
  }
}
"@

function Grab-Window($w) {
  Add-Type -AssemblyName System.Drawing
  $bmp = New-Object Drawing.Bitmap ([int]$w.W), ([int]$w.H)
  $g = [Drawing.Graphics]::FromImage($bmp); $g.CopyFromScreen([int]$w.L, [int]$w.T, 0, 0, $bmp.Size); $g.Dispose()
  return $bmp
}

# Where the Start/Cancel button is right now (screen coordinates) and whether it is blue (ready) or red (scanning).
function Find-StartButton($w) {
  $bmp = Grab-Window $w
  try { $r = [CsrVision]::FindButton($bmp) } finally { $bmp.Dispose() }
  if (-not $r) { return $null }
  return @{ x = [int]($w.L + $r[0] + $r[2] / 2); y = [int]($w.T + $r[1] + $r[3] / 2); kind = $(if ($r[4] -eq 2) { "red" } else { "blue" }) }
}

# Put the Colibri window back to the size it had when the spots were taught.
function Restore-TaughtSize($w, $b) {
  if (-not ($b -and $b.w -and $b.h)) { return $w }
  if ([math]::Abs($w.W - $b.w) -le [math]::Max(8, $b.w * 0.02) -and [math]::Abs($w.H - $b.h) -le [math]::Max(8, $b.h * 0.02)) { return $w }
  try {
    Add-Type -AssemblyName System.Windows.Forms
    $wa = [System.Windows.Forms.Screen]::FromHandle($w.hwnd).WorkingArea
    if ($b.w -ge $wa.Width * 0.9 -and $b.h -ge $wa.Height * 0.85) { [CsrNative]::ShowWindow($w.hwnd, 3) | Out-Null }
    else { if ([CsrNative]::IsZoomed($w.hwnd)) { [CsrNative]::ShowWindow($w.hwnd, 9) | Out-Null; Start-Sleep -Milliseconds 300 }; [CsrNative]::MoveWindow($w.hwnd, $w.L, $w.T, [int]$b.w, [int]$b.h, $true) | Out-Null }
    Start-Sleep -Milliseconds 900
    Write-Log ("window resized from {0}x{1} to the taught {2}x{3}" -f $w.W, $w.H, $b.w, $b.h)
  } catch { Write-Log "resize failed: $($_.Exception.Message)" }
  return (Get-WinInfo $w.hwnd)
}

# On a failure, save a small picture of the Colibri window so the problem can be seen remotely.
function Save-Shot($w, [string]$unit, [string]$why) {
  try {
    Add-Type -AssemblyName System.Drawing
    $bmp = New-Object Drawing.Bitmap ([int]$w.W), ([int]$w.H)
    $g = [Drawing.Graphics]::FromImage($bmp); $g.CopyFromScreen([int]$w.L, [int]$w.T, 0, 0, $bmp.Size); $g.Dispose()
    $k = [math]::Min(1.0, 900.0 / $w.W)
    $sm = New-Object Drawing.Bitmap ([int]($w.W * $k)), ([int]($w.H * $k))
    $g2 = [Drawing.Graphics]::FromImage($sm); $g2.InterpolationMode = "HighQualityBicubic"; $g2.DrawImage($bmp, 0, 0, $sm.Width, $sm.Height); $g2.Dispose(); $bmp.Dispose()
    $enc = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $ep = New-Object Drawing.Imaging.EncoderParameters 1; $ep.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality), ([long]70)
    $ms = New-Object IO.MemoryStream; $sm.Save($ms, $enc, $ep); $sm.Dispose()
    $now = Now-Iso
    SB-Upsert ([ordered]@{ kind = "colibri_diag"; id = "$unit|shot|$now"; deleted = $false; updated_at = $now
      data = [ordered]@{ unit = $unit; pc = $env:COMPUTERNAME; why = $why; at = $now; ver = $Version; img = ("data:image/jpeg;base64," + [Convert]::ToBase64String($ms.ToArray())) } })
    Write-Log "saved screenshot: $why"
  } catch { Write-Log "screenshot failed: $($_.Exception.Message)" }
}

function Press-Cancel($cfg) {
  if (-not ($cfg -and $cfg.button)) { return "The Start/Cancel button hasn't been taught yet. Run the installer on the PC again." }
  $w = Find-ColibriWindow $cfg
  if (-not $w) { return "The Colibri window ($($cfg.button.proc)) isn't open on the PC." }
  Bring-ToFront $w.hwnd
  $w = Get-WinInfo $w.hwnd
  $sb = Find-StartButton $w
  if (-not $sb) { Save-Shot $w $cfg.unit "cancel: button not found"; return "Couldn't see the Cancel Scan button on the PC screen." }
  if ($sb.kind -eq "blue") { return "No scan is running on the PC." }
  Click-At $sb.x $sb.y
  for ($i = 0; $i -lt 10; $i++) { Start-Sleep -Milliseconds 500; $now = Find-StartButton $w; if (-not $now -or $now.kind -ne "red") { return "ok" } }
  return "Pressed Cancel Scan, but the scan still looks like it's running."
}

function Press-NewScan($cfg, $vals) {
  if (-not ($cfg -and $cfg.button)) { return "The Automatic Start button hasn't been taught yet. Run the installer on the PC again." }
  $w = Find-ColibriWindow $cfg
  if (-not $w) { return "The Colibri window ($($cfg.button.proc)) isn't open on the PC." }
  Bring-ToFront $w.hwnd
  $w = Get-WinInfo $w.hwnd
  $w = Restore-TaughtSize $w $cfg.button
  Bring-ToFront $w.hwnd
  $at = { param($p) @([int]($w.L + $p.fx * $w.W), [int]($w.T + $p.fy * $w.H)) }
  $note = ""
  $sb = Find-StartButton $w
  if ($sb -and $sb.kind -eq "red") { return "A scan is already running on the PC. Press Cancel first." }
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
  # find the button on screen (it can be briefly hidden or disabled while Colibri checks the plate)
  $sb = $null
  for ($i = 0; $i -lt 12; $i++) { $sb = Find-StartButton $w; if ($sb) { break }; Start-Sleep -Milliseconds 500 }
  if (-not $sb) { Save-Shot $w $cfg.unit "button not found before press"; return "Couldn't see the Automatic Start button on the PC screen." }
  if ($sb.kind -eq "red") { return ("ok" + $note) }
  # press, then confirm the scan really started (button turns red); press once more if it's still blue
  for ($try = 1; $try -le 2; $try++) {
    Bring-ToFront $w.hwnd
    Click-At $sb.x $sb.y
    for ($i = 0; $i -lt 16; $i++) {
      Start-Sleep -Milliseconds 500
      $now = Find-StartButton $w
      if ($now -and $now.kind -eq "red") { return ("ok" + $note + $(if ($try -gt 1) { " (needed a second press)" } else { "" })) }
    }
    if ($now) { $sb = $now } else { break }
  }
  Save-Shot $w $cfg.unit "start did not take"
  return "Pressed Automatic Start, but the scan didn't start."
}

# Starts at logon AND every 5 minutes, so a closed or crashed listener comes back on its own.
function Register-RemoteTask([string]$dest, [string]$user) {
  $exe  = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
  $act  = New-ScheduledTaskAction -Execute $exe -Argument "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dest`""
  $t1   = New-ScheduledTaskTrigger -AtLogOn -User $user
  try { $t2 = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 5) }
  catch { $t2 = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 5) -RepetitionDuration (New-TimeSpan -Days 3650) }
  $pri  = New-ScheduledTaskPrincipal -UserId $user -LogonType Interactive -RunLevel Highest
  $set  = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1)
  if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) { Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false }
  Register-ScheduledTask -TaskName $TaskName -Action $act -Trigger @($t1, $t2) -Principal $pri -Settings $set -ErrorAction Stop | Out-Null
}

function Test-Locked { return [bool](Get-Process -Name LogonUI -ErrorAction SilentlyContinue) }

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
    elseif (Test-Locked) { $status = "failed"; $msg = "The PC screen is locked or signed out. Unlock it so the remote can press the buttons." }
    else {
      $res = "ok"
      try { if ($d.cmd -eq "cancel") { $res = Press-Cancel $cfg } else { $res = Press-NewScan $cfg $d.fields } } catch { $res = "Error: $($_.Exception.Message)" }
      if ($res -like "ok*") {
        if ($d.cmd -eq "cancel") { $status = "cancelled"; $msg = "Cancel Scan pressed on $env:COMPUTERNAME." }
        else { $status = "started"; $msg = "Automatic Start pressed on $env:COMPUTERNAME." + $res.Substring(2) }
      }
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
  if ($Repair -and -not ($oldCfg -and $oldCfg.pinHash -and $oldCfg.button)) { Write-Host "Nothing to repair yet: run the normal installer for this unit first." -ForegroundColor Red; exit 1 }
  $pinHash = $null; if ($Repair) { $pinHash = $oldCfg.pinHash }
  while (-not $pinHash) {
    if (-not $Pin) { $Pin = Read-Host ("Choose a PIN for the phone remote (4 to 8 digits)" + $(if ($oldCfg) { ", or just press Enter to keep the current PIN" } else { "" })) }
    if (-not $Pin -and $oldCfg -and $oldCfg.pinHash) { $pinHash = $oldCfg.pinHash }
    elseif ($Pin -match '^\d{4,8}$') { $pinHash = Get-Hash $Pin }
    else { $Pin = "" }
  }
  New-Item -ItemType Directory -Path $Home_ -Force | Out-Null
  $dest = Join-Path $Home_ "colibri-scan-remote.ps1"
  if ($PSCommandPath -ne $dest) { Copy-Item -Path $PSCommandPath -Destination $dest -Force }
  if ($Repair) { $t = @{ fields = $oldCfg.fields; button = $oldCfg.button }; Write-Host "Keeping the PIN and the taught spots." -ForegroundColor Green }
  else { $t = Teach-All $oldCfg }
  $button = $t.button
  [ordered]@{ unit = $Unit; pinHash = $pinHash; button = $button; fields = $t.fields } | ConvertTo-Json -Depth 5 | Set-Content -Path $CfgPath -Encoding UTF8
  $user = [Security.Principal.WindowsIdentity]::GetCurrent().Name
  $exe  = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
  try { Register-RemoteTask $dest $user }
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
function Get-Mutex([int]$ms) { try { return $mutex.WaitOne($ms) } catch [Threading.AbandonedMutexException] { Write-Log "previous listener had crashed; taking over"; return $true } }
try {
  $mutex = New-Object Threading.Mutex($false, "Global\ColibriScanRemote")
  if (-not (Get-Mutex 20000)) {
    $age = 9999; try { $age = ((Get-Date) - (Get-Item $BeatPath).LastWriteTime).TotalSeconds } catch {}
    if ($age -lt 120) { exit 0 }
    Write-Log "other listener stopped responding ($([int]$age) s); replacing it"
    foreach ($lp in (Get-ListenerPids)) { Stop-Process -Id $lp -Force -ErrorAction SilentlyContinue }
    if (-not (Get-Mutex 15000)) { Write-Log "could not take over"; exit 0 }
  }
  $cfg = Get-Content $CfgPath -Raw | ConvertFrom-Json
} catch {
  Write-Log "listener failed to start: $($_.Exception.Message)"
  try { $c = Get-Content $CfgPath -Raw | ConvertFrom-Json; Send-Ready $c ("start failed: " + $_.Exception.Message) } catch {}
  exit 1
}
Write-Log "listener started v$Version for $($cfg.unit)"
# older installs only started at logon: add the every-5-minutes restart (the listener runs elevated, so it can)
try {
  $tk = Get-ScheduledTask -TaskName $TaskName -ErrorAction Stop
  if (@($tk.Triggers).Count -lt 2) { Register-RemoteTask $PSCommandPath ([Security.Principal.WindowsIdentity]::GetCurrent().Name); Write-Log "scheduled task upgraded: restarts every 5 minutes" }
} catch { Write-Log "task check failed: $($_.Exception.Message)" }
$lastReady = [DateTime]::MinValue
$lastUpd   = Get-Date
while ($true) {
  if ($script:checkNow -or ((Get-Date) - $lastUpd).TotalMinutes -ge 10) { $script:checkNow = $false; $lastUpd = Get-Date; Check-Update }
  try { $cfg = Get-Content $CfgPath -Raw | ConvertFrom-Json } catch {}
  try { [IO.File]::WriteAllText($BeatPath, (Get-Date).ToString("o")) } catch {}
  $locked = Test-Locked
  if ($locked -ne $script:wasLocked) { $script:wasLocked = $locked; $lastReady = [DateTime]::MinValue }
  try {
    if (((Get-Date) - $lastReady).TotalSeconds -ge 30) { Send-Ready $cfg $(if ($locked) { "locked" } else { "listening" }); $lastReady = Get-Date }
    Handle-Commands $cfg
  } catch { Write-Log "loop error: $($_.Exception.Message)"; try { Send-Ready $cfg ("error: " + $_.Exception.Message); $lastReady = Get-Date } catch {}; Start-Sleep -Seconds 5 }
  Start-Sleep -Seconds 2
}
