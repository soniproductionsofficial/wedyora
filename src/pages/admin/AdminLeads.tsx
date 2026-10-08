import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Phone } from 'lucide-react'
import {
  LEADS_CHANGED,
  LEAD_STATUS_LABEL,
  countOpenLeads,
  listLeads,
  updateLead,
  type LeadStatus,
  type WebsiteLead,
} from '../../lib/leads'
import { cn } from '../../lib/cn'

const field =
  'mt-1 w-full rounded-lg border border-[#d8c9ce] bg-white px-3 py-2 text-sm text-[#3a2f32] outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20'

const STATUS_CLASS: Record<LeadStatus, string> = {
  new: 'bg-[#8e1454] text-white',
  following_up: 'bg-amber-100 text-amber-900',
  follow_later: 'bg-[#fff8f9] text-[#8e1454]',
  converted: 'bg-emerald-50 text-emerald-800',
  not_interested: 'bg-zinc-100 text-zinc-600',
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.94.57 3.76 1.56 5.29L2 22l5.04-1.64a10.1 10.1 0 0 0 5 .1.1.1 0 0 0 9.89-9.63C21.93 6.4 17.5 2 12.04 2m5.77 14.36c-.24.67-1.4 1.24-1.94 1.32-.5.07-1.13.1-1.83-.12-.42-.13-.97-.32-1.67-.62-2.94-1.27-4.86-4.22-5.01-4.42-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.2 1.05-2.5.27-.3.6-.37.8-.37h.58c.18 0 .43-.07.67.51.24.6.82 2.07.9 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.3-.13.6.17.3.77 1.27 1.65 2.06 1.14 1.02 2.1 1.33 2.4 1.48.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.01.96.3.15.5.22.57.34.08.12.08.7-.16 1.37" />
    </svg>
  )
}

function whatsappHref() {
  const raw = (import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER ?? '').replace(/\D/g, '')
  return raw ? `https://wa.me/${raw}` : null
}

