import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { navLinks } from '../nav'
import { Logo } from './Logo'
import { SignInLinks } from './SignInLinks'
import { ServicesMegaMenu } from './ServicesMegaMenu'
import { navServiceGroups } from '../data/navServicesMenu'
import { cn } from '../lib/cn'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-[12px] font-medium uppercase tracking-[0.18em] text-[#3a2f32] transition hover:text-[#8e1454]',
    isActive && 'text-[#8e1454] underline decoration-[#8e1454] decoration-1 underline-offset-8',
  )

export function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  function closeMobile() {
    setOpen(false)
    setMobileServicesOpen(false)
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b-2 border-[#8e1454] bg-white shadow-[0_1px_0_rgba(246,224,77,0.65)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="shrink-0" onClick={closeMobile}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => {
            if (l.label === 'Services') {
              return (
                <div
                  key={l.label}
                  ref={servicesRef}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    onClick={() => setServicesOpen((v) => !v)}
                    className={cn(
                      'inline-flex items-center gap-1 text-[12px] font-medium uppercase tracking-[0.18em] text-[#3a2f32] transition hover:text-[#8e1454]',
                      (servicesOpen || location.pathname === '/services') &&
                        'text-[#8e1454] underline decoration-[#8e1454] decoration-1 underline-offset-8',
                    )}
                  >
                    Services
                    <ChevronDown
                      size={14}
                      className={cn('transition-transform', servicesOpen && 'rotate-180')}
                    />
                  </button>

                  {servicesOpen ? (
                    <div className="absolute left-1/2 top-full z-50 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 pt-3">
                      <ServicesMegaMenu onNavigate={() => setServicesOpen(false)} />
                    </div>
                  ) : null}
                </div>
              )
            }

            return (
              <NavLink key={l.label} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="hidden lg:block">
          <SignInLinks />
        </div>

        <button
          className="rounded-lg border border-[#8e1454]/20 p-2 text-[#3a2f32] lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#8e1454]/12 bg-white px-4 pb-5 lg:hidden">
          <nav className="py-2">
            {navLinks.map((l) => {
              if (l.label === 'Services') {
                return (
                  <div key={l.label} className="border-b border-[#8e1454]/8">
                    <button
                      type="button"
                      aria-expanded={mobileServicesOpen}
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      className="flex w-full items-center justify-between py-3 text-sm font-medium uppercase tracking-[0.16em] text-[#3a2f32]"
                    >
                      Services
                      <ChevronDown
                        size={16}
                        className={cn('text-[#8e1454]/70 transition-transform', mobileServicesOpen && 'rotate-180')}
                      />
                    </button>

                    {mobileServicesOpen ? (
                      <div className="pb-4 pl-1">
                        {navServiceGroups.map((group) => (
                          <div key={group.id} className="mb-4 last:mb-2">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8e1454]">
                              {group.label}
                            </p>
                            <ul className="space-y-2">
                              {group.items.map((item) => (
                                <li key={item.id}>
                                  <Link
                                    to={item.to}
                                    onClick={closeMobile}
                                    className="block py-0.5 text-sm text-[#3a2f32]"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <Link
                          to="/services"
                          onClick={closeMobile}
                          className="inline-block pt-1 text-xs font-semibold text-[#8e1454]"
                        >
                          View All Services →
                        </Link>
                      </div>
                    ) : null}
                  </div>
                )
              }

              return (
                <NavLink
                  key={l.label}
                  to={l.to}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    cn(
                      'block border-b border-[#8e1454]/8 py-3 text-sm font-medium uppercase tracking-[0.16em] text-[#3a2f32]',
                      isActive && 'text-[#8e1454]',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              )
            })}
          </nav>
          <div onClick={closeMobile}>
            <SignInLinks stacked />
          </div>
        </div>
      ) : null}
    </header>
  )
}
