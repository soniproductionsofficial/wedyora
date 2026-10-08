import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppFloat } from './WhatsAppFloat'
import { cn } from '../lib/cn'

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const isHome = pathname === '/'
  const isPartnerLanding = pathname === '/vendor/join'

  return (
    <div className={cn('bg-paper text-gold', !isPartnerLanding && 'min-h-screen')}>
      <Navbar />
      <main className={cn(!isHome && 'pt-[4.75rem]', isPartnerLanding && 'overflow-x-hidden')}>
        <Outlet />
      </main>
      {!isPartnerLanding && <Footer />}
      {!isPartnerLanding && <WhatsAppFloat />}
    </div>
  )
}
