import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

type Variant = 'gold' | 'magenta' | 'ghost' | 'line'

export function Button({
  variant = 'magenta',
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}) {
  const styles: Record<Variant, string> = {
    gold: 'bg-gold text-maroon hover:bg-gold-soft',
    magenta: 'bg-[#8e1454] text-white hover:bg-[#7a1048]',
    ghost: 'bg-blush text-[#3a2f32] hover:bg-[#f8eaea]',
    line: 'border border-[#8e1454] text-[#8e1454] hover:bg-[#8e1454] hover:text-white',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-[0.14em] uppercase transition duration-300 disabled:opacity-50',
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
