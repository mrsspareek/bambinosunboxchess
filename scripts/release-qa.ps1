$ErrorActionPreference = 'Stop'
$workspace = (Resolve-Path "$PSScriptRoot\..").Path

Write-Host '1/3 TypeScript validation'
& (Join-Path $workspace 'node_modules\.bin\tsc.cmd') --noEmit

Write-Host '2/3 Clean production build'
$nextDirectory = Join-Path $workspace '.next'
if (Test-Path -LiteralPath $nextDirectory) {
  $resolvedNext = (Resolve-Path -LiteralPath $nextDirectory).Path
  if ($resolvedNext -ne $nextDirectory) { throw "Refusing to remove unexpected path: $resolvedNext" }
  Remove-Item -LiteralPath $resolvedNext -Recurse -Force
}
Push-Location $workspace
try { & npm.cmd run build } finally { Pop-Location }

Write-Host '3/3 Required artifact checks'
$required = @(
  'ZING_INTEGRATION_GUIDE.md',
  'DEPLOYMENT.md',
  '.env.example',
  'src\app\api\health\route.ts',
  'src\proxy.ts',
  'src\lib\fullCurriculumData.ts'
)
foreach ($path in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $workspace $path))) { throw "Missing release artifact: $path" }
}

$curriculum = Get-Content -LiteralPath (Join-Path $workspace 'src\lib\fullCurriculumData.ts') -Raw
$seedBlock = [regex]::Match($curriculum, 'const seeds:[\s\S]*?\n\];').Value
$sessionCount = ([regex]::Matches($seedBlock, "title: '")).Count
if ($sessionCount -ne 48) { throw "Expected 48 curriculum sessions; found $sessionCount." }

Write-Host 'Release QA gates passed.' -ForegroundColor Green
