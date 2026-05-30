[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Get-ImageFromCommonsFile {
  param([string]$FileTitle)
  $api = "https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=$([uri]::EscapeDataString($FileTitle))&prop=imageinfo&iiprop=url&iiurlwidth=1800&origin=*"
  $res = Invoke-RestMethod -Uri $api -Headers @{ 'User-Agent' = 'Mozilla/5.0' }
  $page = $res.query.pages.PSObject.Properties.Value | Where-Object { $_.imageinfo } | Select-Object -First 1
  if (-not $page) { throw "No image found for $FileTitle" }
  return @{ Title = $page.title; Url = $(if ($page.imageinfo[0].thumburl) { $page.imageinfo[0].thumburl } else { $page.imageinfo[0].url }) }
}

function Save-Url {
  param([string]$Url,[string]$OutFile)
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $OutFile) | Out-Null
  Invoke-WebRequest -Uri $Url -Headers @{ 'User-Agent'='Mozilla/5.0' } -OutFile $OutFile
}

$items = @(
  @{ FileTitle = 'File:Macherla chennakesava temple.jpg'; OutFile = 'src/assets/andhrapradesh/ongole/Chennakesava Swamy Temple.jpg' },
  @{ FileTitle = 'File:Orvakal Rock Garden, Kurnool.jpg'; OutFile = 'src/assets/andhrapradesh/kurnool/Oravakallu Rock Garden.jpg' }
)

foreach ($item in $items) {
  $img = Get-ImageFromCommonsFile -FileTitle $item.FileTitle
  Save-Url -Url $img.Url -OutFile $item.OutFile
  Write-Host "saved $($item.OutFile) from $($img.Title)"
}
