import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  listAdminNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NOTIFY_CHANGED,
  type AdminNotification,
} from '../../lib/adminNotifications'

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AdminNotifications() {
  const [items, setItems] = useState<AdminNotification[]>([])

  useEffect(() => {
    const refresh = () => setItems(listAdminNotifications())
    refresh()
    window.addEventListener(NOTIFY_CHANGED, refresh)
    return () => window.removeEventListener(NOTIFY_CHANGED, refresh)
  }, [])

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-[#3a2f32]">Notifications</h1>
          <p className="mt-1 text-sm text-muted">Website leads and follow-up alerts.</p>
        </div>
        {items.some((n) => !n.read) ? (
          <button
            type="button"
            onClick={() => markAllNotificationsRead()}
            className="text-xs font-semibold uppercase tracking-wider text-[#8e1454]"
          >
            Mark all read
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[#8e1454]/25 bg-white p-10 text-center">
          <p className="text-sm text-[#3a2f32]">No notifications yet.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl border bg-white p-5 ${n.read ? 'border-[#8e1454]/10' : 'border-[#8e1454]/35 shadow-[0_8px_24px_rgba(142,20,84,0.08)]'}`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8e1454]">
                {n.read ? 'Read' : 'New'} · {formatWhen(n.createdAt)}
              </p>
              <h2 className="mt-1 font-display text-xl text-[#3a2f32]">{n.title}</h2>
              <p className="mt-1 text-sm text-[#3a2f32]/80">{n.body}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  to="/admin/leads"
                  onClick={() => markNotificationRead(n.id)}
                  className="text-sm font-semibold text-[#8e1454]"
                >
                  Open lead →
                </Link>
                {!n.read ? (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(n.id)}
                    className="text-sm text-muted"
                  >
                    Mark read
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
