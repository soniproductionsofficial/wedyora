import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Bell,
  Briefcase,
  ClipboardCheck,
  CreditCard,
  FileText,
  HeadphonesIcon,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  UserCircle,
  Users,
  Workflow,
  BarChart3,
  Image,
  UserCog,
} from 'lucide-react'
import { Logo } from '../../components/Logo'
import { getAdminUsername, isAdminLoggedIn, logoutAdmin } from '../../lib/adminAuth'
import { unreadAdminCount, NOTIFY_CHANGED } from '../../lib/adminNotifications'
import { cn } from '../../lib/cn'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Leads', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/bookings', label: 'Bookings', icon: Briefcase },
  { to: '/admin/partners', label: 'Partners', icon: UserCircle },
  { to: '/admin/services', label: 'Services & Packages', icon: Package },
  { to: '/admin/assignment', label: 'Assignment', icon: Workflow },
  { to: '/admin/operations', label: 'Operations', icon: ClipboardCheck },
  { to: '/admin/media-qc', label: 'Media & QC', icon: Image },
  { to: '/admin/payments', label: 'Payments & Payouts', icon: CreditCard },
  { to: '/admin/support', label: 'Support & Complaints', icon: HeadphonesIcon },
  { to: '/admin/marketing', label: 'Marketing & Offers', icon: Megaphone },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/cms', label: 'CMS', icon: FileText },
  { to: '/admin/staff', label: 'Staff & Roles', icon: UserCog },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
  { to: '/admin/audit', label: 'Audit Logs', icon: Shield },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
] as const

export function AdminLayout() {
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const refresh = () => setUnread(unreadAdminCount())
    refresh()
    window.addEventListener(NOTIFY_CHANGED, refresh)
    return () => window.removeEventListener(NOTIFY_CHANGED, refresh)
  }, [])

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  const user = getAdminUsername() ?? 'admin'

  return (
    <div className="flex min-h-dvh bg-[#f6f1f3]">
      <aside className="sticky top-0 flex h-dvh w-64 shrink-0 flex-col border-r border-white/10 bg-[#3a0a24] text-white">
        <div className="border-b border-white/10 px-4 py-5">
          <Logo variant="onDark" />
          <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F6E04D]">
            Admin portal
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition',
                      isActive ? 'bg-[#8e1454] text-white' : 'text-white/75 hover:bg-white/10 hover:text-white',
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0 opacity-90" />
                  {item.label}
                  {item.to === '/admin/notifications' && unread > 0 ? (
                    <span className="ml-auto rounded-full bg-[#F6E04D] px-1.5 py-0.5 text-[10px] font-bold text-[#3a0a24]">
                      {unread}
                    </span>
                  ) : null}
                  {item.to === '/admin/leads' && unread > 0 ? (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#F6E04D]" />
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-xs text-white/60">Signed in as</p>
          <p className="truncate text-sm font-semibold">{user}</p>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/10"
            onClick={() => {
              logoutAdmin()
              navigate('/admin/login')
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
