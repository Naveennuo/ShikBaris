[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Get-ImageFromCommonsFile {
  param([string]$FileTitle)
  $api = "https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=$([uri]::EscapeDataString($FileTitle))&prop=imageinfo&iiprop=url&iiurlwidth=1800&origin=*"
  $res = Invoke-RestMethod -Uri $api -Headers @{ 'User-Agent' = 'Mozilla/5.0' }
  $page = $res.query.pages.PSObject.Properties.Value | Where-Object { $_.imageinfo } | Select-Object -First 1
  if (-not $page) { throw "No image found for $FileTitle" }
  return $(if ($page.imageinfo[0].thumburl) { $page.imageinfo[0].thumburl } else { $page.imageinfo[0].url })
}

$url = Get-ImageFromCommonsFile -FileTitle 'File:Rock Gardens Near Kurnool.jpg'
Invoke-WebRequest -Uri $url -Headers @{ 'User-Agent'='Mozilla/5.0' } -OutFile 'src/assets/andhrapradesh/kurnool/Oravakallu Rock Garden.jpg'
Write-Host 'saved src/assets/andhrapradesh/kurnool/Oravakallu Rock Garden.jpg'
