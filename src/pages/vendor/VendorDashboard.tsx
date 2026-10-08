import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Banknote,
  CalendarDays,
  Camera,
  ClipboardList,
  LogOut,
  MapPin,
  Star,
  TrendingUp,
} from 'lucide-react'
import { Button } from '../../components/Button'
import { clearVendorSession, getVendorSession } from '../../lib/vendorOtp'
import { categoryLabel, getApplication, rankLabel } from '../../lib/vendorOnboarding'
import { cn } from '../../lib/cn'

const sampleRequests = [
  { couple: 'Ananya & Rohan', city: 'Bengaluru', date: '12 Sep 2026', package: 'Wedding day', status: 'New' },
  { couple: 'Meera & Arjun', city: 'Chennai', date: '28 Sep 2026', package: 'Pre-wedding', status: 'Pending' },
  { couple: 'Diya & Kabir', city: 'Hyderabad', date: '04 Oct 2026', package: 'Reception', status: 'New' },
]

export function VendorDashboard() {
  const navigate = useNavigate()
  const session = getVendorSession()
  const [app, setApp] = useState<Awaited<ReturnType<typeof getApplication>>>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function guard() {
      const currentSession = getVendorSession()
      if (!currentSession) {
        navigate('/vendor/login', { replace: true })
        return
      }
      const current = await getApplication(currentSession.mobile)
      if (!current) {
        navigate('/vendor/register', { replace: true })
        return
      }
      if (current.stage !== 'active') {
        navigate('/vendor/status', { replace: true })
        return
      }
      if (!current.bankComplete) {
        navigate('/vendor/bank', { replace: true })
        return
      }
      setApp(current)
      setReady(true)
    }
    void guard()
  }, [navigate])

  if (!session || !ready || !app || app.stage !== 'active' || !app.bankComplete) return null

  const ranked = app.rank !== 'none'
  const area =
    [
      app.city,
      app.pincode || null,
      app.area || null,
      app.serviceRadiusKm ? `${app.serviceRadiusKm} km` : null,
    ]
      .filter(Boolean)
      .join(' · ')

  return (
    <div className="min-h-[calc(100dvh-4.75rem)] bg-[#fff8f9]">
      <section className="border-b border-[#8e1454]/10 bg-gradient-to-br from-[#8e1454] via-[#7a1048] to-[#5c0c36] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-5 py-10 lg:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">Vendor desk</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">{app.businessName}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/85">
              <span className="rounded-full bg-white/15 px-3 py-1 font-semibold uppercase tracking-wider">{app.vendorId}</span>
              <span>{rankLabel(app.rank)}</span>
              {app.qualityScore != null && <span>QC {app.qualityScore}/5</span>}
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#F6E04D]" />
                Live on Wedyora
              </span>
            </p>
          </div>
          <Button
            variant="line"
            className="rounded-md border-white text-white hover:bg-white hover:text-[#8e1454]"
            onClick={() => {
              clearVendorSession()
              navigate('/vendor/login')
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'New requests', value: '3', hint: 'Awaiting reply', icon: ClipboardList },
            { label: 'This month', value: '₹0', hint: 'Earnings', icon: Banknote },
            { label: 'Quality score', value: app.qualityScore != null ? `${app.qualityScore}` : '—', hint: 'Out of 5', icon: Star },
            { label: 'Partner tier', value: ranked ? app.rank : 'Pending', hint: ranked ? 'Admin ranked' : 'After live QC', icon: TrendingUp },
          ].map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-[#8e1454]/12 bg-white p-5 shadow-[0_10px_30px_rgba(142,20,84,0.05)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{stat.label}</p>
                  <p className="mt-2 font-display text-3xl capitalize text-[#8e1454]">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted">{stat.hint}</p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blush text-[#8e1454]">
                  <stat.icon className="h-5 w-5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border border-[#8e1454]/12 bg-white p-6 shadow-[0_10px_30px_rgba(142,20,84,0.05)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl text-[#3a2f32]">Booking requests</h2>
                <p className="mt-1 text-sm text-muted">Respond quickly to keep your partner rank rising.</p>
              </div>
              <span className="rounded-full bg-blush px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#8e1454]">
                Demo list
              </span>
            </div>
            <ul className="mt-6 divide-y divide-[#8e1454]/10">
              {sampleRequests.map((req) => (
                <li key={req.couple} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-medium text-[#3a2f32]">{req.couple}</p>
                    <p className="mt-1 text-sm text-muted">
                      {req.city} · {req.date} · {req.package}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
                        req.status === 'New' ? 'bg-[#8e1454] text-white' : 'bg-blush text-[#8e1454]',
                      )}
                    >
                      {req.status}
                    </span>
                    <Button type="button" className="rounded-md px-4 py-2 text-xs">
                      View
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-[#8e1454]/12 bg-white p-6 shadow-[0_10px_30px_rgba(142,20,84,0.05)]">
              <h2 className="font-display text-2xl text-[#3a2f32]">Studio profile</h2>
              <dl className="mt-4 space-y-3 text-sm text-[#3a2f32]">
                <div className="flex gap-2">
                  <Camera className="mt-0.5 h-4 w-4 shrink-0 text-[#8e1454]" />
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">Category</dt>
                    <dd className="mt-0.5 capitalize">{categoryLabel(app.category)}</dd>
                  </div>
                </div>
                <div className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8e1454]" />
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">Service area</dt>
                    <dd className="mt-0.5">{area || app.city}</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted">Contact</dt>
                  <dd className="mt-0.5">
                    {app.contactName}
                    <br />
                    {app.mobile} · {app.email}
                  </dd>
                </div>
                {(app.portfolioLink || app.portfolioVideo) && (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">Portfolio</dt>
                    <dd className="mt-1 space-y-1">
                      {app.portfolioLink && (
                        <a href={app.portfolioLink} target="_blank" rel="noreferrer" className="block break-all text-[#8e1454]">
                          Portfolio link
                        </a>
                      )}
                      {app.portfolioVideo && (
                        <a href={app.portfolioVideo} target="_blank" rel="noreferrer" className="block break-all text-[#8e1454]">
                          Portfolio video
                        </a>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="rounded-2xl border border-[#8e1454]/12 bg-white p-6 shadow-[0_10px_30px_rgba(142,20,84,0.05)]">
              <h2 className="font-display text-2xl text-[#3a2f32]">Quick actions</h2>
              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-xl border border-[#8e1454]/15 bg-blush px-4 py-3 text-left text-sm font-medium text-[#8e1454] transition hover:bg-[#8e1454] hover:text-white"
                >
                  <CalendarDays className="h-4 w-4" />
                  Availability calendar
                </button>
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-xl border border-[#8e1454]/15 px-4 py-3 text-left text-sm font-medium text-[#3a2f32] transition hover:border-[#8e1454] hover:text-[#8e1454]"
                >
                  <Banknote className="h-4 w-4 text-[#8e1454]" />
                  Payouts & invoices
                </button>
                <Link
                  to="/vendor/status"
                  className="flex items-center gap-3 rounded-xl border border-[#8e1454]/15 px-4 py-3 text-sm font-medium text-[#3a2f32] transition hover:border-[#8e1454] hover:text-[#8e1454]"
                >
                  <ClipboardList className="h-4 w-4 text-[#8e1454]" />
                  Onboarding timeline
                </Link>
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-8 rounded-2xl border border-[#8e1454]/12 bg-white p-6 shadow-[0_10px_30px_rgba(142,20,84,0.05)]">
          <h2 className="font-display text-2xl text-[#3a2f32]">Performance</h2>
          <p className="mt-1 text-sm text-muted">Metrics that feed Bronze → Silver → Gold → Platinum ranking.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'On-time arrival', value: '—' },
              { label: 'Completion rate', value: '—' },
              { label: 'Customer rating', value: app.qualityScore != null ? `${app.qualityScore}/5` : '—' },
              { label: 'Response time', value: '—' },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-[#fff8f9] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{m.label}</p>
                <p className="mt-2 font-display text-2xl text-[#8e1454]">{m.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
