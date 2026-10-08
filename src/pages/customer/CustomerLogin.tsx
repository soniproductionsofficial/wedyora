import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { CustomerFlowOrbit } from '../../components/customer/CustomerFlowOrbit'
import { CustomerLoginMehendiBg } from '../../components/customer/CustomerLoginMehendiBg'
import { cn } from '../../lib/cn'
import {
  DEMO_CUSTOMER_OTP,
  getCustomerSession,
  normalizeMobile,
  sendCustomerOtp,
  setCustomerSession,
  verifyCustomerOtp,
} from '../../lib/customerOtp'

const field =
  'mt-1.5 w-full rounded-lg border border-[#d8c9ce] bg-white px-4 py-2.5 text-sm text-[#3a2f32] outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20'

export function CustomerLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const existing = getCustomerSession()
  const returnTo = (location.state as { from?: string } | null)?.from ?? '/services'

  const [mobile, setMobile] = useState(existing?.mobile ?? '')
  const [name, setName] = useState(existing?.name ?? '')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  if (existing) {
    return <Navigate to={returnTo} replace />
  }

  async function onSendOtp() {
    setError('')
    setSending(true)
    const result = await sendCustomerOtp(mobile)
    setSending(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setOtpSent(true)
    setNotice(`OTP sent. Demo code: ${DEMO_CUSTOMER_OTP}`)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const phone = normalizeMobile(mobile)
    if (phone.length !== 10) {
      setError('Enter a 10-digit mobile number.')
      return
    }
    if (!otpSent) {
      void onSendOtp()
      return
    }
    if (!verifyCustomerOtp(phone, otp)) {
      setError('Invalid OTP. Please try again.')
      return
    }
    setCustomerSession(phone, name)
    navigate(returnTo, { replace: true })
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-4.75rem)] items-center justify-center bg-[#fff0f3] px-4 py-8 sm:px-6">
      <CustomerLoginMehendiBg variant="page" />

      <div className="relative z-10 w-full max-w-[920px] overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-white/55 p-6 shadow-[0_20px_60px_rgba(142,20,84,0.12)] backdrop-blur-[2px] sm:p-8 lg:p-9">
        <CustomerLoginMehendiBg variant="card" />

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Journey + flow */}
          <div className="order-2 flex flex-col items-center border-[#8e1454]/10 pb-2 text-center lg:order-1 lg:items-start lg:border-r lg:pr-8 lg:text-left">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#8e1454] uppercase">
              Your booking journey
            </p>
            <h1 className="mt-2 font-display text-2xl leading-snug text-[#3a2f32] sm:text-[1.65rem]">
              Four steps from sign in to celebration
            </h1>
            <CustomerFlowOrbit className="mt-5 w-full max-w-[390px] sm:max-w-[420px]" />
          </div>

          {/* Sign in */}
          <div className="order-1 w-full max-w-sm justify-self-center lg:order-2 lg:max-w-none lg:justify-self-auto">
            <div className="flex justify-center">
              <Logo className="h-10 w-44" />
            </div>
            <h2 className="mt-5 text-center font-display text-2xl text-[#3a2f32] sm:text-3xl">Customer sign in</h2>
            <p className="mt-1.5 text-center text-sm text-muted">Mobile OTP — no password needed</p>

            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <label className="block text-sm text-[#3a2f32]">
                Your name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Optional — for booking"
                  className={field}
                />
              </label>
              <label className="block text-sm text-[#3a2f32]">
                Mobile number
                <input
                  required
                  inputMode="numeric"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile"
                  className={field}
                />
              </label>
              {otpSent && (
                <label className="block text-sm text-[#3a2f32]">
                  OTP
                  <input
                    required
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit OTP"
                    className={field}
                  />
                </label>
              )}
              {notice && <p className="text-xs text-[#8e1454]">{notice}</p>}
              {error && <p className="text-sm font-medium text-[#8e1454]">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className={cn(
                  'w-full rounded-md bg-[#8e1454] px-4 py-3 text-sm font-semibold tracking-[0.12em] text-white uppercase transition hover:bg-[#7a1048]',
                  sending && 'opacity-70',
                )}
              >
                {sending ? 'Sending…' : otpSent ? 'Verify & continue' : 'Send OTP'}
              </button>
              {otpSent && (
                <button
                  type="button"
                  onClick={() => void onSendOtp()}
                  className="w-full text-xs font-medium text-[#8e1454] underline underline-offset-2"
                >
                  Resend OTP
                </button>
              )}
            </form>

            <p className="mt-5 text-center text-sm text-muted">
              Want to partner with us?{' '}
              <Link to="/vendor/join" className="font-semibold text-[#8e1454]">
                Become a vendor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
