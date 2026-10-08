import { weddingPhotos } from '../data/portfolioStories'

export function Inspiration() {
  return (
    <div className="bg-white">
      <header className="border-b border-black/5 px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-[#8e1454] uppercase">Portfolio</p>
          <h1 className="mt-3 max-w-2xl font-display text-5xl text-[#3a2f32] sm:text-6xl">
            Frames that feel like memory
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {weddingPhotos.map((p) => (
            <figure key={p.src} className="mb-4 break-inside-avoid">
              <img src={p.src} alt={p.caption} className="w-full object-cover" />
              <figcaption className="mt-2 text-xs tracking-[0.08em] text-muted">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
