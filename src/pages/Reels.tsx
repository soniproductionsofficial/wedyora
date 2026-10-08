import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { reelPackages } from '../data'
import { cn, formatInr } from '../lib/cn'
import { Button } from '../components/Button'
import { Ornament, SectionEyebrow } from '../components/Ornament'

export function Reels() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-gold/10">
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/75 to-ink" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <Ornament className="justify-start" />
          <SectionEyebrow>On-demand creators</SectionEyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight sm:text-7xl">
            Reels delivered while the <span className="italic gold-text">dance floor</span> is still live.
          </h1>
          <p className="mt-5 max-w-xl text-ivory/75">
            Book a trained Wedyora reel-maker. They shoot, cut, and export — often in ten minutes. Transparent packages from {formatInr(1999)}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionEyebrow>Packages</SectionEyebrow>
        <h2 className="mt-3 font-display text-4xl">Pick a plan. Get the reel tonight.</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {reelPackages.map((p) => (
            <article
              key={p.id}
              className={cn(
                'rounded-3xl border p-7',
                p.popular ? 'border-magenta bg-ink-2 magenta-glow' : 'border-gold/20 bg-ink-3',
              )}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-gold">{p.tag}</p>
              <h3 className="mt-2 font-display text-3xl">{p.name}</h3>
              <p className="mt-4 font-display text-4xl text-gold">
                {formatInr(p.price)}
                <span className="text-base text-muted"> + GST</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {p.hours} · {p.reels}
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2 text-ivory/85">
                    <Check size={16} className="mt-0.5 text-magenta" /> {i}
                  </li>
                ))}
              </ul>
              <a href="#book">
                <Button variant={p.popular ? 'magenta' : 'gold'} className="mt-8 w-full">
                  Check out
                </Button>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="book" className="border-t border-gold/10 bg-ink-2 px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
          <div>
            <SectionEyebrow>Lock the slot</SectionEyebrow>
            <h2 className="mt-3 font-display text-4xl">Share the date. We’ll confirm a creator.</h2>
            <p className="mt-4 text-sm text-muted">24-hour response. Live tracking from arrival to export.</p>
          </div>
          {sent ? (
            <div className="rounded-3xl border border-gold/20 p-8">
              <p className="font-display text-3xl text-gold">Enquiry sent</p>
              <p className="mt-3 text-muted">A Wedyora reels desk will confirm your slot shortly.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-3">
              <input required placeholder="Full name" className="rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold/40" />
              <input required placeholder="Mobile" className="rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold/40" />
              <input required placeholder="City / venue" className="rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gold/40" />
              <select required defaultValue="" className="rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm outline-none">
                <option value="" disabled>
                  Package
                </option>
                {reelPackages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {formatInr(p.price)}
                  </option>
                ))}
              </select>
              <input type="date" required className="rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm outline-none" />
              <Button type="submit" variant="magenta">
                Submit enquiry
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
