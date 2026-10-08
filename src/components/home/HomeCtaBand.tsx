import { Link } from 'react-router-dom'
import { ScrollReveal } from './ScrollReveal'

export function HomeCtaBand({ onBook }: { onBook: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(165deg,#1a0a12_0%,#5c1838_38%,#8e1454_68%,#fff5f7_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(246,224,77,0.16),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_70%,rgba(255,255,255,0.12),transparent_45%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:py-20">
        <div className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div className="grid grid-cols-[1.35fr_0.85fr] gap-3 sm:gap-4">
            <ScrollReveal delay={0}>
              <div className="relative overflow-hidden rounded-2xl border border-[#F6E04D]/35 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <img
                  src="/gallery/wedding-14.jpg"
                  alt="Bridal portrait"
                  className="aspect-[3/4] h-full w-full object-cover object-[center_20%]"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15" />
              </div>
            </ScrollReveal>
            <div className="flex flex-col gap-3 sm:gap-4">
              <ScrollReveal delay={120} className="min-h-[140px] flex-1 sm:min-h-[180px]">
                <div className="relative h-full min-h-[140px] overflow-hidden rounded-2xl border border-white/25 shadow-[0_16px_40px_rgba(0,0,0,0.28)] sm:min-h-[180px]">
                  <img
                    src="/gallery/wedding-08.jpg"
                    alt="Couple"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={240} className="min-h-[140px] flex-1 sm:min-h-[180px]">
                <div className="relative h-full min-h-[140px] overflow-hidden rounded-2xl border border-[#F6E04D]/25 shadow-[0_16px_40px_rgba(0,0,0,0.28)] sm:min-h-[180px]">
                  <img
                    src="/gallery/maternity-01.jpg"
                    alt="Maternity"
                    className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
              </ScrollReveal>
            </div>
          </div>
          <ScrollReveal delay={360}>
            <p className="mt-4 text-center text-[10px] font-semibold tracking-[0.2em] text-white/55 uppercase lg:text-left">
              Weddings, Maternity, Family
            </p>
          </ScrollReveal>
        </div>

        <div className="text-center lg:text-left">
          <ScrollReveal delay={80}>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#F6E04D] uppercase">Book with Wedyora</p>
          </ScrollReveal>
          <ScrollReveal delay={180}>
            <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-[3.25rem]">
              Ready to plan your celebration?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={280}>
            <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-[#F6E04D] via-[#F6E04D] to-transparent lg:mx-0" />
          </ScrollReveal>
          <ScrollReveal delay={360}>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 lg:max-w-lg">
              Sign in with your mobile, pick services, set photo & candid counts, and confirm your booking. Curated
              partners, clear pricing, one elegant cart.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={460}>
            <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
              <button
                type="button"
                onClick={onBook}
                className="rounded-full bg-[#F6E04D] px-8 py-3.5 text-sm font-semibold tracking-[0.14em] text-[#2d0f1c] uppercase shadow-[0_12px_32px_rgba(246,224,77,0.35)] transition hover:-translate-y-0.5 hover:bg-[#ffe566]"
              >
                Start booking
              </button>
              <Link
                to="/contact"
                className="rounded-full border border-white/55 bg-white/10 px-8 py-3.5 text-sm font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-sm transition hover:bg-white/20"
              >
                Talk to concierge
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
