import { SectionEyebrow } from '../components/Ornament'

const posts = [
  {
    title: 'How to brief a photographer in black, magenta and gold',
    date: '12 Aug 2026',
    excerpt: 'A one-page visual brief so your album matches the house palette without looking like a filter pack.',
  },
  {
    title: 'Reel-makers vs. traditional films',
    date: '28 Jul 2026',
    excerpt: 'When you need a cut on the dance floor, and when you still want the long cinematic film.',
  },
  {
    title: 'Udaipur after dark: lighting a palace mandap',
    date: '9 Jul 2026',
    excerpt: 'What actually reads on camera — candle, tungsten, and a single gold line.',
  },
]

export function Blog() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
      <SectionEyebrow>Journal</SectionEyebrow>
      <h1 className="mt-3 font-display text-5xl">Blog</h1>
      <p className="mt-4 text-muted">Notes from the desk — planning, picture, and production.</p>
      <div className="mt-10 space-y-6">
        {posts.map((p) => (
          <article key={p.title} className="rounded-3xl border border-gold/15 bg-ink-2 p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">{p.date}</p>
            <h2 className="mt-2 font-display text-3xl">{p.title}</h2>
            <p className="mt-3 text-muted">{p.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
