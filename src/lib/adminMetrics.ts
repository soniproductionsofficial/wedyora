/**
 * Admin dashboard metrics — demo data until bookings API is live.
 * Respects city + date filters for sales, revenue (vendor + commission), and vendors.
 */

const SALES_KEY = 'wedyora-admin-sales'
const COMMISSION_PCT = 18

export const DASHBOARD_CITIES = ['All cities', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pondicherry'] as const

export type DashboardCity = (typeof DASHBOARD_CITIES)[number]

export type DashboardFilters = {
  city: DashboardCity
  fromDate: string
  toDate: string
}

export type SalesSnapshot = {
  totalSales: number
  vendorRevenue: number
  wedyoraCommission: number
  bookingsCount: number
  commissionPct: number
  complaintsOpen: number
  openLeads: number
}

export type RevenueTrendPoint = {
  label: string
  date: string
  totalSales: number
  vendorRevenue: number
  commission: number
}

export type TrendPoint = { label: string; value: number }

type StoredSales = {
  baseSales: number
  baseBookings: number
  complaintsOpen: number
  openLeads: number
}

/** Demo share of total GMV per city. */
const CITY_FACTOR: Record<DashboardCity, number> = {
  'All cities': 1,
  Bengaluru: 0.36,
  Hyderabad: 0.28,
  Chennai: 0.24,
  Pondicherry: 0.12,
}

function readStored(): StoredSales {
  try {
    const raw = JSON.parse(localStorage.getItem(SALES_KEY) ?? 'null') as StoredSales | null
    if (raw && typeof raw.baseSales === 'number') return raw
  } catch {
    /* ignore */
  }
  const seed: StoredSales = {
    baseSales: 485000,
    baseBookings: 12,
    complaintsOpen: 2,
    openLeads: 7,
  }
  localStorage.setItem(SALES_KEY, JSON.stringify(seed))
  return seed
}

function parseDate(s: string) {
  const d = new Date(s + 'T12:00:00')
  return Number.isNaN(d.getTime()) ? new Date() : d
}

function daysBetween(from: string, to: string) {
  const a = parseDate(from)
  const b = parseDate(to)
  const diff = Math.round((b.getTime() - a.getTime()) / 86400000)
  return Math.max(0, diff)
}

function formatAxisDate(d: Date) {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function cityFactor(city: DashboardCity) {
  return CITY_FACTOR[city] ?? 1
}

/** Scale demo totals by city, active vendors, and date-range length. */
export function getSalesSnapshot(
  activeVendors: number,
  filters: DashboardFilters,
): SalesSnapshot {
  const stored = readStored()
  const cf = cityFactor(filters.city)
  const rangeDays = Math.max(1, daysBetween(filters.fromDate, filters.toDate) + 1)
  const rangeScale = Math.min(1.4, 0.35 + rangeDays / 90)
  const vendorBoost = Math.max(0, activeVendors) * 18000 * cf

  const totalSales = Math.round((stored.baseSales * cf * rangeScale) + vendorBoost)
  const wedyoraCommission = Math.round(totalSales * (COMMISSION_PCT / 100))
  const vendorRevenue = totalSales - wedyoraCommission
  const bookingsCount = Math.max(1, Math.round((stored.baseBookings + activeVendors) * cf * rangeScale))

  return {
    totalSales,
    vendorRevenue,
    wedyoraCommission,
    bookingsCount,
    commissionPct: COMMISSION_PCT,
    complaintsOpen: Math.max(0, Math.round(stored.complaintsOpen * cf)),
    openLeads: Math.max(0, Math.round(stored.openLeads * cf)),
  }
}

/** Daily or weekly revenue trend between from / to dates. */
export function getRevenueTrend(
  activeVendors: number,
  filters: DashboardFilters,
): RevenueTrendPoint[] {
  const from = parseDate(filters.fromDate)
  const to = parseDate(filters.toDate)
  const span = daysBetween(filters.fromDate, filters.toDate)
  const stepDays = span > 21 ? 7 : span > 7 ? 3 : 1
  const cf = cityFactor(filters.city)
  const boost = Math.max(0, activeVendors) * 1200 * cf

  const points: RevenueTrendPoint[] = []
  let i = 0
  for (let t = from.getTime(); t <= to.getTime(); t += stepDays * 86400000) {
    const d = new Date(t)
    const wave = 1 + Math.sin(i * 0.55) * 0.12 + (i % 4) * 0.03
    const baseDaily = (42000 * cf * wave) / (stepDays === 7 ? 2.2 : stepDays === 3 ? 1.4 : 1)
    const totalSales = Math.round(baseDaily + boost + i * 800 * cf)
    const commission = Math.round(totalSales * (COMMISSION_PCT / 100))
    const vendorRevenue = totalSales - commission
    points.push({
      label: formatAxisDate(d),
      date: d.toISOString().slice(0, 10),
      totalSales,
      vendorRevenue,
      commission,
    })
    i += 1
    if (points.length >= 12) break
  }
  if (points.length === 0) {
    const snap = getSalesSnapshot(activeVendors, filters)
    points.push({
      label: formatAxisDate(from),
      date: filters.fromDate,
      totalSales: snap.totalSales,
      vendorRevenue: snap.vendorRevenue,
      commission: snap.wedyoraCommission,
    })
  }
  return points
}

export function getTopCategoryBars(byCategory: Record<string, number>): TrendPoint[] {
  const entries = Object.entries(byCategory)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
  if (entries.length) return entries
  return [
    { label: 'Photographers', value: 0 },
    { label: 'Videography', value: 0 },
    { label: 'Makeup', value: 0 },
  ]
}

export function defaultDateRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - 30)
  return {
    fromDate: from.toISOString().slice(0, 10),
    toDate: to.toISOString().slice(0, 10),
  }
}

export function filterVendorsByCity<T extends { city: string }>(apps: T[], city: DashboardCity): T[] {
  if (city === 'All cities') return apps
  return apps.filter((a) => a.city === city || (city === 'Bengaluru' && a.city === 'Bangalore'))
}
