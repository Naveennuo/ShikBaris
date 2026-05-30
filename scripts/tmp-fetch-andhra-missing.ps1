$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Get-CommonsImageInfo($fileTitle) {
  $api = "https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=$([uri]::EscapeDataString($fileTitle))&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=2000&origin=*"
  return Invoke-RestMethod -Uri $api -Headers @{ 'User-Agent' = 'ShikBarisImageDownloader/1.0' }
}

function Download-WithRetry($url, $outFile) {
  $delays = @(3, 8, 15)
  for ($i = 0; $i -le $delays.Count; $i++) {
    try {
      Invoke-WebRequest -Uri $url -Headers @{ 'User-Agent' = 'Mozilla/5.0 ShikBarisImageDownloader/1.0' } -OutFile $outFile
      return
    } catch {
      if ($i -eq $delays.Count) { throw }
      Start-Sleep -Seconds $delays[$i]
    }
  }
}

$targets = @(
  @{ title = 'Oravakallu Rock Garden'; fileTitle = 'File:Rock Gardens Near Kurnool.jpg'; outFile = 'src/assets/andhrapradesh/kurnool/Oravakallu Rock Garden.jpg' },
  @{ title = 'Chennakesava Swamy Temple'; fileTitle = 'File:Macherla chennakesava temple.jpg'; outFile = 'src/assets/andhrapradesh/ongole/Chennakesava Swamy Temple.jpg' }
)

$updates = @()
foreach ($target in $targets) {
  New-Item -ItemType Directory -Force -Path ([System.IO.Path]::GetDirectoryName((Resolve-Path '.').Path + '\' + $target.outFile)) | Out-Null
  $body = Get-CommonsImageInfo $target.fileTitle
  $page = $body.query.pages.PSObject.Properties.Value | Where-Object { $_.imageinfo } | Select-Object -First 1
  if (-not $page) { throw "No page found for $($target.fileTitle)" }
  $info = $page.imageinfo[0]
  $imageUrl = if ($info.thumburl) { $info.thumburl } else { $info.url }
  Download-WithRetry -url $imageUrl -outFile $target.outFile
  $updates += [pscustomobject]@{
    title = $target.title
    query = $target.title
    sourceFile = $page.title
    sourcePage = $info.descriptionurl
    imageUrl = $imageUrl
    license = $info.extmetadata.LicenseShortName.value
    artist = (($info.extmetadata.Artist.value) -replace '<[^>]*>', '').Trim()
    localPath = $target.outFile
    status = 'downloaded'
  }
  Write-Host "saved $($target.outFile)"
}

$metadataPath = 'src/assets/andhrapradesh/wikimedia-download-metadata.json'
$metadata = Get-Content $metadataPath -Raw | ConvertFrom-Json
foreach ($update in $updates) {
  $existing = @($metadata.assets | Where-Object { $_.title -eq $update.title }) | Select-Object -First 1
  if ($existing) {
    $existing.query = $update.query
    $existing.sourceFile = $update.sourceFile
    $existing.sourcePage = $update.sourcePage
    $existing.imageUrl = $update.imageUrl
    $existing.license = $update.license
    $existing.artist = $update.artist
    $existing.localPath = $update.localPath
    $existing.status = $update.status
    if ($existing.PSObject.Properties['reason']) { $existing.PSObject.Properties.Remove('reason') }
  } else {
    $metadata.assets += $update
  }
}
$metadata.downloadedAt = (Get-Date).ToString('o')
$metadata | ConvertTo-Json -Depth 8 | Set-Content $metadataPath
