const LEADS_KEY = 'wedyora-website-leads'
export const LEADS_CHANGED = 'wedyora-leads-changed'

export type LeadStatus = 'new' | 'following_up' | 'follow_later' | 'converted' | 'not_interested'

export type WebsiteLead = {
  id: string
  source: 'website'
  name: string
  email: string
  mobile: string
  eventType: string
  eventDate: string
  message: string
  createdAt: string
  status: LeadStatus
  /** Set when converted to an order */
  shootDay: string
  /** Set when not interested */
  notInterestedReason: string
  /** Next follow-up date when still following */
  nextFollowAt: string
  /** Why this follow-up date was set */
  followReason: string
  followNotes: string
  updatedAt: string
}

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'Follow up required',
  following_up: 'Following up',
  follow_later: 'Follow later',
  converted: 'Converted to order',
  not_interested: 'Not interested',
}

function notify() {
  window.dispatchEvent(new Event(LEADS_CHANGED))
}

function readLeads(): WebsiteLead[] {
  try {
    const raw = JSON.parse(localStorage.getItem(LEADS_KEY) ?? '[]') as WebsiteLead[]
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

function writeLeads(leads: WebsiteLead[]) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
  notify()
}

export function listLeads(): WebsiteLead[] {
  return readLeads().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function countOpenLeads() {
  return readLeads().filter((l) => l.status === 'new' || l.status === 'following_up' || l.status === 'follow_later')
    .length
}

export function addWebsiteLead(input: {
  name: string
  email: string
  mobile: string
  eventType: string
  eventDate: string
  message: string
}): WebsiteLead {
  const now = new Date().toISOString()
  const lead: WebsiteLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    source: 'website',
    name: input.name.trim(),
    email: input.email.trim(),
    mobile: input.mobile.trim(),
    eventType: input.eventType.trim(),
    eventDate: input.eventDate,
    message: input.message.trim(),
    createdAt: now,
    status: 'new',
    shootDay: '',
    notInterestedReason: '',
    nextFollowAt: '',
    followReason: '',
    followNotes: '',
    updatedAt: now,
  }
  writeLeads([lead, ...readLeads()])
  return lead
}

export function updateLead(id: string, patch: Partial<WebsiteLead>): WebsiteLead | null {
  const leads = readLeads()
  const i = leads.findIndex((l) => l.id === id)
  if (i < 0) return null
  const next = { ...leads[i], ...patch, id, updatedAt: new Date().toISOString() }
  leads[i] = next
  writeLeads(leads)
  return next
}
