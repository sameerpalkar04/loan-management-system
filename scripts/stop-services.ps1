$stateFile = Join-Path $PSScriptRoot ".service-processes.json"

if (-not (Test-Path -LiteralPath $stateFile)) {
  Write-Host "No services started by start-services.ps1 are currently tracked."
  exit 0
}

$services = @(Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json)

# Stops only process trees whose recorded PID and start time still match.
foreach ($service in $services) {
  $process = Get-Process -Id $service.ProcessId -ErrorAction SilentlyContinue

  if ($null -eq $process) {
    Write-Host "$($service.Name) is no longer running."
    continue
  }

  $recordedStartTime = ([datetime]$service.StartedAt).ToUniversalTime().ToString("o")
  $actualStartTime = $process.StartTime.ToUniversalTime().ToString("o")

  if ($recordedStartTime -ne $actualStartTime) {
    Write-Warning "Skipped $($service.Name): its process ID has been reused."
    continue
  }

  Write-Host "Stopping $($service.Name)..."
  taskkill /PID $service.ProcessId /T /F | Out-Null
}

Remove-Item -LiteralPath $stateFile -Force
Write-Host "Tracked service processes have been stopped."
