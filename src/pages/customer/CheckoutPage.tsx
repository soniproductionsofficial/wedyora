import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { SectionEyebrow } from '../../components/Ornament'
import { useCart } from '../../context/CartContext'
import { cities } from '../../data'
import { formatInr } from '../../data/shopPackages'
import { getCustomerSession } from '../../lib/customerOtp'

const BOOKINGS_KEY = 'wedyora-customer-bookings'

export type SavedBooking = {
  id: string
  createdAt: string
  mobile: string
  customerName: string
  eventDate: string
  city: string
  notes: string
  items: Array<{
    serviceName: string
    packageName: string
    guestCount?: number
    unitPrice?: number
    total: number
  }>
  subtotal: number
  status: 'confirmed'
}

export function saveBooking(booking: SavedBooking) {
  const raw = localStorage.getItem(BOOKINGS_KEY)
  const list: SavedBooking[] = raw ? (JSON.parse(raw) as SavedBooking[]) : []
  list.unshift(booking)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list))
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const session = getCustomerSession()
  const { items, subtotal, clearCart } = useCart()
  const [eventDate, setEventDate] = useState('')
  const [city, setCity] = useState('')
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)
  const [bookingId, setBookingId] = useState('')

  if (!session) {
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />
  }

  if (items.length === 0 && !done) {
    return <Navigate to="/cart" replace />
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!eventDate || !city) return
    const id = `WD-${Date.now().toString(36).toUpperCase()}`
    const booking: SavedBooking = {
      id,
      createdAt: new Date().toISOString(),
      mobile: session!.mobile,
      customerName: session!.name ?? 'Guest',
      eventDate,
      city,
      notes,
      items: items.map((item) => ({
        serviceName: item.serviceName,
        packageName: item.packageName,
        guestCount: item.guestCount,
        unitPrice: item.unitPrice,
        total: item.price,
      })),
      subtotal,
      status: 'confirmed',
    }
    saveBooking(booking)
    clearCart()
    setBookingId(id)
    setDone(true)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center lg:px-8">
        <CheckCircle2 className="mx-auto h-16 w-16 text-[#8e1454]" />
        <h1 className="mt-6 font-display text-4xl text-[#3a2f32]">Booking confirmed</h1>
        <p className="mt-3 text-sm text-muted">
          Reference <span className="font-semibold text-[#8e1454]">{bookingId}</span>. Our team will
          reach you on {session.mobile} to assign the best Wedyora partner.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/services"
            className="rounded-md bg-[#8e1454] px-8 py-3 text-sm font-semibold tracking-[0.12em] text-white uppercase hover:bg-[#7a1048]"
          >
            Book more
          </Link>
          <Link
            to="/"
            className="rounded-md border border-[#8e1454]/30 px-8 py-3 text-sm font-semibold text-[#8e1454] hover:bg-[#fff8f9]"
          >
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-paper pb-20">
      <section className="bg-wedyora-hero px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionEyebrow>Checkout</SectionEyebrow>
          <h1 className="mt-3 font-display text-4xl text-white">Final booking</h1>
        </div>
      </section>

      <form onSubmit={onSubmit} className="mx-auto grid max-w-4xl gap-10 px-5 py-10 lg:grid-cols-2 lg:px-8">
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-[#3a2f32]">Event details</h2>
          <label className="block text-sm text-[#3a2f32]">
            Event date
            <input
              required
              type="date"
              value={eventDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setEventDate(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[#d8c9ce] px-4 py-2.5 text-sm outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20"
            />
          </label>
          <label className="block text-sm text-[#3a2f32]">
            City
            <select
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-[#d8c9ce] px-4 py-2.5 text-sm outline-none focus:border-[#8e1454]"
            >
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-[#3a2f32]">
            Notes (optional)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Venue, timing, special requests…"
              className="mt-1.5 w-full rounded-lg border border-[#d8c9ce] px-4 py-2.5 text-sm outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20"
            />
          </label>
        </div>

        <aside className="h-fit rounded-2xl border border-[#8e1454]/15 bg-[#fff8f9] p-6">
          <h2 className="font-display text-xl text-[#3a2f32]">Order summary</h2>
          <ul className="mt-4 space-y-4 border-b border-[#8e1454]/10 pb-4">
            {items.map((item) => (
              <li key={item.packageId} className="flex gap-3 text-sm">
                <img
                  src={item.image}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div>
                  <p className="text-[10px] font-semibold tracking-wide text-[#8e1454] uppercase">
                    {item.serviceName}
                  </p>
                  <p className="font-medium text-[#3a2f32]">{item.packageName}</p>
                  {item.guestCount != null && item.unitPrice != null ? (
                    <p className="text-xs text-muted">
                      {formatInr(item.unitPrice)} × {item.guestCount} guests
                    </p>
                  ) : null}
                  <p className="mt-1 text-[#8e1454]">{formatInr(item.price)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between font-display text-xl text-[#3a2f32]">
            <span>Total</span>
            <span className="text-[#8e1454]">{formatInr(subtotal)}</span>
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-[#8e1454] py-3 text-sm font-semibold tracking-[0.12em] text-white uppercase hover:bg-[#7a1048]"
          >
            Confirm booking
          </button>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="mt-3 w-full text-sm text-muted underline underline-offset-2"
          >
            Back to cart
          </button>
        </aside>
      </form>
    </div>
  )
}