export function AdminLeads() {
  const [leads, setLeads] = useState<WebsiteLead[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [status, setStatus] = useState<LeadStatus>('new')
  const [shootDay, setShootDay] = useState('')
  const [reason, setReason] = useState('')
  const [nextFollowAt, setNextFollowAt] = useState('')
  const [followReason, setFollowReason] = useState('')
  const [notes, setNotes] = useState('')
  const [saveHint, setSaveHint] = useState('')

  useEffect(() => {
    const refresh = () => setLeads(listLeads())
    refresh()
    window.addEventListener(LEADS_CHANGED, refresh)
    return () => window.removeEventListener(LEADS_CHANGED, refresh)
  }, [])

  const active = useMemo(() => leads.find((l) => l.id === activeId) ?? null, [leads, activeId])
  const openCount = countOpenLeads()
  const waLink = whatsappHref()
  const needsFollowSchedule = status === 'new' || status === 'following_up' || status === 'follow_later'

  useEffect(() => {
    if (!active) return
    setStatus(active.status)
    setShootDay(active.shootDay)
    setReason(active.notInterestedReason)
    setNextFollowAt(active.nextFollowAt)
    setFollowReason(active.followReason ?? '')
    setNotes(active.followNotes)
    setSaveHint('')
  }, [active])

  function saveFollowUp() {
    if (!active) return
    if (status === 'converted' && !shootDay) {
      setSaveHint('Add the shoot day.')
      return
    }
    if (status === 'not_interested' && !reason.trim()) {
      setSaveHint('Add why they are not interested.')
      return
    }
    if (needsFollowSchedule && (!nextFollowAt || !followReason.trim())) {
      setSaveHint('Add the follow-up date and reason.')
      return
    }
    updateLead(active.id, {
      status,
      shootDay: status === 'converted' ? shootDay : '',
      notInterestedReason: status === 'not_interested' ? reason.trim() : '',
      nextFollowAt: needsFollowSchedule ? nextFollowAt : '',
      followReason: needsFollowSchedule ? followReason.trim() : '',
      followNotes: notes.trim(),
    })
    setSaveHint('Follow-up saved.')
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-[#3a2f32]">Leads</h1>
          <p className="mt-1 text-sm text-muted">
            Follow up required until you set a date and reason — then convert, mark not interested, or follow later.
          </p>
        </div>
        <p className="rounded-full bg-[#8e1454] px-3 py-1 text-xs font-semibold text-white">
          {openCount} open
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[#8e1454]/25 bg-white p-10 text-center">
          <p className="text-sm text-[#3a2f32]">No website leads yet.</p>
          <p className="mt-2 text-xs text-muted">When a customer sends a message on Contact, it appears here.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="overflow-hidden rounded-2xl border border-[#8e1454]/12 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#8e1454]/10 bg-[#fff8f9] text-[11px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Event</th>
                  <th className="px-4 py-3 font-semibold">Follow-up</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={cn(
                      'cursor-pointer border-b border-[#8e1454]/06 transition hover:bg-[#fffdfd]',
                      activeId === lead.id && 'bg-[#fff8f9]',
                    )}
                    onClick={() => setActiveId(lead.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#3a2f32]">{lead.name}</p>
                      <p className="text-xs text-muted">{lead.mobile}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{lead.eventType}</p>
                      <p className="text-xs text-muted">{formatWhen(lead.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {lead.nextFollowAt ? (
                        <>
                          <p className="font-medium text-[#3a2f32]">{lead.nextFollowAt}</p>
                          <p>{lead.followReason || '—'}</p>
                        </>
                      ) : (
                        'Set date'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold', STATUS_CLASS[lead.status])}>
                        {LEAD_STATUS_LABEL[lead.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className="rounded-2xl border border-[#8e1454]/12 bg-white p-5">
            {!active ? (
              <p className="text-sm text-muted">Select a lead to follow up.</p>
            ) : (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8e1454]">
                  Follow up required
                </p>
                <h2 className="mt-2 font-display text-2xl text-[#3a2f32]">{active.name}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <p className="flex items-center gap-1.5 text-sm text-[#3a2f32]">
                    <Phone className="h-3.5 w-3.5 text-[#8e1454]" />
                    {active.mobile}
                  </p>
                  {waLink ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      title="WhatsApp Business"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1ebe5d]"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                    </a>
                  ) : (
                    <span
                      title="WhatsApp Business number coming soon"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted">{active.email}</p>
                <p className="mt-3 text-sm">
                  <span className="font-semibold">{active.eventType}</span>
                  {active.eventDate ? ` · ${active.eventDate}` : ''}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#3a2f32]/80">{active.message}</p>

                <div className="mt-5 space-y-3 border-t border-[#8e1454]/10 pt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    After follow-up
                    <select className={field} value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
                      <option value="new">Follow up required</option>
                      <option value="following_up">Following up</option>
                      <option value="converted">Converted to order</option>
                      <option value="not_interested">Not interested</option>
                      <option value="follow_later">Follow later</option>
                    </select>
                  </label>

                  {needsFollowSchedule ? (
                    <>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Follow-up date
                        <input
                          required
                          type="date"
                          className={field}
                          value={nextFollowAt}
                          onChange={(e) => setNextFollowAt(e.target.value)}
                        />
                      </label>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Follow-up reason
                        <input
                          required
                          className={field}
                          value={followReason}
                          onChange={(e) => setFollowReason(e.target.value)}
                          placeholder="Called, no answer / asked to call after 6pm…"
                        />
                      </label>
                    </>
                  ) : null}

                  {status === 'converted' ? (
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Shoot day
                      <input required type="date" className={field} value={shootDay} onChange={(e) => setShootDay(e.target.value)} />
                    </label>
                  ) : null}

                  {status === 'not_interested' ? (
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                      Why not interested
                      <input
                        required
                        className={field}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Budget / timing / booked elsewhere…"
                      />
                    </label>
                  ) : null}

                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Notes
                    <textarea className={`${field} resize-none`} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </label>

                  {saveHint ? <p className="text-xs text-[#8e1454]">{saveHint}</p> : null}

                  <button
                    type="button"
                    onClick={saveFollowUp}
                    className="w-full rounded-lg bg-[#8e1454] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7a1048]"
                  >
                    Save follow-up
                  </button>
                  {active.status === 'converted' && active.shootDay ? (
                    <p className="flex items-center gap-1.5 text-xs text-emerald-800">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Shoot day {active.shootDay}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        Email/SMTP and WhatsApp Business number can be added later — leads already land here.{' '}
        <Link to="/admin/notifications" className="font-semibold text-[#8e1454]">
          Notifications
        </Link>
      </p>
    </div>
  )
}
