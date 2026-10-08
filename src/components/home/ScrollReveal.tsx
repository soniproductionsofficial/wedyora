import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

type RevealFrom = 'up' | 'left' | 'right' | 'scale'

/** Fade/slide in when scrolled into view; ease out when scrolled away; reappear on return. */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  threshold = 0.12,
  from = 'up',
}: {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  from?: RevealFrom
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(Boolean(entry?.isIntersecting))
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={cn(
        'cta-scroll',
        from === 'left' && 'cta-scroll-from-left',
        from === 'right' && 'cta-scroll-from-right',
        from === 'scale' && 'cta-scroll-from-scale',
        visible && 'cta-scroll-in',
        className,
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
