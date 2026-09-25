$services = @(
  @{ Name = "Service Registry"; Path = "Backend/service-registry"; Port = 8761 },
  @{ Name = "API Gateway"; Path = "Backend/api-gateway"; Port = 9000 },
  @{ Name = "Auth Service"; Path = "Backend/auth-service"; Port = 8000 },
  @{ Name = "Customer Service"; Path = "Backend/customer-service"; Port = 8001 },
  @{ Name = "Credit Score Service"; Path = "Backend/credit-score"; Port = 8002 },
  @{ Name = "Loan Type Service"; Path = "Backend/loan-type-service"; Port = 8081 },
  @{ Name = "Loan Application Service"; Path = "Backend/loan-application"; Port = 8083 },
  @{ Name = "Loan Officer Service"; Path = "Backend/loan-officer-service"; Port = 9001 }
)

$stateFile = Join-Path $PSScriptRoot ".service-processes.json"

if (Test-Path -LiteralPath $stateFile) {
  throw "A previous service run is still tracked. Run .\scripts\stop-services.ps1 before starting services again."
}

$startedServices = @()

# Returns whether a local service is already accepting connections on a port.
function Test-PortOpen {
  param([int]$Port)

  try {
    $connection = [System.Net.Sockets.TcpClient]::new("localhost", $Port)
    $connection.Dispose()
    return $true
  } catch {
    return $false
  }
}

# Waits until a service is listening before the next service is launched.
function Wait-ForPort {
  param(
    [int]$Port,
    [string]$Name
  )

  Write-Host "Waiting for $Name on port $Port..."

  while ($true) {
    try {
      $connection = [System.Net.Sockets.TcpClient]::new("localhost", $Port)
      $connection.Dispose()
      Write-Host "$Name is ready."
      return
    } catch {
      Start-Sleep -Seconds 2
    }
  }
}

# Launches every service in dependency order and waits for each configured port.
foreach ($service in $services) {
  $servicePath = Join-Path $PSScriptRoot "..\$($service.Path)"

  if (Test-PortOpen -Port $service.Port) {
    throw "$($service.Name) already appears to be running on port $($service.Port)."
  }

  Write-Host "Starting $($service.Name)..."

  $process = Start-Process `
    -FilePath "cmd.exe" `
    -ArgumentList "/c", ".\mvnw.cmd spring-boot:run" `
    -WorkingDirectory $servicePath `
    -WindowStyle Hidden `
    -PassThru

  $startedServices += [PSCustomObject]@{
    Name = $service.Name
    Port = $service.Port
    ProcessId = $process.Id
    StartedAt = $process.StartTime.ToUniversalTime().ToString("o")
  }
  $startedServices | ConvertTo-Json | Set-Content -LiteralPath $stateFile -Encoding utf8

  Wait-ForPort -Port $service.Port -Name $service.Name
}

Write-Host "All eight services have started."
