import { cn } from '../lib/cn'
import logo from '../assets/wedyora-logo.jpg'
import logoRect from '../assets/wedyora-logo-rect.png'

type LogoProps = {
  className?: string
  /** Admin sidebar — horizontal rectangle logo on maroon */
  variant?: 'default' | 'onDark' | 'circle'
}

export function Logo({ className, variant = 'default' }: LogoProps) {
  if (variant === 'circle') {
    return (
      <span
        className={cn(
          'inline-flex h-20 w-20 shrink-0 overflow-hidden rounded-full border-[3px] border-[#F6E04D] bg-[#8e1454] shadow-[0_12px_32px_rgba(142,20,84,0.28)] sm:h-24 sm:w-24',
          className,
        )}
      >
        <img
          src={logo}
          alt="Wedyora"
          className="h-full w-full object-cover object-center"
        />
      </span>
    )
  }

  if (variant === 'onDark') {
    return (
      <img
        src={logoRect}
        alt="Wedyora"
        className={cn(
          'h-auto w-full rounded-md object-contain shadow-[0_4px_14px_rgba(0,0,0,0.2)]',
          className,
        )}
      />
    )
  }

  return (
    <img
      src={logo}
      alt="Wedyora"
      className={cn(
        'h-11 w-48 rounded-lg object-cover object-center sm:h-12 sm:w-56',
        className,
      )}
    />
  )
}
