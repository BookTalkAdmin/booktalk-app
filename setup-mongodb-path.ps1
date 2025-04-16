# Run as administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator!"
    Exit
}

Write-Host "Checking for MongoDB installation..." -ForegroundColor Yellow

# Define possible MongoDB paths
$possiblePaths = @(
    "C:\Program Files\MongoDB\Server\6.0\bin",
    "C:\Program Files\MongoDB\Server\5.0\bin",
    "C:\Program Files\MongoDB\Server\4.4\bin"
)

$mongoPath = $null

# Find the actual MongoDB path
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $mongoPath = $path
        break
    }
}

if ($null -eq $mongoPath) {
    Write-Host "MongoDB installation not found in common locations." -ForegroundColor Red
    Write-Host "Please make sure MongoDB is installed correctly." -ForegroundColor Red
    Write-Host "You can download MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Exit
}

Write-Host "MongoDB found at: $mongoPath" -ForegroundColor Green

# Get the current PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

# Check if MongoDB is already in PATH
if ($currentPath -like "*$mongoPath*") {
    Write-Host "MongoDB is already in your PATH!" -ForegroundColor Green
} else {
    # Add MongoDB to PATH
    try {
        $newPath = "$currentPath;$mongoPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
        Write-Host "Successfully added MongoDB to PATH!" -ForegroundColor Green
    } catch {
        Write-Host "Error adding MongoDB to PATH: $_" -ForegroundColor Red
        Exit
    }
}

Write-Host "`nVerifying MongoDB installation..." -ForegroundColor Yellow
try {
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    $mongoVersion = mongod --version
    Write-Host "MongoDB is properly installed and configured!" -ForegroundColor Green
    Write-Host $mongoVersion
} catch {
    Write-Host "Could not verify MongoDB installation. Please restart your terminal and try 'mongod --version'" -ForegroundColor Yellow
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Restart any open terminals for the PATH changes to take effect" -ForegroundColor White
Write-Host "2. Run 'mongod --version' to verify the installation" -ForegroundColor White
Write-Host "3. Start MongoDB server with 'mongod --dbpath C:\data\db'" -ForegroundColor White
Write-Host "4. Run the BookTalk application using '.\start-app.ps1'" -ForegroundColor White

Read-Host "`nPress Enter to exit"
