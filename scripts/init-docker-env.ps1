$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $projectRoot '.env'
if (Test-Path -LiteralPath $envFile) {
    throw "Refusing to overwrite $envFile. Keep its APP_KEY and database passwords stable."
}
$random = [System.Security.Cryptography.RandomNumberGenerator]::Create()
function New-RandomBase64 {
    $bytes = New-Object byte[] 32
    $random.GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}
try {
    $settings = @(
        'APP_KEY=base64:' + (New-RandomBase64)
        'DB_PASSWORD=' + (New-RandomBase64)
        'DB_ROOT_PASSWORD=' + (New-RandomBase64)
        'APP_URL=http://localhost:8080'
        'WEB_BIND_ADDRESS=127.0.0.1'
        'WEB_PORT=8080'
        'SESSION_SECURE_COOKIE=false'
        'ADMIN_EMAIL=admin@jobconnect.test'
        'ADMIN_PASSWORD=' + (New-RandomBase64)
    )
    [System.IO.File]::WriteAllText($envFile, ($settings -join "`n") + "`n", (New-Object System.Text.UTF8Encoding $false))
} finally {
    $random.Dispose()
}
Write-Host 'Created .env with unique secrets. Start with: docker compose up --build --wait'
