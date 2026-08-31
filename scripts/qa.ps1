$ErrorActionPreference = 'Stop'

Write-Host '1/3 TypeScript validation'
& "$PSScriptRoot\..\node_modules\.bin\tsc.cmd" --noEmit

Write-Host '2/3 Production build'
& npm.cmd run build

Write-Host '3/3 Required artifact checks'
$required = @(
  'ZING_INTEGRATION_GUIDE.md',
  'DEPLOYMENT.md',
  '.env.example',
  'src/app/api/health/route.ts',
  'src/middleware.ts',
  'src/lib/fullCurriculumData.ts'
)

foreach ($path in $required) {
  $absolute = Join-Path (Resolve-Path "$PSScriptRoot\..").Path $path
  if (-not (Test-Path -LiteralPath $absolute)) { throw "Missing required release artifact: $path" }
}

$curriculum = Get-Content -LiteralPath (Join-Path $PSScriptRoot '..\src\lib\fullCurriculumData.ts') -Raw
$sessionCount = ([regex]::Matches($curriculum, "title: '")).Count
if ($sessionCount -lt 48) { throw "Curriculum source does not contain 48 session definitions." }

Write-Host 'QA gates passed.' -ForegroundColor Green
