import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { categories, cities, vendors } from '../data'
import { formatInr } from '../lib/cn'
import { SectionEyebrow } from '../components/Ornament'
import { EnquiryModal } from '../components/EnquiryModal'
import { Button } from '../components/Button'

export function Vendors() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? ''
  const city = params.get('city') ?? ''
  const q = (params.get('q') ?? '').toLowerCase()
  const style = (params.get('style') ?? '').toLowerCase()
  const [enquiry, setEnquiry] = useState(false)

  const list = useMemo(
    () =>
      vendors.filter((v) => {
        const catOk = !category || v.category === category
        const cityOk = !city || v.city === city || (city === 'Kerala' && v.city === 'Kochi')
        const qOk =
          !q ||
          v.name.toLowerCase().includes(q) ||
          v.tagline.toLowerCase().includes(q) ||
          v.about.toLowerCase().includes(q)
        const styleOk = !style || v.services.some((s) => s.toLowerCase().includes(style))
        return catOk && cityOk && qOk && styleOk
      }),
    [category, city, q, style],
  )

  const catName = categories.find((c) => c.slug === category)?.name ?? 'All vendors'

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <SectionEyebrow>Marketplace</SectionEyebrow>
      <h1 className="mt-3 font-display text-5xl">{catName}</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Browse verified Wedyora partners. Filter by city and craft — then send one enquiry to the concierge desk.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <select
          value={category}
          onChange={(e) => {
            const next = new URLSearchParams(params)
            if (e.target.value) next.set('category', e.target.value)
            else next.delete('category')
            setParams(next)
          }}
          className="rounded-full border border-gold/25 bg-ink-2 px-4 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={city}
          onChange={(e) => {
            const next = new URLSearchParams(params)
            if (e.target.value) next.set('city', e.target.value)
            else next.delete('city')
            setParams(next)
          }}
          className="rounded-full border border-gold/25 bg-ink-2 px-4 py-2 text-sm"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Button variant="magenta" className="py-2" onClick={() => setEnquiry(true)}>
          Send enquiry
        </Button>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v) => (
          <Link
            key={v.id}
            to={`/vendor/${v.id}`}
            className="overflow-hidden rounded-3xl border border-gold/20 bg-white transition hover:border-gold/50"
          >
            <div className="relative h-56">
              <img src={v.image} alt={v.name} className="h-full w-full object-cover" />
              {v.verified && (
                <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold">
                  Verified
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="flex items-center gap-1 text-xs text-gold">
                <Star size={12} fill="currentColor" /> {v.rating} · {v.reviews} reviews
              </p>
              <h2 className="mt-1 font-display text-2xl">{v.name}</h2>
              <p className="text-sm text-muted">
                {v.city} · {categories.find((c) => c.slug === v.category)?.name}
              </p>
              <p className="mt-3 text-sm">
                From <span className="text-gold">{formatInr(v.startingPrice)}</span> {v.priceUnit}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-16 text-center text-muted">
          No live partners for this filter yet. Send an enquiry — concierge will still shortlist.
        </p>
      )}
      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} defaultCategory={category} />
    </div>
  )
}
