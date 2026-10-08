import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Camera,
  Heart,
  Star,
} from 'lucide-react'
import { AnimatedReveal, ServiceFlipCard } from '../components/home/ServiceFlipCard'
import { HeroHeadline } from '../components/home/HeroHeadline'
import { InteractiveStoryGallery } from '../components/home/InteractiveStoryGallery'
import { HomeCtaBand } from '../components/home/HomeCtaBand'
import { FloralBackdrop } from '../components/home/FloralBackdrop'
import { ScrollReveal } from '../components/home/ScrollReveal'
import { SectionEyebrow } from '../components/Ornament'
import { serviceBranches, heroImage } from '../data/serviceCatalog'
import { cn, formatInr } from '../lib/cn'
import { useCart } from '../context/CartContext'

const steps = [
  { n: '01', title: 'Sign in with OTP', desc: 'Quick mobile login. No passwords.' },
  { n: '02', title: 'Pick your services', desc: 'Photography, videography & wedding artisans.' },
  { n: '03', title: 'Pick packages & cart', desc: 'Add photography, catering, décor and more to your cart.' },
  { n: '04', title: 'Confirm booking', desc: 'Final summary. We assign your Wedyora partner.' },
]

export function Home() {
  const navigate = useNavigate()
  const { count } = useCart()
  const [activeBranch, setActiveBranch] = useState(serviceBranches[0]?.id ?? 'photo-video')

  const branch = serviceBranches.find((b) => b.id === activeBranch) ?? serviceBranches[0]
  const previewServices = branch?.services.slice(0, 6) ?? []

  function startBooking() {
    navigate('/services')
  }

  return (
    <div className="bg-paper text-[#3a2f32]">
      {/* Hero */}
      <section className="relative mt-[4.75rem] w-full overflow-hidden border-b-2 border-[#8e1454]/15 bg-[#140810]">
        <div className="relative h-[calc(100dvh-4.75rem)] min-h-[480px] w-full">
          <img
            src={heroImage}
            alt="Bride and groom celebrating at a palace wedding with sparklers"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Bottom scrim for text readability */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black/88 via-black/45 to-transparent" />

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-12">
            <HeroHeadline />

            <div className="mx-auto mt-6 max-w-md sm:max-w-lg">
              <div className="overflow-hidden rounded-xl bg-white shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={startBooking}
                    className="group flex items-center justify-center gap-2 bg-[#8e1454] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#7a1048]"
                  >
                    Explore the services
                    <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                  </button>
                  <Link
                    to="/vendor/join"
                    className="flex items-center justify-center border-t border-[#8e1454]/12 bg-white px-5 py-3.5 text-sm font-semibold text-[#8e1454] transition hover:bg-[#fff8f9] sm:border-t-0 sm:border-l"
                  >
                    Become a partner
                  </Link>
                </div>
              </div>
              {count > 0 ? (
                <p className="mt-3 text-center text-xs font-medium text-white/90">
                  <Link to="/cart" className="underline underline-offset-2 hover:text-[#F6E04D]">
                    View cart ({count})
                  </Link>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Service branches */}
      <FloralBackdrop className="px-5 py-24 lg:px-8">
        <div id="services" className="mx-auto max-w-7xl">
          <AnimatedReveal>
            <SectionEyebrow>Our services</SectionEyebrow>
            <h2 className="mt-4 max-w-2xl font-display text-4xl text-[#3a2f32] sm:text-5xl">
              Two worlds. Every detail covered.
            </h2>
          </AnimatedReveal>

          <div className="mt-10 flex flex-wrap gap-3">
            {serviceBranches.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveBranch(b.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-6 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase transition duration-300',
                  activeBranch === b.id
                    ? 'bg-[#8e1454] text-white shadow-[0_10px_30px_rgba(142,20,84,0.35)]'
                    : 'border border-[#8e1454]/20 text-[#8e1454] hover:border-[#8e1454]/50',
                )}
              >
                {b.id === 'photo-video' ? <Camera size={14} /> : <Heart size={14} />}
                {b.name}
              </button>
            ))}
          </div>

          <AnimatedReveal className="mt-8">
            <div className={cn('rounded-2xl bg-gradient-to-r p-[1px] shadow-lg', branch?.gradient)}>
              <div className="rounded-2xl bg-white px-6 py-5">
                <p className="text-sm text-muted">{branch?.description}</p>
                <p className="mt-2 text-xs text-[#8e1454]">
                  {branch?.services.length} services from{' '}
                  {formatInr(Math.min(...(branch?.services.map((s) => s.basePrice) ?? [0])))}
                </p>
              </div>
            </div>
          </AnimatedReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {previewServices.map((service, i) => (
              <ServiceFlipCard
                key={service.id}
                name={service.name}
                tagline={service.tagline}
                image={service.image}
                price={service.basePrice}
                delay={i * 70}
                  onSelect={() => navigate('/services')}
              />
            ))}
          </div>

          <AnimatedReveal className="mt-12 text-center">
            <button
              type="button"
              onClick={startBooking}
              className="inline-flex items-center gap-2 font-medium tracking-[0.14em] text-[#8e1454] uppercase"
            >
              View all {branch?.services.length} services <ArrowRight size={16} />
            </button>
          </AnimatedReveal>
        </div>
      </FloralBackdrop>

      {/* Interactive wedding → maternity gallery */}
      <InteractiveStoryGallery />

      {/* How it works */}
      <section className="bg-[#2d0f1c] px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#F6E04D] uppercase">How it works</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">From browse to booked in minutes</h2>
          </ScrollReveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <ScrollReveal key={step.n} delay={140 + i * 110}>
                <div className="how-step group h-full cursor-pointer rounded-2xl border border-[#8e1454]/30 bg-gradient-to-br from-[#8e1454]/20 to-transparent p-6 transition duration-400">
                  <p className="font-display text-3xl text-[#D4AF37]/60 transition duration-300 group-hover:text-[#F6E04D]">
                    {step.n}
                  </p>
                  <h3 className="mt-4 font-display text-xl text-white transition duration-300 group-hover:text-[#F6E04D]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70 transition duration-300 group-hover:text-white">
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust marquee */}
      <div className="overflow-hidden bg-[#8e1454] py-4">
        <div className="marquee-track gap-10 px-8 text-sm font-semibold tracking-[0.2em] text-white uppercase">
          {(branch?.services ?? []).concat(branch?.services ?? []).map((s, i) => (
            <span key={`${s.id}-${i}`} className="flex items-center gap-10">
              {s.name}
              <Star size={12} className="text-[#F6E04D]" fill="#F6E04D" />
            </span>
          ))}
        </div>
      </div>

      <HomeCtaBand onBook={startBooking} />
    </div>
  )
}
