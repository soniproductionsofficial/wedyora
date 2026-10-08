Add-Type -AssemblyName System.Drawing
$src = Join-Path $PSScriptRoot '..\public\wedyora-logo-footer.jpg'
$dst = Join-Path $PSScriptRoot '..\public\wedyora-logo-footer.png'
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$out = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($x = 0; $x -lt $bmp.Width; $x++) {
  for ($y = 0; $y -lt $bmp.Height; $y++) {
    $c = $bmp.GetPixel($x, $y)
    if ($c.R -lt 45 -and $c.G -lt 45 -and $c.B -lt 45) {
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    } else {
      $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
    }
  }
}
$out.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$out.Dispose()
Write-Output "Created $dst"
