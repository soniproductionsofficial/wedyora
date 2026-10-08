const KEY = 'wedyora-admin-notifications'
export const NOTIFY_CHANGED = 'wedyora-admin-notify'

export type AdminNotification = {
  id: string
  type: 'website_lead'
  title: string
  body: string
  leadId: string
  createdAt: string
  read: boolean
}

function notify() {
  window.dispatchEvent(new Event(NOTIFY_CHANGED))
}

function readAll(): AdminNotification[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]') as AdminNotification[]
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

function writeAll(items: AdminNotification[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 80)))
  notify()
}

export function listAdminNotifications(): AdminNotification[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function unreadAdminCount() {
  return readAll().filter((n) => !n.read).length
}

export function pushLeadNotification(lead: { id: string; name: string; eventType: string; mobile: string }) {
  const item: AdminNotification = {
    id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'website_lead',
    title: 'Website customer lead — please follow up',
    body: `${lead.name} enquired for ${lead.eventType}. Mobile ${lead.mobile}.`,
    leadId: lead.id,
    createdAt: new Date().toISOString(),
    read: false,
  }
  writeAll([item, ...readAll()])
  return item
}

export function markNotificationRead(id: string) {
  writeAll(readAll().map((n) => (n.id === id ? { ...n, read: true } : n)))
}

export function markAllNotificationsRead() {
  writeAll(readAll().map((n) => ({ ...n, read: true })))
}
