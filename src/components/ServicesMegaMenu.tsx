import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { navServiceGroups, navServicesSummary } from '../data/navServicesMenu'
import { cn } from '../lib/cn'

type ServicesMegaMenuProps = {
  onNavigate?: () => void
  className?: string
}

export function ServicesMegaMenu({ onNavigate, className }: ServicesMegaMenuProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-[#8e1454]/12 bg-white shadow-[0_20px_50px_rgba(142,20,84,0.12)]',
        className,
      )}
    >
      <div className="grid gap-0 sm:grid-cols-3">
        {navServiceGroups.map((group) => {
          const Icon = group.icon
          return (
            <div
              key={group.id}
              className="border-b border-[#8e1454]/8 px-6 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <div className="mb-3 flex items-center gap-2">
                <Icon size={15} className="text-[#8e1454]" strokeWidth={2.25} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8e1454]">
                  {group.label}
                </p>
              </div>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className="block text-sm text-[#3a2f32] transition hover:text-[#8e1454]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#8e1454]/10 bg-[#faf7f8] px-6 py-3.5">
        <p className="text-xs text-[#6b5c60]">{navServicesSummary}</p>
        <Link
          to="/services"
          onClick={onNavigate}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8e1454] transition hover:text-[#6b103f]"
        >
          View All Services
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
