import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { FloralCorner } from './FloralCorner'

type FloralBackdropProps = {
  children?: ReactNode
  className?: string
}

/** White panel with soft pink floral corners — decorative only. */
export function FloralBackdrop({ children, className }: FloralBackdropProps) {
  return (
    <div className={cn('relative overflow-hidden bg-white', className)}>
      <FloralCorner className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 sm:h-36 sm:w-36" />
      <FloralCorner className="pointer-events-none absolute right-0 top-0 h-28 w-28 sm:h-36 sm:w-36" flip="xy" />
      {children ? <div className="relative">{children}</div> : null}
    </div>
  )
}
