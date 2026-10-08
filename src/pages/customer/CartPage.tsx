import { Link, Navigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { SectionEyebrow } from '../../components/Ornament'
import { useCart } from '../../context/CartContext'
import { formatInr } from '../../data/shopPackages'
import { getCustomerSession } from '../../lib/customerOtp'

function CartGuestInput({
  lineId,
  guestCount,
  onCommit,
}: {
  lineId: string
  guestCount: number
  onCommit: (lineId: string, guests: number) => void
}) {
  return (
    <label className="mt-3 flex items-center gap-2 text-xs font-medium text-[#3a2f32]">
      Guests
      <input
        type="number"
        min={1}
        value={guestCount}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value, 10)
          if (Number.isFinite(n) && n >= 1) onCommit(lineId, n)
        }}
        className="w-24 rounded-lg border border-[#d8c9ce] px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#8e1454]/30"
      />
    </label>
  )
}

export function CartPage() {
  const session = getCustomerSession()
  const { items, subtotal, updateCateringGuests, removeItem } = useCart()

  if (!session) {
    return <Navigate to="/login" state={{ from: '/cart' }} replace />
  }

  return (
    <div className="bg-paper pb-20">
      <section className="bg-wedyora-hero px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionEyebrow>Your cart</SectionEyebrow>
          <h1 className="mt-3 font-display text-4xl text-white">Booking summary</h1>
          <p className="mt-2 text-sm text-white/85">
            Review packages, adjust catering guest counts, then checkout.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-[#8e1454]/12 bg-[#fff8f9] p-10 text-center">
            <p className="font-display text-2xl text-[#3a2f32]">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted">Browse services and add packages to get started.</p>
            <Link
              to="/services"
              className="mt-6 inline-block rounded-md bg-[#8e1454] px-8 py-3 text-sm font-semibold tracking-[0.12em] text-white uppercase hover:bg-[#7a1048]"
            >
              Browse services
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <article
                key={item.packageId}
                className="overflow-hidden rounded-2xl border border-[#8e1454]/12 bg-white shadow-[0_12px_32px_rgba(142,20,84,0.06)]"
              >
                <div className="flex flex-col sm:flex-row">
                  <img
                    src={item.image}
                    alt={item.packageName}
                    className="h-40 w-full object-cover sm:h-auto sm:w-44"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.14em] text-[#8e1454] uppercase">
                          {item.serviceName}
                        </p>
                        <h2 className="font-display text-xl text-[#3a2f32]">{item.packageName}</h2>
                        {item.guestCount != null && item.unitPrice != null ? (
                          <p className="mt-1 text-xs text-muted">
                            {formatInr(item.unitPrice)} × {item.guestCount} guests
                          </p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        aria-label="Remove"
                        onClick={() => removeItem(item.packageId)}
                        className="text-[#8e1454]/60 hover:text-[#8e1454]"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {item.guestCount != null && item.unitPrice != null ? (
                      <CartGuestInput
                        lineId={item.packageId}
                        guestCount={item.guestCount}
                        onCommit={updateCateringGuests}
                      />
                    ) : null}

                    <p className="mt-4 text-right font-display text-xl text-[#8e1454]">
                      {formatInr(item.price)}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            <div className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#fff8f9] to-white p-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl text-[#3a2f32]">Estimated total</span>
                <span className="font-display text-3xl text-[#8e1454]">{formatInr(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-muted">
                Taxes, travel, and venue fees may apply at confirmation.
              </p>
              <Link
                to="/checkout"
                className="mt-5 block w-full rounded-md bg-[#8e1454] py-3 text-center text-sm font-semibold tracking-[0.12em] text-white uppercase hover:bg-[#7a1048]"
              >
                Proceed to checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
