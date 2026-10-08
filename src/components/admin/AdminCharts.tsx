import type { ReactNode } from 'react'
import { formatInr } from '../../lib/cn'
import type { RevenueTrendPoint, TrendPoint } from '../../lib/adminMetrics'

const PALETTE = ['#8e1454', '#D4AF37', '#5c0c36', '#c9a227', '#b84a7a', '#8b6914']

function ChartCard({
  title,
  plain,
  children,
  className,
}: {
  title: string
  plain?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-[#8e1454]/12 bg-white p-5 shadow-[0_8px_24px_rgba(142,20,84,0.04)] ${className ?? ''}`}
    >
      <h3 className="font-display text-xl text-[#3a2f32]">{title}</h3>
      {plain && <p className="mt-1 text-xs leading-relaxed text-muted">{plain}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

function niceMax(n: number) {
  if (n <= 0) return 100000
  const mag = Math.pow(10, Math.floor(Math.log10(n)))
  return Math.ceil(n / mag) * mag
}

function formatAxisInr(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${Math.round(n / 1000)}k`
  return `₹${n}`
}

/** Professional dual-line revenue chart: total sales + vendor revenue + commission legend */
export function RevenueTrendChart({
  title,
  plain,
  data,
}: {
  title: string
  plain: string
  data: RevenueTrendPoint[]
}) {
  const w = 640
  const h = 260
  const padL = 52
  const padR = 16
  const padT = 20
  const padB = 36
  const innerW = w - padL - padR
  const innerH = h - padT - padB

  const maxVal = niceMax(Math.max(...data.flatMap((d) => [d.totalSales, d.vendorRevenue, d.commission]), 1))
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: padT + innerH - t * innerH,
    val: Math.round(maxVal * t),
  }))

  const toPoint = (i: number, value: number) => {
    const x = padL + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
    const y = padT + innerH - (value / maxVal) * innerH
    return { x, y }
  }

  const salesPts = data.map((d, i) => toPoint(i, d.totalSales))
  const vendorPts = data.map((d, i) => toPoint(i, d.vendorRevenue))
  const commissionPts = data.map((d, i) => toPoint(i, d.commission))

  const line = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(' ')

  const latest = data[data.length - 1]

  return (
    <ChartCard title={title} plain={plain} className="lg:col-span-2">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-[#8e1454]/08 pb-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Total sales</p>
            <p className="font-display text-2xl text-[#8e1454]">{formatInr(latest?.totalSales ?? 0)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Vendor revenue</p>
            <p className="font-display text-2xl text-[#8b6914]">{formatInr(latest?.vendorRevenue ?? 0)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Wedyora commission</p>
            <p className="font-display text-2xl text-[#5c0c36]">{formatInr(latest?.commission ?? 0)}</p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-4 text-xs font-medium text-[#3a2f32]">
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-[#8e1454]" /> Total sales
          </li>
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-[#D4AF37]" /> Vendor revenue
          </li>
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-5 border-t-2 border-dashed border-[#5c0c36]" /> Commission
          </li>
        </ul>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="h-64 w-full" role="img" aria-label={title}>
        {yTicks.map((t) => (
          <g key={t.val}>
            <line x1={padL} x2={padL + innerW} y1={t.y} y2={t.y} stroke="#8e1454" strokeOpacity={0.08} />
            <text x={padL - 8} y={t.y + 4} textAnchor="end" fill="#9a7b3c" style={{ fontSize: 10 }}>
              {formatAxisInr(t.val)}
            </text>
          </g>
        ))}

        <polyline
          points={line(commissionPts)}
          fill="none"
          stroke="#5c0c36"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          strokeLinejoin="round"
          opacity={0.85}
        />
        <polyline points={line(vendorPts)} fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinejoin="round" />
        <polyline points={line(salesPts)} fill="none" stroke="#8e1454" strokeWidth="2.5" strokeLinejoin="round" />

        {salesPts.map((p, i) => (
          <g key={data[i].date}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#8e1454" stroke="white" strokeWidth="1.5" />
            <text x={p.x} y={h - 10} textAnchor="middle" fill="#9a7b3c" style={{ fontSize: 9 }}>
              {data[i].label}
            </text>
          </g>
        ))}
      </svg>
    </ChartCard>
  )
}

export function PieDonutChart({
  title,
  plain,
  data,
  centerLabel,
  centerValue,
  formatSlice,
}: {
  title: string
  plain: string
  data: TrendPoint[]
  centerLabel?: string
  centerValue?: string
  formatSlice?: (n: number) => string
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const size = 160
  const cx = size / 2
  const cy = size / 2
  const r = 58
  const stroke = 24
  const show = formatSlice ?? ((n: number) => String(n))

  let angle = -90
  const slices = data.map((d, i) => {
    const portion = d.value / total
    const sweep = portion * 360
    const start = angle
    angle += sweep
    return { ...d, color: PALETTE[i % PALETTE.length], start, sweep, pct: Math.round(portion * 100) }
  })

  function arcPath(startDeg: number, sweepDeg: number) {
    if (sweepDeg <= 0) return ''
    if (sweepDeg >= 359.9) {
      const x1 = cx + r
      return `M ${x1} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${x1} ${cy}`
    }
    const startRad = (startDeg * Math.PI) / 180
    const endRad = ((startDeg + sweepDeg) * Math.PI) / 180
    const x1 = cx + r * Math.cos(startRad)
    const y1 = cy + r * Math.sin(startRad)
    const x2 = cx + r * Math.cos(endRad)
    const y2 = cy + r * Math.sin(endRad)
    const large = sweepDeg > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  return (
    <ChartCard title={title} plain={plain}>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {data.every((d) => d.value === 0) ? (
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8dce0" strokeWidth={stroke} />
            ) : (
              slices.map((s) =>
                s.value > 0 ? (
                  <path
                    key={s.label}
                    d={arcPath(s.start, s.sweep)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={stroke}
                  />
                ) : null,
              )
            )}
            <circle cx={cx} cy={cy} r={r - stroke / 2 - 3} fill="white" />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="font-display text-lg text-[#8e1454]">{centerValue ?? String(total)}</p>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted">{centerLabel ?? 'Total'}</p>
          </div>
        </div>
        <ul className="w-full space-y-2 text-sm">
          {slices.map((s) => (
            <li key={s.label} className="flex justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                <span className="text-[#3a2f32]">{s.label}</span>
              </span>
              <span className="font-semibold">
                {show(s.value)} <span className="text-muted">({s.pct}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}

export function formatShortInr(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${Math.round(n / 1000)}k`
  return formatInr(n)
}
