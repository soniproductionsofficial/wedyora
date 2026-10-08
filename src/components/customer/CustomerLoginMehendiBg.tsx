import { cn } from '../../lib/cn'

const GOLD = '#C9A227'
const GOLD_BRIGHT = '#F6E04D'
const GOLD_DEEP = '#A8841A'

/** Gol Tikki — classic bridal circular mehendi (concentric rings, petals, dotwork). */
function GolTikki({ size = 200, className }: { size?: number; className?: string }) {
  const petals = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180
    const x1 = 100 + Math.cos(angle) * 22
    const y1 = 100 + Math.sin(angle) * 22
    const x2 = 100 + Math.cos(angle) * 42
    const y2 = 100 + Math.sin(angle) * 42
    const cx = 100 + Math.cos(angle + 0.26) * 34
    const cy = 100 + Math.sin(angle + 0.26) * 34
    return (
      <path
        key={i}
        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
        stroke={GOLD}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    )
  })

  const dots = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 * Math.PI) / 180
    return (
      <circle
        key={i}
        cx={100 + Math.cos(angle) * 52}
        cy={100 + Math.sin(angle) * 52}
        r="1.8"
        fill={i % 2 === 0 ? GOLD_BRIGHT : GOLD}
      />
    )
  })

  const scallops = Array.from({ length: 16 }, (_, i) => {
    const a1 = (i * 22.5 * Math.PI) / 180
    const a2 = ((i + 1) * 22.5 * Math.PI) / 180
    const r = 62
    const x1 = 100 + Math.cos(a1) * r
    const y1 = 100 + Math.sin(a1) * r
    const x2 = 100 + Math.cos(a2) * r
    const y2 = 100 + Math.sin(a2) * r
    const mx = 100 + Math.cos((a1 + a2) / 2) * (r + 6)
    const my = 100 + Math.sin((a1 + a2) / 2) * (r + 6)
    return <path key={i} d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} stroke={GOLD_DEEP} strokeWidth="1" fill="none" />
  })

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Outer rotating ring */}
      <g className="gol-tikki-spin-slow">
        <circle cx="100" cy="100" r="78" stroke={GOLD} strokeWidth="1" opacity="0.45" strokeDasharray="4 6" />
        {scallops}
        {/* Four corner paisleys (ambi) */}
        <path
          d="M100 18 C118 28 122 48 108 58 C94 68 78 58 76 42 C74 28 88 18 100 18 Z"
          stroke={GOLD}
          strokeWidth="1.1"
          fill="none"
        />
        <path
          d="M182 100 C172 118 152 122 142 108 C132 94 142 78 158 76 C172 74 182 88 182 100 Z"
          stroke={GOLD}
          strokeWidth="1.1"
          fill="none"
        />
        <path
          d="M100 182 C82 172 78 152 92 142 C106 132 122 142 124 158 C126 172 112 182 100 182 Z"
          stroke={GOLD}
          strokeWidth="1.1"
          fill="none"
        />
        <path
          d="M18 100 C28 82 48 78 58 92 C68 106 58 122 42 124 C28 126 18 112 18 100 Z"
          stroke={GOLD}
          strokeWidth="1.1"
          fill="none"
        />
      </g>

      {/* Petal layer — counter spin */}
      <g className="gol-tikki-spin-reverse">
        {petals}
        <circle cx="100" cy="100" r="48" stroke={GOLD} strokeWidth="1.15" opacity="0.7" />
        {dots}
      </g>

      {/* Static center — bridal focal dot */}
      <g className="gol-tikki-center-pulse">
        <circle cx="100" cy="100" r="28" stroke={GOLD_BRIGHT} strokeWidth="1.2" opacity="0.85" />
        <circle cx="100" cy="100" r="18" stroke={GOLD} strokeWidth="1" />
        <circle cx="100" cy="100" r="10" fill={GOLD_BRIGHT} opacity="0.9" />
        <circle cx="100" cy="100" r="4" fill="#fff8dc" />
        {/* Inner jaali cross-hatch */}
        <path d="M88 100 H112 M100 88 V112" stroke={GOLD_DEEP} strokeWidth="0.8" opacity="0.6" />
        <path d="M91 91 L109 109 M109 91 L91 109" stroke={GOLD_DEEP} strokeWidth="0.6" opacity="0.45" />
      </g>
    </svg>
  )
}

/** Finger-band mehendi strip — teardrops + dots like fingertip henna. */
function FingerBand({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 320" className={cn('h-full w-full', className)} aria-hidden>
      <g stroke={GOLD} strokeWidth="1" fill="none" opacity="0.65">
        {[0, 48, 96, 144, 192, 240, 288].map((y) => (
          <g key={y}>
            <path d={`M30 ${y + 8} Q22 ${y + 20} 30 ${y + 32} Q38 ${y + 20} 30 ${y + 8} Z`} />
            <circle cx="30" cy={y + 40} r="2" fill={GOLD_BRIGHT} stroke="none" />
            <path d={`M18 ${y + 18} Q14 ${y + 26} 18 ${y + 34}`} />
            <path d={`M42 ${y + 18} Q46 ${y + 26} 42 ${y + 34}`} />
          </g>
        ))}
      </g>
    </svg>
  )
}

type Props = {
  variant?: 'page' | 'card'
  className?: string
}

export function CustomerLoginMehendiBg({ variant = 'page', className }: Props) {
  const isPage = variant === 'page'

  return (
    <div
      className={cn(
        'bridal-mehendi-scene pointer-events-none',
        isPage ? 'bridal-mehendi-scene-page' : 'bridal-mehendi-scene-card',
        className,
      )}
      aria-hidden
    >
      <div className={cn('bridal-mehendi-wash', isPage ? 'bridal-mehendi-wash-page' : 'bridal-mehendi-wash-card')} />

      {/* Jaali lace — unique subtle grid */}
      <div className="gol-tikki-jaali" />

      {/* Large watermark gol tikki (page only) */}
      {isPage && (
        <div className="gol-tikki-watermark">
          <GolTikki size={480} />
        </div>
      )}

      {/* Corner gol tikki motifs */}
      <div className={cn('gol-tikki-corner gol-tikki-corner-tl', isPage ? 'gol-tikki-corner-lg' : 'gol-tikki-corner-sm')}>
        <GolTikki size={isPage ? 260 : 160} />
      </div>
      <div className={cn('gol-tikki-corner gol-tikki-corner-tr', isPage ? 'gol-tikki-corner-lg' : 'gol-tikki-corner-sm')}>
        <GolTikki size={isPage ? 260 : 160} />
      </div>
      <div className={cn('gol-tikki-corner gol-tikki-corner-bl', isPage ? 'gol-tikki-corner-lg' : 'gol-tikki-corner-sm')}>
        <GolTikki size={isPage ? 260 : 160} />
      </div>
      <div className={cn('gol-tikki-corner gol-tikki-corner-br', isPage ? 'gol-tikki-corner-lg' : 'gol-tikki-corner-sm')}>
        <GolTikki size={isPage ? 260 : 160} />
      </div>

      {/* Finger-band strips — palm edge henna */}
      {isPage && (
        <>
          <div className="gol-tikki-finger-band gol-tikki-finger-left">
            <FingerBand />
          </div>
          <div className="gol-tikki-finger-band gol-tikki-finger-right">
            <FingerBand />
          </div>
        </>
      )}

      <div className="bridal-mehendi-glow bridal-mehendi-glow-a" />
      <div className="bridal-mehendi-glow bridal-mehendi-glow-b" />
    </div>
  )
}
