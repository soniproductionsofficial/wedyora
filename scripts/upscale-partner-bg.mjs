import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('public/vendor')
await mkdir(root, { recursive: true })

const input = path.join(root, 'login-bg.jpg')

const variants = [
  { file: 'login-bg.jpg', width: 1920, height: 1000, quality: 92 },
  { file: 'login-bg@2x.jpg', width: 2560, height: 1333, quality: 90 },
  { file: 'login-bg.webp', width: 1920, height: 1000, quality: 88, webp: true },
  { file: 'login-bg@2x.webp', width: 2560, height: 1333, quality: 86, webp: true },
]

for (const variant of variants) {
  let pipeline = sharp(input)
    .rotate()
    .resize(variant.width, variant.height, {
      fit: 'cover',
      position: 'left',
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.8, m1: 1.2, m2: 0.5 })

  const out = path.join(root, variant.file)
  if (variant.webp) {
    await pipeline.webp({ quality: variant.quality, effort: 6 }).toFile(out)
  } else {
    await pipeline
      .jpeg({ quality: variant.quality, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(out)
  }
  console.log('Wrote', variant.file)
}
