import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { PartnerHeroBackground } from '../../components/vendor/PartnerHeroBackground'
import { PartnerPortalHero } from '../../components/vendor/PartnerPortalHero'
import { loginWithUserOrEmail } from '../../lib/vendorOnboarding'
import { setVendorSession } from '../../lib/vendorOtp'

const field =
  'mt-1.5 w-full rounded-lg border border-[#d8c9ce] bg-white px-4 py-2.5 text-sm text-[#3a2f32] outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20'

export function VendorLogin() {
  const navigate = useNavigate()
  const [userOrEmail, setUserOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const app = await loginWithUserOrEmail(userOrEmail, password)
    if (!app) {
      setError('Invalid Vendor ID / email or password.')
      return
    }
    setVendorSession(app.mobile, app.vendorId)
    navigate('/vendor/dashboard')
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#fff8f9]">
      <PartnerHeroBackground version={10} />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-7xl flex-col gap-8 px-5 pb-10 pt-5 sm:pt-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:px-10 lg:pt-7 xl:px-14">
        <div className="w-full lg:max-w-[46%]">
          <PartnerPortalHero />
        </div>

        <div className="w-full max-w-md shrink-0 lg:mt-14 lg:ml-auto rounded-2xl border border-[#8e1454]/12 bg-white p-8 shadow-[0_20px_50px_rgba(142,20,84,0.12)] sm:p-9">
          <div className="flex justify-center">
            <Logo className="h-10 w-44" />
          </div>

          <p className="mt-6 text-center text-[11px] font-semibold tracking-[0.22em] text-[#8e1454] uppercase">
            Partner portal
          </p>
          <h1 className="mt-2 text-center font-display text-3xl text-[#3a2f32]">Sign in</h1>
          <p className="mt-2 text-center text-sm text-muted">
            Vendor ID or email and password for your partner desk.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <label className="text-sm text-[#3a2f32]">
              Vendor ID or email
              <input
                required
                autoComplete="username"
                placeholder="wed-001 or email"
                className={field}
                value={userOrEmail}
                onChange={(e) => setUserOrEmail(e.target.value)}
              />
            </label>
            <label className="text-sm text-[#3a2f32]">
              Password
              <input
                required
                type="password"
                autoComplete="current-password"
                className={field}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error ? <p className="text-sm text-[#8e1454]">{error}</p> : null}
            <button
              type="submit"
              className="mt-1 w-full rounded-md bg-[#8e1454] px-6 py-3 text-sm font-semibold tracking-[0.14em] text-white uppercase transition hover:bg-[#7a1048]"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#3a2f32]">
            First time?{' '}
            <Link to="/vendor/join" className="font-semibold text-[#8e1454] hover:underline">
              Register as partner
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
