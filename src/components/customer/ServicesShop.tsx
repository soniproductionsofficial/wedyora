import { useEffect, useRef, useState, startTransition } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Check, Plus, X } from 'lucide-react'
import {
  SHOP_SERVICES,
  formatInr,
  getPackageImage,
  isCateringPackage,
  resolveShopHash,
  cateringLineId,
  cateringUnitPrice,
  DEFAULT_CATERING_GUESTS,
  type DietOption,
  type ShopPackage,
  type ShopService,
} from '../../data/shopPackages'
import {
  PackageKpiCard,
  ServiceKpiCard,
  ServicePackagesHeader,
} from './ServiceKpiCards'
import { useCart } from '../../context/CartContext'
import { getCustomerSession } from '../../lib/customerOtp'

function CateringPackageRow({
  service,
  pkg,
  packageIndex,
  onAdded,
}: {
  service: ShopService
  pkg: ShopPackage
  packageIndex: number
  onAdded: () => void
}) {
  const {
    addCateringPackage,
    updateCateringGuests,
    removePackage,
    hasPackage,
    getLine,
  } = useCart()

  const min = pkg.minGuests ?? DEFAULT_CATERING_GUESTS
  const vegId = cateringLineId(pkg.id, 'veg')
  const nonVegId = cateringLineId(pkg.id, 'non-veg')
  const vegLine = getLine(vegId)
  const nonVegLine = getLine(nonVegId)

  const initial = vegLine?.guestCount ?? nonVegLine?.guestCount ?? min
  const [guestDraft, setGuestDraft] = useState(String(initial))

  const vegUnit = cateringUnitPrice(pkg, 'veg')
  const nonVegUnit = cateringUnitPrice(pkg, 'non-veg')

  const parsedGuests = Number.parseInt(guestDraft, 10)
  const hasValidGuests =
    guestDraft.trim() !== '' && Number.isFinite(parsedGuests) && parsedGuests >= 1
  const previewGuests = hasValidGuests ? parsedGuests : min
  const thumb = getPackageImage(service.id, packageIndex)

  function commitGuests(raw: string) {
    const n = Number.parseInt(raw, 10)
    const value = Number.isFinite(n) && n >= 1 ? Math.floor(n) : min
    setGuestDraft(String(value))
    if (hasPackage(vegId)) updateCateringGuests(vegId, value)
    if (hasPackage(nonVegId)) updateCateringGuests(nonVegId, value)
    return value
  }

  function onGuestChange(raw: string) {
    if (raw === '' || /^\d+$/.test(raw)) {
      setGuestDraft(raw)
      const n = Number.parseInt(raw, 10)
      if (Number.isFinite(n) && n >= 1) {
        if (hasPackage(vegId)) updateCateringGuests(vegId, n)
        if (hasPackage(nonVegId)) updateCateringGuests(nonVegId, n)
      }
    }
  }

  function addDiet(diet: DietOption) {
    const guests = commitGuests(guestDraft)
    addCateringPackage(service, pkg, diet, guests, packageIndex)
    onAdded()
  }

  return (
    <li id={pkg.id} className="scroll-mt-28 col-span-full overflow-hidden rounded-2xl border border-[#8e1454]/12 bg-white shadow-[0_8px_28px_rgba(142,20,84,0.07)]">
      <div className="flex flex-col sm:flex-row">
        <img src={thumb} alt={pkg.name} className="h-36 w-full object-cover sm:h-auto sm:w-36" />
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-[#3a2f32]">{pkg.name}</p>
              <p className="mt-1 text-xs text-muted">{pkg.description}</p>
              <p className="mt-2 text-sm text-[#3a2f32]">
                <span className="font-semibold">Veg {formatInr(vegUnit)}</span>
                <span className="text-muted"> / person</span>
                <span className="mx-2 text-muted">·</span>
                <span className="font-semibold">Non-Veg {formatInr(nonVegUnit)}</span>
                <span className="text-muted"> / person</span>
              </p>
            </div>

            <label className="flex w-full flex-col gap-1 text-xs font-medium sm:w-40">
              Guest count
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={guestDraft}
                placeholder={String(min)}
                onChange={(e) => onGuestChange(e.target.value)}
                onBlur={() => commitGuests(guestDraft)}
                className="rounded-lg border border-[#d8c9ce] px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#8e1454]/30"
              />
              <span className="font-normal text-muted">
                Suggested min {min} · enter any quantity
              </span>
            </label>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-[#8e1454]/10 bg-[#fff8f9] p-3">
              <p className="text-xs text-muted">Veg total</p>
              <p className="font-semibold text-[#8e1454]">{formatInr(vegUnit * previewGuests)}</p>
              {hasPackage(vegId) ? (
                <button
                  type="button"
                  onClick={() => removePackage(vegId)}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#8e1454]/20 bg-white px-3 py-2 text-xs font-semibold"
                >
                  <Check className="h-3.5 w-3.5 text-[#8e1454]" />
                  Veg in cart · Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => addDiet('veg')}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#8e1454] px-3 py-2 text-xs font-semibold text-white hover:bg-[#7a1048]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Veg to cart
                </button>
              )}
            </div>

            <div className="rounded-lg border border-[#8e1454]/10 bg-[#fff8f9] p-3">
              <p className="text-xs text-muted">Non-Veg total</p>
              <p className="font-semibold text-[#8e1454]">{formatInr(nonVegUnit * previewGuests)}</p>
              {hasPackage(nonVegId) ? (
                <button
                  type="button"
                  onClick={() => removePackage(nonVegId)}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#8e1454]/20 bg-white px-3 py-2 text-xs font-semibold"
                >
                  <Check className="h-3.5 w-3.5 text-[#8e1454]" />
                  Non-Veg in cart · Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => addDiet('non-veg')}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#8e1454] px-3 py-2 text-xs font-semibold text-white hover:bg-[#7a1048]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Non-Veg to cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

function CartGuestInput({
  lineId,
  guestCount,
  onCommit,
}: {
  lineId: string
  guestCount: number
  onCommit: (lineId: string, guests: number) => void
}) {
  const [draft, setDraft] = useState(String(guestCount))
  const lastCommitted = useRef(guestCount)

  useEffect(() => {
    if (guestCount !== lastCommitted.current) {
      lastCommitted.current = guestCount
      setDraft(String(guestCount))
    }
  }, [guestCount])

  return (
    <label className="mt-3 flex items-center gap-2 text-xs font-medium">
      Guests
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={(e) => {
          const raw = e.target.value
          if (raw === '' || /^\d+$/.test(raw)) {
            setDraft(raw)
            const n = Number.parseInt(raw, 10)
            if (Number.isFinite(n) && n >= 1) {
              lastCommitted.current = n
              onCommit(lineId, n)
            }
          }
        }}
        onBlur={() => {
          const n = Number.parseInt(draft, 10)
          const value = Number.isFinite(n) && n >= 1 ? n : Math.max(1, guestCount)
          lastCommitted.current = value
          setDraft(String(value))
          onCommit(lineId, value)
        }}
        className="w-24 rounded-lg border border-[#d8c9ce] px-2 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#8e1454]/30"
        aria-label="Guest count"
      />
    </label>
  )
}

export function ServicesShop() {
  const location = useLocation()
  const {
    items,
    addPackage,
    removePackage,
    hasPackage,
    updateCateringGuests,
    total,
    count,
    clearCart,
  } = useCart()
  const [selectedId, setSelectedId] = useState<string>('photography')
  const [cartOpen, setCartOpen] = useState(false)
  const session = getCustomerSession()

  const selectedService =
    SHOP_SERVICES.find((s) => s.id === selectedId) ?? SHOP_SERVICES[0]!

  useEffect(() => {
    const hash = location.hash.replace(/^#/, '')
    const resolved = resolveShopHash(hash)
    if (!resolved) return
    startTransition(() => setSelectedId(resolved.categoryId))
    requestAnimationFrame(() => {
      const targetId = resolved.packageId ?? 'service-packages'
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.hash])

  const checkoutPath = session ? '/checkout' : '/login'
  const checkoutState = session ? undefined : { from: '/checkout' }

  return (
    <div className="relative pb-28">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-14 lg:px-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8e1454]">
            Build your occasion
          </p>
          <h2 className="font-display text-2xl text-[#3a2f32] md:text-3xl">Services & packages</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
            Pick a service from the list, then add packages to your cart. Catering lets you set guest
            count and add Veg or Non-Veg separately.
          </p>
        </div>

        <div className="mb-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {SHOP_SERVICES.map((service) => (
            <ServiceKpiCard
              key={service.id}
              service={service}
              active={selectedId === service.id}
              onSelect={() => {
                startTransition(() => setSelectedId(service.id))
                requestAnimationFrame(() => {
                  document.getElementById('service-packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                })
              }}
            />
          ))}
        </div>

        <div id="service-packages" className="scroll-mt-28 min-w-0 border-t border-[#8e1454]/10 pt-10">
          <ServicePackagesHeader service={selectedService} />

          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {selectedService.packages.map((pkg, packageIndex) => {
              if (selectedService.id === 'catering' && isCateringPackage(pkg)) {
                return (
                  <CateringPackageRow
                    key={pkg.id}
                    service={selectedService}
                    pkg={pkg}
                    packageIndex={packageIndex}
                    onAdded={() => setCartOpen(true)}
                  />
                )
              }

              const inCart = hasPackage(pkg.id)
              const thumb = getPackageImage(selectedService.id, packageIndex)
              return (
                <PackageKpiCard
                  key={pkg.id}
                  pkg={pkg}
                  service={selectedService}
                  thumb={thumb}
                  inCart={inCart}
                  onAdd={() => {
                    addPackage(selectedService, pkg, packageIndex)
                    setCartOpen(true)
                  }}
                  onRemove={() => removePackage(pkg.id)}
                />
              )
            })}
          </ul>
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          GST, travel, peak-date premiums, and minimum guest counts may apply. Catering totals =
          per-person rate × guest count. Final quotes are confirmed with your matched vendor.
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#8e1454]/15 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3a2f32]"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#8e1454] text-white">
              <ShoppingBag className="h-4 w-4" />
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold text-[#3a2f32]">
                  {count}
                </span>
              ) : null}
            </span>
            <span>
              {count === 0
                ? 'Cart empty'
                : `${count} package${count === 1 ? '' : 's'} · ${formatInr(total)}`}
            </span>
          </button>
          <Link
            to={count > 0 ? checkoutPath : '#'}
            state={count > 0 ? checkoutState : undefined}
            onClick={(e) => {
              if (count === 0) e.preventDefault()
            }}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              count > 0
                ? 'bg-[#8e1454] text-white hover:bg-[#7a1048]'
                : 'cursor-not-allowed bg-[#d8c9ce]/40 text-muted'
            }`}
          >
            Request booking
          </Link>
        </div>
      </div>

      {cartOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 bg-black/40"
            onClick={() => setCartOpen(false)}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#8e1454]/10 px-5 py-4">
              <h2 className="font-display text-xl text-[#3a2f32]">Your cart</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-full p-1.5 hover:bg-[#fff8f9]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="text-sm text-muted">
                  No packages yet — open a service and tap Add to cart.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {items.map((item) => (
                    <li
                      key={item.packageId}
                      className="overflow-hidden rounded-xl border border-[#8e1454]/12"
                    >
                      <div className="flex gap-3 p-3">
                        <img
                          src={item.image}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold tracking-wide text-[#8e1454] uppercase">
                                {item.serviceName}
                              </p>
                              <p className="font-medium text-[#3a2f32]">{item.packageName}</p>
                              {item.guestCount != null && item.unitPrice != null ? (
                                <p className="mt-1 text-xs text-muted">
                                  {formatInr(item.unitPrice)} × {item.guestCount} guests
                                </p>
                              ) : null}
                              <p className="mt-1 text-sm font-semibold text-[#8e1454]">
                                {formatInr(item.price)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removePackage(item.packageId)}
                              className="shrink-0 text-xs text-muted underline hover:text-[#8e1454]"
                            >
                              Remove
                            </button>
                          </div>
                          {item.guestCount != null && item.unitPrice != null ? (
                            <CartGuestInput
                              lineId={item.packageId}
                              guestCount={item.guestCount}
                              onCommit={updateCateringGuests}
                            />
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-[#8e1454]/10 px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted">Estimated total</span>
                <span className="font-semibold text-[#3a2f32]">{formatInr(total)}</span>
              </div>
              <div className="flex gap-2">
                {items.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="rounded-full border border-[#8e1454]/20 px-4 py-2.5 text-sm font-medium text-[#3a2f32]"
                  >
                    Clear
                  </button>
                ) : null}
                <Link
                  to={items.length > 0 ? checkoutPath : '#'}
                  state={items.length > 0 ? checkoutState : undefined}
                  onClick={(e) => {
                    if (items.length === 0) e.preventDefault()
                  }}
                  className={`flex-1 rounded-full py-2.5 text-center text-sm font-semibold ${
                    items.length > 0
                      ? 'bg-[#8e1454] text-white hover:bg-[#7a1048]'
                      : 'cursor-not-allowed bg-[#d8c9ce]/40 text-muted'
                  }`}
                >
                  Continue to booking
                </Link>
              </div>
              <p className="mt-2 text-[11px] text-muted">
                You&apos;ll confirm date, city, and details on the next step. Cart is saved on this
                device.
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
