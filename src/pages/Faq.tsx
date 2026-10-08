import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/cn'

const faqs = [
  {
    q: 'What is Wedyora?',
    a: 'Wedyora is a luxury wedding marketplace for India — verified vendors, transparent starting prices, and reel-makers who can deliver while the function is still on.',
  },
  {
    q: 'Which cities do you cover?',
    a: 'We are live across 40+ cities including Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Jaipur, Udaipur and Goa. Send an enquiry if your city is not listed — concierge still shortlists.',
  },
  {
    q: 'Are vendors verified?',
    a: 'Yes. Partners are reviewed for portfolio, reviews, and starting price before they appear on a Wedyora profile.',
  },
  {
    q: 'How do reel packages work?',
    a: 'Quick Shoot starts at ₹1,999 for one on-site reel. Half Day and Wedding Gold add hours, extra reels, and a highlight. Book from the Reels page.',
  },
  {
    q: 'Is there a fee to enquire?',
    a: 'No. Couples send a brief through the concierge desk at no charge. You pay vendors directly for the work you book.',
  },
  {
    q: 'Can I become a vendor?',
    a: 'Yes. Apply from Become a vendor. Partnerships review your book and city before a verified profile goes live.',
  },
]

export function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <div className="bg-[#fff8f9]">
      <div className="border-b border-black/5 bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-[#8e1454] uppercase">Help centre</p>
          <h1 className="mt-3 font-display text-5xl text-[#3a2f32]">Questions, answered</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Things people ask before they shortlist — no patterned fluff, just clear answers.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-12 lg:px-8">
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <button
              key={item.q}
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              className={cn(
                'w-full rounded-none border-l-4 bg-white px-5 py-5 text-left shadow-sm transition',
                open === i ? 'border-l-[#8e1454]' : 'border-l-transparent hover:border-l-[#D4AF37]',
              )}
            >
              <span className="flex items-center justify-between gap-4">
                <span className="font-medium text-[#3a2f32]">{item.q}</span>
                <ChevronDown
                  className={cn('shrink-0 text-[#8e1454] transition', open === i && 'rotate-180')}
                  size={18}
                />
              </span>
              {open === i && <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
