import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, Pause, Play } from 'lucide-react'
import { maternityPhotos, weddingPhotos } from '../../data/portfolioStories'
import { cn } from '../../lib/cn'
import { AnimatedReveal } from './ServiceFlipCard'

type Mode = 'wedding' | 'maternity'


export function InteractiveStoryGallery() {
  const [mode, setMode] = useState<Mode>('wedding')
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  const photos = mode === 'wedding' ? weddingPhotos : maternityPhotos
  const current = photos[index % photos.length]!

  /** Next 3 frames fill the tall panel under the hero — keeps the previous tall layout looking full of photos. */
  const belowPhotos = useMemo(() => {
    const picks = []
    for (let i = 1; i <= 3; i++) {
      picks.push(photos[(index + i) % photos.length]!)
    }
    return picks
  }, [photos, index])

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setIndex((i) => {
        const next = i + 1
        if (next >= photos.length) {
          if (mode === 'wedding') {
            setMode('maternity')
            return 0
          }
          setMode('wedding')
          return 0
        }
        return next
      })
    }, 3200)
    return () => window.clearInterval(id)
  }, [playing, mode, photos.length])

  function switchMode(next: Mode) {
    setMode(next)
    setIndex(0)
  }

  function prev() {
    setIndex((i) => (i - 1 + photos.length) % photos.length)
  }

  function next() {
    setIndex((i) => (i + 1) % photos.length)
  }

  return (
    <section className="relative overflow-hidden px-5 py-24 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-mehendi-page" />
      <div className="relative mx-auto max-w-7xl">
        <AnimatedReveal>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8e1454] uppercase">Living portfolio</p>
          <h2 className="mt-3 font-display text-4xl text-[#3a2f32] sm:text-5xl">
            Every celebration, framed with intention.
          </h2>
        </AnimatedReveal>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => switchMode('wedding')}
            className={cn(
              'rounded-full px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition',
              mode === 'wedding'
                ? 'bg-[#8e1454] text-white shadow-[0_8px_24px_rgba(142,20,84,0.35)]'
                : 'border border-[#8e1454]/25 text-[#8e1454] hover:bg-[#fff8f9]',
            )}
          >
            Wedding
          </button>
          <button
            type="button"
            onClick={() => switchMode('maternity')}
            className={cn(
              'rounded-full px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition',
              mode === 'maternity'
                ? 'bg-[#8e1454] text-white shadow-[0_8px_24px_rgba(142,20,84,0.35)]'
                : 'border border-[#8e1454]/25 text-[#8e1454] hover:bg-[#fff8f9]',
            )}
          >
            Maternity (6)
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-white/80 px-4 py-2 text-[11px] font-semibold tracking-[0.12em] text-[#8e1454] uppercase backdrop-blur-sm"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? 'Pause' : 'Play'}
          </button>
        </div>

        {/* Tall left panel (matches thumbnail column) — hero on top, photo strip fills the rest */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#8e1454]/12 bg-[#2d0f1c] shadow-[0_24px_60px_rgba(142,20,84,0.18)]">
            {/* Main featured frame */}
            <div className="relative aspect-[4/5] shrink-0 sm:aspect-[16/11]">
              <img
                key={`${mode}-${current.src}`}
                src={current.src}
                alt={current.caption}
                className="story-fade absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d0f1c]/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                <div>
                  <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-[#F6E04D] uppercase">
                    <Heart size={12} fill="#F6E04D" /> {mode === 'wedding' ? 'Wedding' : 'Maternity'}
                  </p>
                  <p className="mt-2 font-display text-2xl text-white sm:text-3xl">{current.caption}</p>
                  <p className="mt-1 text-xs text-white/70">
                    {index + 1} / {photos.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
                    aria-label="Next"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-1 px-4 py-3">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-1 flex-1 rounded-full transition',
                    i === index % photos.length ? 'bg-[#F6E04D]' : 'bg-white/25 hover:bg-white/40',
                  )}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>

            {/* Fills the tall leftover area with more photos (previous layout height restored) */}
            <div className="grid min-h-[220px] flex-1 grid-cols-3 gap-1.5 p-2 pt-0 sm:min-h-[280px]">
              {belowPhotos.map((p, i) => {
                const jumpTo = (index + 1 + i) % photos.length
                return (
                  <button
                    key={`${p.src}-below-${i}`}
                    type="button"
                    onClick={() => setIndex(jumpTo)}
                    className="group relative h-full min-h-[200px] overflow-hidden rounded-xl sm:min-h-[260px]"
                  >
                    <img
                      src={p.src}
                      alt={p.caption}
                      className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-80" />
                    <span className="absolute bottom-3 left-3 right-3 text-left text-[11px] font-medium text-white/90">
                      {p.caption}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 lg:grid-cols-2">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  'group relative overflow-hidden rounded-xl border transition',
                  i === index % photos.length
                    ? 'border-[#F6E04D] ring-2 ring-[#F6E04D]/40'
                    : 'border-[#8e1454]/10 hover:border-[#8e1454]/30',
                )}
              >
                <img
                  src={p.src}
                  alt=""
                  className="aspect-square w-full object-cover object-center transition duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
