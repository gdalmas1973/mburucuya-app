$v = Get-Date -Format "yyyyMMddHHmm"
Set-Content -Path "version.json" -Value "{`"v`":`"$v`"}" -Encoding utf8 -NoNewline
(Get-Content "sw.js" -Raw) -replace "const CACHE = 'mbu-[^']*'", "const CACHE = 'mbu-$v'" | Set-Content "sw.js" -Encoding utf8
Write-Host "Versión: $v"
firebase deploy --only hosting
