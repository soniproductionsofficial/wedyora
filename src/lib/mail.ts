/**
 * Outbound mail helper.
 *
 * SMTP cannot run in the browser. When you have a mailbox:
 * 1. Set VITE_MAIL_ENDPOINT to your send API (e.g. /api/send-mail)
 * 2. Set VITE_LEAD_NOTIFY_EMAIL to the admin inbox
 * 3. Put SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM
 *    on that API (see scripts/smtp-send.example.mjs)
 *
 * Until then, sendMail() no-ops and the lead still saves to Admin → Leads.
 */

export type MailPayload = {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendMail(payload: MailPayload): Promise<{ sent: boolean; skipped?: string }> {
  const endpoint = import.meta.env.VITE_MAIL_ENDPOINT as string | undefined
  if (!endpoint) {
    console.info('[wedyora mail] SMTP not configured yet — lead stored locally.', payload.subject)
    return { sent: false, skipped: 'VITE_MAIL_ENDPOINT not set' }
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    console.warn('[wedyora mail] send failed', res.status)
    return { sent: false, skipped: `HTTP ${res.status}` }
  }

  return { sent: true }
}

export function leadNotifyEmail() {
  return (import.meta.env.VITE_LEAD_NOTIFY_EMAIL as string | undefined)?.trim() ?? ''
}

export function buildLeadMail(lead: {
  name: string
  email: string
  mobile: string
  eventType: string
  eventDate: string
  message: string
}) {
  const to = leadNotifyEmail() || 'admin@wedyora.com'
  const subject = `New website lead — ${lead.name} (${lead.eventType})`
  const text = [
    'New lead from the Wedyora website. Please follow up.',
    '',
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Mobile: ${lead.mobile}`,
    `Event type: ${lead.eventType}`,
    `Event date: ${lead.eventDate || '—'}`,
    '',
    lead.message,
  ].join('\n')

  return {
    to,
    subject,
    text,
    html: `<p><strong>New lead from the Wedyora website.</strong> Please follow up.</p>
      <p>Name: ${escapeHtml(lead.name)}<br/>
      Email: ${escapeHtml(lead.email)}<br/>
      Mobile: ${escapeHtml(lead.mobile)}<br/>
      Event type: ${escapeHtml(lead.eventType)}<br/>
      Event date: ${escapeHtml(lead.eventDate || '—')}</p>
      <p>${escapeHtml(lead.message).replace(/\n/g, '<br/>')}</p>`,
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
