import { ArrowRight, Check, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  formatInr,
  getCategoryImage,
  type ShopPackage,
  type ShopService,
} from '../../data/shopPackages'
import { formatServiceFrom, getServiceBadge, serviceKpiMeta } from '../../data/serviceIcons'

type ServiceKpiCardProps = {
  service: ShopService
  active: boolean
  onSelect: () => void
}

export function ServiceKpiCard({ service, active, onSelect }: ServiceKpiCardProps) {
  const { icon: Icon, packageCount } = serviceKpiMeta(service)
  const image = getCategoryImage(service.id)
  const badge = getServiceBadge(service.id, service.name)

  return (
    <article
      id={service.id}
      className={cn(
        'scroll-mt-28 flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(142,20,84,0.08)] transition-all duration-300',
        active
          ? 'ring-2 ring-[#8e1454] ring-offset-2 ring-offset-white'
          : 'hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(142,20,84,0.14)]',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={image} alt={service.name} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 max-w-[85%] rounded-md bg-[#8e1454] px-2.5 py-1 text-[9px] font-bold leading-tight tracking-[0.08em] text-white sm:text-[10px]">
          {badge}
        </span>
        <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#8e1454]/25 bg-white text-[#8e1454] shadow-md">
          <Icon size={18} strokeWidth={2.25} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl text-[#3a2f32] sm:text-2xl">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#6b5c60]">{service.blurb}</p>
        <p className="mt-3 text-xs font-semibold text-[#8e1454]">
          {packageCount} packages · {formatServiceFrom(service)}
        </p>
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            'mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition',
            active
              ? 'bg-[#7a1048] text-white'
              : 'bg-[#8e1454] text-white hover:bg-[#7a1048]',
          )}
        >
          Explore packages
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  )
}

type PackageKpiCardProps = {
  pkg: ShopPackage
  service: ShopService
  thumb: string
  inCart: boolean
  onAdd: () => void
  onRemove: () => void
}

export function PackageKpiCard({ pkg, service, thumb, inCart, onAdd, onRemove }: PackageKpiCardProps) {
  const { icon: Icon } = serviceKpiMeta(service)
  const badge = getServiceBadge(service.id, service.name)

  return (
    <li
      id={pkg.id}
      className="scroll-mt-28 flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_rgba(142,20,84,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(142,20,84,0.12)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={thumb} alt={pkg.name} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 max-w-[85%] rounded-md bg-[#8e1454] px-2 py-0.5 text-[8px] font-bold tracking-[0.08em] text-white sm:text-[9px]">
          {badge}
        </span>
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#8e1454]/20 bg-white text-[#8e1454] shadow-sm">
          <Icon size={16} strokeWidth={2.25} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h4 className="font-display text-lg text-[#3a2f32]">{pkg.name}</h4>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-[#6b5c60] sm:text-sm">{pkg.description}</p>
        <p className="mt-3 text-sm font-semibold text-[#8e1454]">From {formatInr(pkg.price)}</p>
        {inCart ? (
          <button
            type="button"
            onClick={onRemove}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#8e1454]/30 bg-[#fff8f9] px-4 py-2.5 text-sm font-semibold text-[#8e1454] transition hover:border-[#8e1454]"
          >
            <Check size={16} />
            In cart · Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8e1454] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a1048]"
          >
            <Plus size={16} />
            Add to cart
          </button>
        )}
      </div>
    </li>
  )
}

export function ServicePackagesHeader({ service }: { service: ShopService }) {
  return (
    <div className="mb-6 border-b border-[#8e1454]/10 pb-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8e1454]">
        Selected service
      </p>
      <h3 className="mt-1 font-display text-2xl text-[#3a2f32] sm:text-3xl">{service.name}</h3>
      <p className="mt-2 max-w-2xl text-sm text-[#6b5c60]">{service.blurb}</p>
      <p className="mt-2 text-xs font-semibold text-[#8e1454]">
        {service.packages.length} packages · {formatServiceFrom(service)}
      </p>
    </div>
  )
}
