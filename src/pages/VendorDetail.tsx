import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Star } from 'lucide-react'
import { categories, vendors } from '../data'
import { formatInr } from '../lib/cn'
import { Button } from '../components/Button'
import { EnquiryModal } from '../components/EnquiryModal'

export function VendorDetail() {
  const { id } = useParams()
  const vendor = vendors.find((v) => v.id === id)
  const [enquiry, setEnquiry] = useState(false)
  const [hero, setHero] = useState(0)

  if (!vendor) {
    return (
      <div className="px-5 py-24 text-center">
        <p className="font-display text-4xl">Vendor not found</p>
        <Link to="/vendors" className="mt-4 inline-block text-gold">
          Back to marketplace
        </Link>
      </div>
    )
  }

  const cat = categories.find((c) => c.slug === vendor.category)?.name

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <p className="text-sm text-muted">
        <Link to="/vendors" className="hover:text-gold">
          Vendors
        </Link>{' '}
        / {cat}
      </p>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="overflow-hidden rounded-3xl border border-gold/15">
            <img src={vendor.gallery[hero] ?? vendor.image} alt="" className="h-[420px] w-full object-cover" />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {vendor.gallery.map((g, i) => (
              <button
                key={g}
                onClick={() => setHero(i)}
                className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border ${
                  hero === i ? 'border-gold' : 'border-transparent'
                }`}
              >
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <aside className="h-fit rounded-3xl border border-gold/20 bg-ink-2 p-7">
          {vendor.verified && (
            <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-gold">
              <BadgeCheck size={14} /> Verified partner
            </p>
          )}
          <h1 className="mt-3 font-display text-4xl">{vendor.name}</h1>
          <p className="mt-2 text-muted">
            {vendor.city} · {cat}
          </p>
          <p className="mt-3 flex items-center gap-2 text-gold">
            <Star size={16} fill="currentColor" /> {vendor.rating} · {vendor.reviews} reviews
          </p>
          <p className="mt-6 font-display text-3xl text-ivory">
            {formatInr(vendor.startingPrice)}{' '}
            <span className="text-base text-muted">{vendor.priceUnit}</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ivory/80">{vendor.tagline}</p>
          <Button variant="magenta" className="mt-6 w-full" onClick={() => setEnquiry(true)}>
            Send enquiry
          </Button>
          <Button variant="line" className="mt-3 w-full" onClick={() => setEnquiry(true)}>
            Request availability
          </Button>
        </aside>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl">About</h2>
          <p className="mt-4 leading-relaxed text-muted">{vendor.about}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {vendor.services.map((s) => (
              <span key={s} className="rounded-full border border-gold/25 px-3 py-1 text-xs text-gold">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl">Packages</h2>
          <div className="mt-4 space-y-3">
            {vendor.packages.map((p) => (
              <div key={p.name} className="rounded-2xl border border-white/10 bg-ink-3 p-5">
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-2xl">{p.name}</p>
                  <p className="text-gold">{formatInr(p.price)}</p>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {p.includes.map((i) => (
                    <li key={i}>· {i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} defaultCategory={vendor.category} />
    </div>
  )
}
