import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { stats } from '../data'
import { ScrollReveal } from '../components/home/ScrollReveal'

const pillars = [
  {
    title: 'Verified partners',
    body: 'Chosen for craft and care. Portfolio, presence, and pricing reviewed before a name ever reaches you.',
  },
  {
    title: 'Transparent packages',
    body: 'You see what you are booking: the hours, the frames, the feeling. No fog at the finish line.',
  },
  {
    title: 'Concierge shortlist',
    body: 'Share your city, date, and mood. We place the right hands behind the camera, not a scroll of strangers.',
  },
]

const film = [
  '/gallery/wedding-01.jpg',
  '/gallery/wedding-08.jpg',
  '/gallery/wedding-11.jpg',
  '/gallery/wedding-15.jpg',
]

export function About() {
  return (
    <div className="bg-white text-[#3a2f32]">
      <section className="grid min-h-[calc(100dvh-4.75rem)] lg:grid-cols-2">
        <div className="relative order-2 min-h-[50vh] overflow-hidden lg:order-1 lg:min-h-0">
          <ScrollReveal from="scale" delay={0} className="absolute inset-0 h-full w-full" threshold={0.05}>
            <div className="relative h-full min-h-[50vh] w-full lg:min-h-full">
              <img
                src="/gallery/wedding-14.jpg"
                alt="Bridal portrait"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a12]/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#1a0a12]/20" />
            </div>
          </ScrollReveal>
          <ScrollReveal from="up" delay={280} className="absolute bottom-8 left-8 z-10" threshold={0.05}>
            <p className="font-display text-3xl text-white/90 italic sm:text-4xl">
              “Quiet luxury.
              <br />
              Loud hearts.”
            </p>
          </ScrollReveal>
        </div>

        <div className="order-1 flex flex-col justify-center bg-[#1a0a12] px-8 py-16 text-white lg:order-2 lg:px-14 lg:py-20">
          <ScrollReveal from="right" delay={60} threshold={0.05}>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-[#F6E04D] uppercase">Our story</p>
          </ScrollReveal>
          <ScrollReveal from="right" delay={140} threshold={0.05}>
            <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl lg:text-[3.25rem]">
              A wedding house built for how India celebrates.
            </h1>
          </ScrollReveal>
          <ScrollReveal from="right" delay={220} threshold={0.05}>
            <div className="mt-8 h-px w-16 bg-[#F6E04D]" />
          </ScrollReveal>
          <ScrollReveal from="right" delay={300} threshold={0.05}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-white/75">
              Wedyora is where the right artists find you. Photographers who catch the glance before the pheras.
              Filmmakers who stay for the quiet after. Artisans who understand that a wedding is not a checklist,
              it is a season of light.
            </p>
          </ScrollReveal>
          <ScrollReveal from="right" delay={380} threshold={0.05}>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
              We carry the eye of Soni Productions: bridal red against gold embroidery, then the softer frames that
              follow. Maternity glow. Newborn hush. Family, still close enough to hold.
            </p>
          </ScrollReveal>
          <ScrollReveal from="right" delay={460} threshold={0.05}>
            <Link
              to="/services"
              className="mt-10 inline-flex w-fit items-center gap-2 border-b border-[#F6E04D] pb-1 text-sm font-semibold tracking-[0.14em] text-[#F6E04D] uppercase transition hover:gap-3"
            >
              Start booking <ArrowUpRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-y border-[#8e1454]/12 bg-[#fff8f9] px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3 md:gap-0">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.title} from="up" delay={i * 140}>
              <div
                className={`about-pillar group cursor-pointer rounded-xl p-4 transition duration-400 md:rounded-none md:p-0 md:px-8 ${
                  i > 0 ? 'md:border-l md:border-[#8e1454]/15' : ''
                }`}
              >
                <p className="font-display text-5xl text-[#8e1454]/25 transition duration-300 group-hover:text-[#8e1454]">
                  0{i + 1}
                </p>
                <h2 className="mt-2 font-display text-2xl transition duration-300 group-hover:text-[#8e1454]">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#3a2f32]/70 transition duration-300 group-hover:text-[#3a2f32]">
                  {p.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-[#1a0a12] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal from="up" delay={40}>
            <p className="mb-6 text-[11px] font-semibold tracking-[0.22em] text-[#F6E04D] uppercase">On film</p>
          </ScrollReveal>
          <div className="flex gap-3 overflow-x-auto pb-4 [scrollbar-width:thin]">
            {film.map((src, i) => (
              <ScrollReveal key={src} from="scale" delay={80 + i * 120} className="shrink-0">
                <img
                  src={src}
                  alt=""
                  className="about-film h-52 w-40 object-cover object-center transition duration-500 sm:h-64 sm:w-52"
                />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 sm:grid-cols-4">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} from="up" delay={100 + i * 100}>
                <div className="about-stat group cursor-default">
                  <p className="font-display text-3xl text-[#F6E04D] transition duration-300 group-hover:scale-105 group-hover:text-[#ffe566] sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[10px] tracking-[0.18em] text-white/50 uppercase transition group-hover:text-white/80">
                    {s.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
