$v = Get-Date -Format "yyyyMMddHHmm"
Set-Content -Path "version.json" -Value "{`"v`":`"$v`"}" -Encoding utf8 -NoNewline
Set-Content -Path "sw-ver.js"   -Value "// v: $v`n"    -Encoding utf8
Write-Host "Versión: $v"
firebase deploy --only hosting
