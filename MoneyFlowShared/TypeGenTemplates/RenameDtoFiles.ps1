param(
  [Parameter(Mandatory = $true)]
  [string]$DtosPath
)

Get-ChildItem -Path $DtosPath -Filter *.ts | ForEach-Object {
  $file = $_.FullName
  $content = Get-Content -Raw $file

  # casa com 'export class XXX' ou 'export interface XXX'
  if ($content -match 'export\s+(class|interface)\s+([A-Za-z0-9_]+)') {
    $typeName = $matches[2]
    $target = Join-Path $_.DirectoryName "$typeName.ts"

    if ($file -ne $target) {
      Rename-Item -Path $file -NewName $target -Force
    }
  }
}
