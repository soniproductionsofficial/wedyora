import { CalendarDays, TrendingUp, Wallet } from 'lucide-react'

const features = [
  {
    icon: CalendarDays,
    title: 'Manage Bookings',
    desc: 'View and manage your bookings',
  },
  {
    icon: Wallet,
    title: 'Track Earnings',
    desc: 'Monitor your earnings and payments',
  },
  {
    icon: TrendingUp,
    title: 'Grow Business',
    desc: 'Expand your reach and grow with us',
  },
] as const

export function PartnerPortalHero() {
  return (
    <div className="max-w-xl text-[#3a2f32]">
      <h1 className="partner-hero-title font-display text-4xl leading-tight text-[#8e1454] sm:text-5xl lg:text-[3.25rem]">
        Partner Portal
      </h1>
      <p className="partner-hero-subtitle mt-2 max-w-md text-base leading-relaxed text-[#3a2f32]/90 sm:mt-3 sm:text-lg">
        Manage your business, bookings, and grow with{' '}
        <span className="font-semibold text-[#8e1454]">Wedyora</span>.
      </p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-3 lg:mt-6">
        {features.map(({ icon: Icon, title, desc }, index) => (
          <li
            key={title}
            className={`partner-hero-card partner-hero-card--${index} rounded-xl border border-white/60 bg-white/75 p-3.5 shadow-[0_8px_24px_rgba(142,20,84,0.08)] backdrop-blur-sm sm:p-4`}
          >
            <div className="partner-hero-icon flex h-9 w-9 items-center justify-center rounded-lg bg-[#8e1454] text-white">
              <Icon size={18} strokeWidth={2.25} />
            </div>
            <p className="mt-2.5 text-sm font-semibold text-[#3a2f32] sm:mt-3">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#6b5c60]">{desc}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
