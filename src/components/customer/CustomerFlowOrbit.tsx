import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Camera, CheckCircle2, ShoppingCart, Smartphone, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

type Phase = {
  id: string
  title: string
  desc: string
  icon: LucideIcon
}

const phases: Phase[] = [
  {
    id: 'sign-in',
    title: 'Sign in with OTP',
    desc: 'Mobile number and OTP. No passwords.',
    icon: Smartphone,
  },
  {
    id: 'pick-services',
    title: 'Pick your services',
    desc: 'Photography, videography & wedding artisans.',
    icon: Camera,
  },
  {
    id: 'configure-cart',
    title: 'Configure & cart',
    desc: 'Photo counts, hours, and package options.',
    icon: ShoppingCart,
  },
  {
    id: 'confirm',
    title: 'Confirm booking',
    desc: 'Review your summary. We assign your partner.',
    icon: CheckCircle2,
  },
]

const ORBIT_RADIUS = 36

function nodeStyle(index: number, total: number): CSSProperties {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2
  return {
    left: `${50 + ORBIT_RADIUS * Math.cos(angle)}%`,
    top: `${50 + ORBIT_RADIUS * Math.sin(angle)}%`,
    transform: 'translate(-50%, -50%)',
  }
}

export function CustomerFlowOrbit({ className }: { className?: string }) {
  const [active, setActive] = useState(0)
  const current = phases[active]!
  const Icon = current.icon
  const positions = useMemo(() => phases.map((_, i) => nodeStyle(i, phases.length)), [])

  useEffect(() => {
    const id = window.setInterval(() => setActive((i) => (i + 1) % phases.length), 4200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className={cn('mx-auto w-full', className)}>
      <div className="relative mx-auto aspect-square w-full max-w-[390px] sm:max-w-[420px]">
        <svg className="pointer-events-none absolute inset-[10%] h-[80%] w-[80%]" viewBox="0 0 200 200" aria-hidden>
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="#8e1454"
            strokeOpacity="0.2"
            strokeWidth="1.5"
            strokeDasharray="5 7"
          />
        </svg>

        <span
          className="pointer-events-none absolute z-10 h-2.5 w-2.5 rounded-full bg-[#F6E04D] shadow-[0_0_10px_rgba(246,224,77,0.8)] transition-all duration-700 ease-out"
          style={positions[active]}
        />

        {phases.map((phase, i) => {
          const NodeIcon = phase.icon
          const isActive = i === active
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={phase.title}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'absolute z-20 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-500 sm:h-[3.25rem] sm:w-[3.25rem]',
                isActive
                  ? 'scale-105 border-[#8e1454]/20 bg-gradient-to-br from-[#8e1454] to-[#6d0f40] text-[#F6E04D] shadow-[0_10px_28px_rgba(142,20,84,0.35)]'
                  : 'border-[#8e1454]/12 bg-white text-[#8e1454] shadow-[0_6px_18px_rgba(142,20,84,0.08)] hover:border-[#D4AF37]/45',
              )}
              style={positions[i]}
            >
              <NodeIcon size={20} strokeWidth={isActive ? 2.25 : 2} />
            </button>
          )
        })}

        <div className="absolute left-1/2 top-1/2 z-30 flex h-[10.5rem] w-[10.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#8e1454]/10 bg-white px-5 py-4 text-center shadow-[0_16px_40px_rgba(142,20,84,0.12)] sm:h-[11.25rem] sm:w-[11.25rem] sm:px-6">
          <div key={current.id} className="flow-orbit-center animate-in">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#fff8f9] text-[#8e1454]">
              <Icon size={18} />
            </span>
            <p className="mt-2 font-display text-base leading-snug text-[#8e1454]">{current.title}</p>
            <p className="mt-2 px-1 text-[13px] leading-relaxed text-[#3a2f32]/75">{current.desc}</p>
            <div className="mt-2.5 flex justify-center gap-1.5">
              {phases.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1 rounded-full transition-all duration-500',
                    i === active ? 'w-4 bg-[#8e1454]' : 'w-1 bg-[#8e1454]/20',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
