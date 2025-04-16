# Start MongoDB
Start-Process "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" -ArgumentList "--dbpath", "C:\data\db"

# Wait for MongoDB to start
Start-Sleep -Seconds 5

# Initialize the database
Write-Host "Initializing database..."
node server/init-db.js

# Start the backend server
Start-Process "npm" -ArgumentList "run", "server" -WorkingDirectory $PSScriptRoot

# Start the frontend
Start-Process "npm" -ArgumentList "start" -WorkingDirectory $PSScriptRoot

Write-Host "BookTalk app is starting..."
Write-Host "Frontend will be available at: http://localhost:3000"
Write-Host "Backend will be available at: http://localhost:5000"
