import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function AnimatedReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('reveal-up', visible && 'reveal-up-visible', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function ServiceFlipCard({
  name,
  tagline,
  image,
  price,
  onSelect,
  delay = 0,
}: {
  name: string
  tagline: string
  image: string
  price: number
  onSelect: () => void
  delay?: number
}) {
  return (
    <AnimatedReveal delay={delay}>
      <button
        type="button"
        onClick={onSelect}
        className="flip-card group h-[320px] w-full text-left sm:h-[340px]"
      >
        <div className="flip-card-inner h-full w-full">
          <div className="flip-card-front overflow-hidden rounded-2xl border border-[#8e1454]/15 shadow-[0_16px_40px_rgba(142,20,84,0.12)]">
            <img src={image} alt={name} className="h-[68%] w-full object-cover object-center transition duration-700 group-hover:scale-105" />
            <div className="bg-gradient-to-r from-[#8e1454] to-[#5c1838] px-4 py-3">
              <p className="font-display text-lg text-white">{name}</p>
              <p className="mt-0.5 text-[11px] tracking-[0.12em] text-[#F6E04D] uppercase">Tap to explore</p>
            </div>
          </div>
          <div className="flip-card-back flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#fff8f9] via-white to-[#f9e4e8] p-5 border border-[#D4AF37]/30 shadow-[0_16px_40px_rgba(212,175,55,0.15)]">
            <div>
              <p className="font-display text-xl text-[#3a2f32]">{name}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{tagline}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#8e1454] uppercase">From</p>
              <p className="font-display text-2xl text-[#8e1454]">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)}
              </p>
              <span className="mt-3 inline-flex rounded-md bg-[#8e1454] px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white uppercase">
                Book now
              </span>
            </div>
          </div>
        </div>
      </button>
    </AnimatedReveal>
  )
}
