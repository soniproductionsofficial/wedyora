import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { addWebsiteLead } from '../lib/leads'
import { pushLeadNotification } from '../lib/adminNotifications'
import { buildLeadMail, sendMail } from '../lib/mail'

const field =
  'w-full border-0 border-b border-[#d8c9ce] bg-transparent px-0 py-3 text-sm text-[#3a2f32] outline-none placeholder:text-[#3a2f32]/40 focus:border-[#8e1454]'

const EVENT_TYPES = [
  'Wedding',
  'Pre-wedding',
  'Maternity',
  'Toddler or Newborn',
  'House Warming',
  'Product Shoot',
  'Other',
] as const

export function Contact() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [eventType, setEventType] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const mobile = String(data.get('mobile') ?? '')
    const selectedType = String(data.get('eventType') ?? '')
    const other = String(data.get('eventOther') ?? '')
    const eventDate = String(data.get('date') ?? '')
    const message = String(data.get('message') ?? '')
    const eventLabel = selectedType === 'Other' && other.trim() ? `Other — ${other.trim()}` : selectedType

    setSending(true)
    const lead = addWebsiteLead({
      name,
      email,
      mobile,
      eventType: eventLabel,
      eventDate,
      message,
    })
    pushLeadNotification(lead)
    await sendMail(buildLeadMail(lead))
    setSending(false)
    setSent(true)
  }

  return (
    <div className="min-h-[calc(100dvh-4.75rem)] bg-white">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <aside className="relative min-h-[38vh] overflow-hidden bg-[#8e1454] lg:sticky lg:top-[4.75rem] lg:h-[calc(100dvh-4.75rem)] lg:min-h-0">
          <img
            src="/gallery/wedding-03.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#8e1454]/30 via-[#8e1454]/55 to-[#8e1454]/82" />
          <div className="relative flex h-full flex-col justify-between gap-10 px-8 py-12 text-white lg:px-12 lg:py-14">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.24em] text-[#F6E04D] uppercase">Concierge desk</p>
              <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                Write to us.
                <br />
                We’ll plan with you.
              </h1>
            </div>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#F6E04D]" />
                <div>
                  <p className="text-[10px] tracking-[0.16em] text-white/60 uppercase">Phone</p>
                  <a href="tel:+919000000000" className="mt-1 text-sm hover:text-[#F6E04D]">
                    +91 90000 00000
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#F6E04D]" />
                <div>
                  <p className="text-[10px] tracking-[0.16em] text-white/60 uppercase">Email</p>
                  <a href="mailto:hello@wedyora.com" className="mt-1 text-sm hover:text-[#F6E04D]">
                    hello@wedyora.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F6E04D]" />
                <div>
                  <p className="text-[10px] tracking-[0.16em] text-white/60 uppercase">Cities</p>
                  <p className="mt-1 text-sm text-white/90">Bengaluru · Hyderabad · Chennai · Pondicherry</p>
                </div>
              </li>
            </ul>

            <p className="text-xs text-white/55">
              Prefer booking online?{' '}
              <Link to="/services" className="text-[#F6E04D] underline underline-offset-2">
                Open services
              </Link>
            </p>
          </div>
        </aside>

        <div className="px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
          <div className="w-full max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8e1454] uppercase">Message</p>
            <h2 className="mt-3 font-display text-3xl text-[#3a2f32]">Tell us your date & city</h2>
            <p className="mt-2 text-sm text-muted">A planner replies within the working day.</p>

            {sent ? (
              <div className="mt-10">
                <p className="font-display text-3xl text-[#8e1454]">Received.</p>
                <p className="mt-2 text-sm text-muted">Our team will connect with you soon and follow up on your enquiry.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[10px] font-semibold tracking-[0.16em] text-[#3a2f32]/50 uppercase">Name</span>
                    <input required name="name" className={field} placeholder="Your name" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-semibold tracking-[0.16em] text-[#3a2f32]/50 uppercase">Email</span>
                    <input required type="email" name="email" className={field} placeholder="you@email.com" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-semibold tracking-[0.16em] text-[#3a2f32]/50 uppercase">
                      Mobile number
                    </span>
                    <input
                      required
                      type="tel"
                      name="mobile"
                      inputMode="tel"
                      autoComplete="tel"
                      className={field}
                      placeholder="+91 98765 43210"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-semibold tracking-[0.16em] text-[#3a2f32]/50 uppercase">
                      Event type
                    </span>
                    <select
                      required
                      name="eventType"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className={`${field} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 fill=%22none%22%3E%3Cpath d=%22M1 1.5 6 6.5 11 1.5%22 stroke=%22%238e1454%22 stroke-width=%221.4%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_center] bg-no-repeat pr-6`}
                    >
                      <option value="" disabled>
                        Select event type
                      </option>
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {eventType === 'Other' ? (
                  <label className="block">
                    <span className="text-[10px] font-semibold tracking-[0.16em] text-[#3a2f32]/50 uppercase">
                      Tell us the event
                    </span>
                    <input
                      required
                      name="eventOther"
                      className={field}
                      placeholder="Enter your event type"
                    />
                  </label>
                ) : null}
                <label className="block">
                  <span className="text-[10px] font-semibold tracking-[0.16em] text-[#3a2f32]/50 uppercase">
                    Event date
                  </span>
                  <input type="date" name="date" className={field} />
                </label>
                <label className="block">
                  <span className="text-[10px] font-semibold tracking-[0.16em] text-[#3a2f32]/50 uppercase">
                    How can we help?
                  </span>
                  <textarea required name="message" rows={3} className={`${field} resize-none`} placeholder="Brief, city, budget…" />
                </label>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[#8e1454] py-3.5 text-sm font-semibold tracking-[0.16em] text-white uppercase transition hover:bg-[#7a1048] disabled:opacity-60 sm:w-auto sm:px-12"
                >
                  {sending ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
