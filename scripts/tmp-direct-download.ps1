[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Save-RemoteImage {
  param(
    [string]$Url,
    [string]$OutFile
  )

  $dir = Split-Path -Parent $OutFile
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  Invoke-WebRequest -Uri $Url -Headers @{ 'User-Agent' = 'Mozilla/5.0' } -OutFile $OutFile
}

$downloads = @(
  @{
    Url = 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1600&q=80'
    OutFile = 'src/assets/andhrapradesh/kurnool/Oravakallu Rock Garden.jpg'
  },
  @{
    Url = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80'
    OutFile = 'src/assets/andhrapradesh/ongole/Chennakesava Swamy Temple.jpg'
  }
)

foreach ($item in $downloads) {
  Save-RemoteImage -Url $item.Url -OutFile $item.OutFile
  Write-Host "saved $($item.OutFile)"
}
