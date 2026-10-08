import { cn } from '../lib/cn'

export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 text-gold', className)} aria-hidden>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/70" />
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 1.5L10.2 7.8L16.5 9L10.2 10.2L9 16.5L7.8 10.2L1.5 9L7.8 7.8L9 1.5Z" fill="currentColor" />
      </svg>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  )
}

export function SectionEyebrow({ children }: { children: string }) {
  return (
    <p className="inline-block rounded-sm bg-[#8e1454] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-[#F6E04D]">
      {children}
    </p>
  )
}
