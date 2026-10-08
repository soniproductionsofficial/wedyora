import { useState } from 'react'
import { MapPin, Star } from 'lucide-react'
import { venues } from '../data'
import { formatInr } from '../lib/cn'
import { Button } from '../components/Button'
import { EnquiryModal } from '../components/EnquiryModal'
import { SectionEyebrow } from '../components/Ornament'

export function Venues() {
  const [enquiry, setEnquiry] = useState(false)

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <SectionEyebrow>Estates & halls</SectionEyebrow>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Venues with a point of view</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Palaces, lawns, five-stars and destination resorts — shortlisted for light, capacity, and how they hold black-and-gold production.
      </p>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {venues.map((v) => (
          <article key={v.id} className="overflow-hidden rounded-3xl border border-gold/20 bg-white">
            <img src={v.image} alt={v.name} className="h-64 w-full object-cover" />
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">{v.type}</p>
              <h2 className="mt-1 font-display text-3xl">{v.name}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                <MapPin size={14} /> {v.city} · {v.capacity} guests
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm">
                  <Star size={14} className="mr-1 inline text-gold" fill="currentColor" />
                  {v.rating} · from {formatInr(v.plateFrom)} / plate
                </p>
                <Button className="py-2" variant="magenta" onClick={() => setEnquiry(true)}>
                  Check dates
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} defaultCategory="venues" />
    </div>
  )
}
