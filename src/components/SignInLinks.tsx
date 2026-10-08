import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { cn } from '../lib/cn'
import { useCart } from '../context/CartContext'
import { getCustomerSession } from '../lib/customerOtp'

const roles = [
  { to: '/login', label: 'Customer' },
  { to: '/admin/login', label: 'Admin' },
] as const

export function SignInLinks({ stacked = false }: { stacked?: boolean }) {
  const { count } = useCart()
  const session = getCustomerSession()

  return (
    <div
      className={cn(
        stacked ? 'flex flex-col gap-2' : 'flex items-center gap-1 rounded-md border border-[#8e1454]/20 bg-blush p-1',
      )}
    >
      {session ? (
        <Link
          to="/services"
          className={cn(
            'text-center text-[11px] font-semibold uppercase tracking-[0.12em] transition',
            stacked
              ? 'rounded-md bg-[#8e1454] px-4 py-2.5 text-white hover:bg-[#7a1048]'
              : 'rounded px-3 py-2 text-[#8e1454] hover:bg-[#8e1454] hover:text-white',
          )}
        >
          My booking
        </Link>
      ) : (
        roles.slice(0, 1).map((r) => (
          <Link
            key={r.to}
            to={r.to}
            className={cn(
              'text-center text-[11px] font-semibold uppercase tracking-[0.12em] transition',
              stacked
                ? 'rounded-md bg-[#8e1454] px-4 py-2.5 text-white hover:bg-[#7a1048]'
                : 'rounded px-3 py-2 text-[#8e1454] hover:bg-[#8e1454] hover:text-white',
            )}
          >
            {r.label}
          </Link>
        ))
      )}
      <Link
        to="/cart"
        className={cn(
          'relative text-center text-[11px] font-semibold uppercase tracking-[0.12em] transition',
          stacked
            ? 'inline-flex items-center justify-center gap-1.5 rounded-md border border-[#8e1454]/30 px-4 py-2.5 text-[#8e1454]'
            : 'inline-flex items-center gap-1 rounded px-3 py-2 text-[#8e1454] hover:bg-[#8e1454] hover:text-white',
        )}
      >
        <ShoppingBag size={13} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8e1454] px-1 text-[9px] text-white">
            {count}
          </span>
        )}
      </Link>
      {!stacked &&
        roles.slice(1).map((r) => (
          <Link
            key={r.to}
            to={r.to}
            className="rounded px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8e1454] transition hover:bg-[#8e1454] hover:text-white"
          >
            {r.label}
          </Link>
        ))}
      {stacked &&
        roles.slice(1).map((r) => (
          <Link
            key={r.to}
            to={r.to}
            className="rounded-md border border-[#8e1454]/30 px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8e1454]"
          >
            {r.label}
          </Link>
        ))}
    </div>
  )
}