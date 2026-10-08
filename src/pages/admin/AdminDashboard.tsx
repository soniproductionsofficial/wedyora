import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Banknote, IndianRupee, TrendingUp, Users } from 'lucide-react'
import { formatInr } from '../../lib/cn'
import { categoryLabel, listApplications, type VendorApplication } from '../../lib/vendorOnboarding'
import {
  DASHBOARD_CITIES,
  defaultDateRange,
  filterVendorsByCity,
  getRevenueTrend,
  getSalesSnapshot,
  getTopCategoryBars,
  type DashboardCity,
} from '../../lib/adminMetrics'
import { countOpenLeads, LEADS_CHANGED } from '../../lib/leads'
import { PieDonutChart, RevenueTrendChart, formatShortInr } from '../../components/admin/AdminCharts'
import { cn } from '../../lib/cn'

const field =
  'rounded-lg border border-[#d8c9ce] bg-white px-3 py-2 text-sm text-[#3a2f32] outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20'

export function AdminDashboard() {
  const defaults = defaultDateRange()
  const [city, setCity] = useState<DashboardCity>('All cities')
  const [fromDate, setFromDate] = useState(defaults.fromDate)
  const [toDate, setToDate] = useState(defaults.toDate)
  const [tick, setTick] = useState(0)
  const [openLeads, setOpenLeads] = useState(0)

  useEffect(() => {
    const refreshLeads = () => setOpenLeads(countOpenLeads())
    refreshLeads()
    window.addEventListener(LEADS_CHANGED, refreshLeads)
    return () => window.removeEventListener(LEADS_CHANGED, refreshLeads)
  }, [])
  const [allApps, setAllApps] = useState<VendorApplication[]>([])
  const [loading, setLoading] = useState(true)

  const filters = useMemo(() => ({ city, fromDate, toDate }), [city, fromDate, toDate])

  useEffect(() => {
    void listApplications()
      .then(setAllApps)
      .finally(() => setLoading(false))
  }, [tick])

  const apps = useMemo(() => filterVendorsByCity(allApps, city), [allApps, city])

  const active = apps.filter((a) => a.stage === 'active')
  const activeCount = active.length
  const pending = apps.filter((a) => a.stage !== 'active' && a.stage !== 'rejected')
  const rejected = apps.filter((a) => a.stage === 'rejected').length
  const liveReady = active.filter((a) => a.bankComplete).length

  const sales = useMemo(() => getSalesSnapshot(activeCount, filters), [activeCount, filters])
  const revenueTrend = useMemo(() => getRevenueTrend(activeCount, filters), [activeCount, filters])

  const byCategory = apps.reduce<Record<string, number>>((acc, a) => {
    const key = a.category || 'other'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

  const categoryBars = getTopCategoryBars(
    Object.fromEntries(Object.entries(byCategory).map(([k, v]) => [categoryLabel(k), v])),
  )

  function applyFilters() {
    if (fromDate > toDate) {
      setToDate(fromDate)
    }
    setTick((n) => n + 1)
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[#3a2f32]">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Sales, revenue & partners — filter by city and date</p>
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-muted">Loading partners from database…</p>}

      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-[#8e1454]/12 bg-white p-4 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Filters</p>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <label className="text-sm text-[#3a2f32]">
            City
            <select className={`${field} mt-1.5 min-w-[10rem]`} value={city} onChange={(e) => setCity(e.target.value as DashboardCity)}>
              {DASHBOARD_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-[#3a2f32]">
            From date
            <input
              type="date"
              className={`${field} mt-1.5`}
              value={fromDate}
              max={toDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>
          <label className="text-sm text-[#3a2f32]">
            To date
            <input
              type="date"
              className={`${field} mt-1.5`}
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={applyFilters}
            className="rounded-md bg-[#8e1454] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#7a1048]"
          >
            Apply
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">
          Showing {city === 'All cities' ? 'all cities' : city} · {fromDate} to {toDate}
        </p>
      </div>

      {/* Sales & revenue — main focus */}
      <div className="mt-8">
        <h2 className="font-display text-2xl text-[#3a2f32]">Sales & revenue</h2>
        <p className="mt-1 text-sm text-muted">
          Total sales from bookings. Vendor revenue is what partners earn. Wedyora commission is platform share (
          {sales.commissionPct}%).
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Total sales',
            value: formatInr(sales.totalSales),
            hint: `${sales.bookingsCount} bookings in period`,
            icon: TrendingUp,
            accent: 'magenta' as const,
          },
          {
            label: 'Vendor revenue',
            value: formatInr(sales.vendorRevenue),
            hint: 'Paid / payable to partners',
            icon: IndianRupee,
            accent: 'gold' as const,
          },
          {
            label: 'Wedyora commission',
            value: formatInr(sales.wedyoraCommission),
            hint: `${sales.commissionPct}% of total sales`,
            icon: Banknote,
            accent: 'magenta' as const,
          },
          {
            label: 'Avg booking value',
            value: sales.bookingsCount ? formatInr(Math.round(sales.totalSales / sales.bookingsCount)) : '—',
            hint: 'Per booking in period',
            icon: TrendingUp,
            accent: 'gold' as const,
          },
        ].map((k) => (
          <article
            key={k.label}
            className={cn(
              'rounded-2xl border p-5 shadow-[0_8px_24px_rgba(142,20,84,0.06)]',
              k.accent === 'gold'
                ? 'border-[#D4AF37]/35 bg-gradient-to-br from-[#fffdf5] to-white'
                : 'border-[#8e1454]/15 bg-gradient-to-br from-[#fff8f9] to-white',
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{k.label}</p>
              <k.icon className={cn('h-4 w-4', k.accent === 'gold' ? 'text-[#8b6914]' : 'text-[#8e1454]')} />
            </div>
            <p className={cn('mt-3 font-display text-3xl', k.accent === 'gold' ? 'text-[#8b6914]' : 'text-[#8e1454]')}>
              {k.value}
            </p>
            <p className="mt-1 text-xs text-muted">{k.hint}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <RevenueTrendChart
          title="Revenue trend"
          plain="Maroon = total sales · Gold = vendor earnings · Dashed = Wedyora commission. Use filters above to change city and dates."
          data={revenueTrend}
        />
        <PieDonutChart
          title="Revenue split"
          plain="How total sales is divided between vendors and Wedyora."
          centerLabel="Total sales"
          centerValue={formatShortInr(sales.totalSales)}
          formatSlice={formatShortInr}
          data={[
            { label: 'Vendor revenue', value: sales.vendorRevenue },
            { label: 'Wedyora commission', value: sales.wedyoraCommission },
          ]}
        />
      </div>

      {/* Vendors — secondary */}
      <div className="mt-10">
        <h2 className="font-display text-2xl text-[#3a2f32]">Vendors</h2>
        <p className="mt-1 text-sm text-muted">Partner count for selected city · same date filter applies to sales scale</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total vendors', value: apps.length, hint: city === 'All cities' ? 'All cities' : `In ${city}` },
          { label: 'Active', value: activeCount, hint: `${liveReady} live with bank` },
          { label: 'In verification', value: pending.length, hint: 'Needs admin action' },
          { label: 'Rejected', value: rejected, hint: 'Not approved' },
        ].map((k) => (
          <article key={k.label} className="rounded-xl border border-[#8e1454]/10 bg-white p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#8e1454]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{k.label}</p>
            </div>
            <p className="mt-2 font-display text-3xl text-[#3a2f32]">{k.value}</p>
            <p className="mt-1 text-xs text-muted">{k.hint}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Open leads', value: String(openLeads), to: '/admin/leads' },
          { label: 'Complaints', value: String(sales.complaintsOpen), to: '/admin/support' },
          { label: 'Payouts due', value: formatInr(sales.vendorRevenue), to: '/admin/payments' },
          { label: 'Verify queue', value: String(pending.length), to: '/admin/partners' },
        ].map((k) => (
          <Link
            key={k.label}
            to={k.to}
            className="rounded-xl border border-[#8e1454]/10 bg-white px-4 py-3 transition hover:border-[#8e1454]/30"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{k.label}</p>
            <p className="mt-1 font-display text-xl text-[#3a2f32]">{k.value}</p>
          </Link>
        ))}
      </div>

      {/* Partners by category + recent table */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#8e1454]/12 bg-white p-6">
          <h3 className="font-display text-lg text-[#3a2f32]">Partners by service ({city})</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {categoryBars.map((c) => (
              <li key={c.label} className="flex justify-between gap-2">
                <span className="text-muted">{c.label}</span>
                <span className="font-semibold text-[#3a2f32]">{c.value}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#8e1454]/12 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg text-[#3a2f32]">Recent partners</h3>
            <Link to="/admin/partners" className="text-xs font-semibold uppercase tracking-wider text-[#8e1454]">
              Open queue <ArrowRight className="inline h-3.5 w-3.5" />
            </Link>
          </div>
          {apps.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No vendors in this city yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#8e1454]/10 text-[11px] uppercase tracking-wider text-muted">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Business</th>
                    <th className="pb-2">City</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.slice(0, 6).map((app) => (
                    <tr key={app.vendorId} className="border-b border-[#8e1454]/05">
                      <td className="py-2 font-semibold text-[#8e1454]">{app.vendorId}</td>
                      <td className="py-2">{app.businessName}</td>
                      <td className="py-2 text-muted">{app.city}</td>
                      <td className="py-2 capitalize text-muted">{app.stage.replace(/_/g, ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
