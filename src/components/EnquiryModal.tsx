import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { categories, cities } from '../data'

export function EnquiryModal({
  open,
  onClose,
  defaultCategory,
}: {
  open: boolean
  onClose: () => void
  defaultCategory?: string
}) {
  const [sent, setSent] = useState(false)

  if (!open) return null

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  const field =
    'rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm text-gold outline-none focus:ring-2 focus:ring-gold/40'

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-label="Close overlay" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gold/25 bg-white p-6 shadow-[0_40px_80px_rgba(72,30,39,0.18)] sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted hover:bg-blush hover:text-gold"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        {sent ? (
          <div className="py-8 text-center">
            <p className="font-display text-3xl text-gold">Request received</p>
            <p className="mt-3 text-sm text-muted">
              A Wedyora concierge will call you within the hour with shortlisted vendors.
            </p>
            <Button className="mt-8" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Concierge desk</p>
            <h2 className="mt-2 font-display text-3xl text-gold">Tell us the brief</h2>
            <p className="mt-2 text-sm text-muted">
              City, category, date. We match verified vendors — you stay in one thread.
            </p>
            <form onSubmit={onSubmit} className="mt-6 grid gap-3">
              <input required placeholder="Mobile number" className={field} />
              <div className="grid gap-3 sm:grid-cols-2">
                <select required defaultValue="" className={field}>
                  <option value="" disabled>
                    Wedding city
                  </option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select required defaultValue={defaultCategory ?? ''} className={field}>
                  <option value="" disabled>
                    Vendor category
                  </option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <input type="date" className={field} />
              <Button type="submit" className="mt-2 w-full">
                Request shortlist
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
