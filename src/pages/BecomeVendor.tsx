import { useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { SectionEyebrow } from '../components/Ornament'
import { categories, cities } from '../data'

export function BecomeVendor() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 lg:px-8">
      <SectionEyebrow>Partners</SectionEyebrow>
      <h1 className="mt-3 font-display text-5xl">Become a Wedyora vendor</h1>
      <p className="mt-4 text-muted">
        Photographers, venues, makeup, planners, reel-makers — apply for a verified profile. Leads stay inside the house. Your work is shown like an editorial, not a classified ad.
      </p>
      {sent ? (
        <p className="mt-10 font-display text-3xl text-gold">Application received. Partnerships will review your book.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 grid gap-3">
          <input required placeholder="Studio / brand name" className="rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold/40" />
          <input required placeholder="Contact name & mobile" className="rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold/40" />
          <select required defaultValue="" className="rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm">
            <option value="" disabled>
              Category
            </option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select required defaultValue="" className="rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm">
            <option value="" disabled>
              Primary city
            </option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input placeholder="Instagram or website" className="rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold/40" />
          <Button type="submit">Submit application</Button>
        </form>
      )}
    </div>
  )
}
