$ErrorActionPreference = 'Stop'

$repoRoot = (& git rev-parse --show-toplevel).Trim()
if ($LASTEXITCODE -ne 0) {
    throw 'Not inside a Git repository.'
}
Set-Location -LiteralPath $repoRoot

$branch = (& git branch --show-current).Trim()
if (-not $branch -or $branch -eq 'main') {
    throw "Forge guard requires a named non-main branch; current branch is '$branch'."
}

$hooksPath = (& git config --get core.hooksPath).Trim()
if ($hooksPath -ne '.githooks') {
    throw "core.hooksPath must be '.githooks'; found '$hooksPath'."
}

$requiredHooks = @('.githooks/pre-commit', '.githooks/pre-push')
foreach ($hook in $requiredHooks) {
    if (-not (Test-Path -LiteralPath $hook -PathType Leaf)) {
        throw "Required Forge hook is missing: $hook"
    }
}

$gitCommand = Get-Command git -ErrorAction Stop
$gitRoot = Split-Path -Parent (Split-Path -Parent $gitCommand.Source)
$gitShell = Join-Path $gitRoot 'bin/sh.exe'
if (-not (Test-Path -LiteralPath $gitShell -PathType Leaf)) {
    throw "Git shell was not found at '$gitShell'."
}

$head = (& git rev-parse HEAD).Trim()
$root = (& git rev-list --max-parents=0 HEAD | Select-Object -First 1).Trim()
$zeroOid = '0000000000000000000000000000000000000000'

& $gitShell '.githooks/pre-commit'
if ($LASTEXITCODE -ne 0) {
    throw 'pre-commit rejected the current non-main branch.'
}

$mainProbe = "refs/heads/$branch $head refs/heads/main $head"
$savedErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = 'SilentlyContinue'
$mainProbe | & $gitShell '.githooks/pre-push' origin probe 2>$null
$mainProbeExitCode = $LASTEXITCODE
$ErrorActionPreference = $savedErrorActionPreference
if ($mainProbeExitCode -eq 0) {
    throw 'pre-push did not reject a direct push to main.'
}

$deleteProbe = "(delete) $zeroOid refs/heads/forge-delete-probe $head"
$ErrorActionPreference = 'SilentlyContinue'
$deleteProbe | & $gitShell '.githooks/pre-push' origin probe 2>$null
$deleteProbeExitCode = $LASTEXITCODE
$ErrorActionPreference = $savedErrorActionPreference
if ($deleteProbeExitCode -eq 0) {
    throw 'pre-push did not reject a remote branch deletion.'
}

$forceProbe = "refs/heads/$branch $root refs/heads/forge-force-probe $head"
$ErrorActionPreference = 'SilentlyContinue'
$forceProbe | & $gitShell '.githooks/pre-push' origin probe 2>$null
$forceProbeExitCode = $LASTEXITCODE
$ErrorActionPreference = $savedErrorActionPreference
if ($forceProbeExitCode -eq 0) {
    throw 'pre-push did not reject a non-fast-forward update.'
}

$newBranchProbe = "refs/heads/$branch $head refs/heads/forge-new-probe $zeroOid"
$newBranchProbe | & $gitShell '.githooks/pre-push' origin probe 2>$null
if ($LASTEXITCODE -ne 0) {
    throw 'pre-push rejected an allowed new branch push.'
}

Write-Output "Forge guard PASS: branch=$branch; hooksPath=$hooksPath; main/force/delete blocked; new branch allowed."
