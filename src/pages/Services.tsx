import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { SectionEyebrow } from '../components/Ornament'
import { FloralBackdrop } from '../components/home/FloralBackdrop'
import { ServicesShop } from '../components/customer/ServicesShop'
import { useCart } from '../context/CartContext'
import { getCustomerSession } from '../lib/customerOtp'

export function Services() {
  const { count } = useCart()
  const session = getCustomerSession()

  return (
    <div className="bg-paper pb-4">
      <section className="relative overflow-hidden bg-wedyora-hero px-5 py-14 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-wedyora-mesh" />
        <div className="relative mx-auto max-w-3xl text-center">
          <SectionEyebrow>What we book</SectionEyebrow>
          <h1 className="mt-3 font-display text-4xl text-white sm:text-5xl">Services & packages</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85">
            Photography, catering, décor, makeup, and every artisan your celebration needs — same
            packages and prices, one cart.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-md border border-[#F6E04D]/60 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <ShoppingBag size={16} />
              Cart {count > 0 && `(${count})`}
            </Link>
            {!session ? (
              <Link
                to="/login"
                state={{ from: '/services' }}
                className="rounded-md bg-[#F6E04D] px-5 py-2.5 text-sm font-semibold text-[#3a2f32] hover:bg-[#e6cf3d]"
              >
                Sign in to book
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <FloralBackdrop className="pb-4">
        <ServicesShop />
      </FloralBackdrop>
    </div>
  )
}
