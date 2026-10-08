import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../Button'
import { Logo } from '../Logo'
import { cn } from '../../lib/cn'
import { getApplication, loginWithUserOrEmail } from '../../lib/vendorOnboarding'
import {
  normalizeMobile,
  sendVendorOtp,
  setPendingMobile,
  setVendorSession,
  verifyVendorOtp,
} from '../../lib/vendorOtp'

const field =
  'mt-1.5 w-full rounded-lg border border-[#d8c9ce] bg-white px-4 py-2.5 text-sm text-[#3a2f32] outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20'

type PartnerJoinCardProps = {
  className?: string
  footer?: ReactNode
}

export function PartnerJoinCard({ className, footer }: PartnerJoinCardProps) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'register' | 'signin'>('register')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [userOrEmail, setUserOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  function switchMode(next: 'register' | 'signin') {
    setMode(next)
    setError('')
    setNotice('')
    setOtp('')
    setPassword('')
    setUserOrEmail('')
    setOtpSent(false)
  }

  async function onSendOtp() {
    setError('')
    setSending(true)
    try {
      const result = await sendVendorOtp(mobile)
      if (!result.ok) {
        setError(result.message)
        return
      }
      setOtpSent(true)
      setNotice(result.message)
    } catch (cause) {
      console.error('Partner OTP request failed', cause)
      setError('Could not contact the partner service. Check the Supabase URL and your connection, then try again.')
    } finally {
      setSending(false)
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setNotice('')

    if (mode === 'signin') {
      try {
        const app = await loginWithUserOrEmail(userOrEmail, password)
        if (!app) {
          setError('Invalid Vendor ID / email or password.')
          return
        }
        setVendorSession(app.mobile, app.vendorId)
        navigate('/vendor/dashboard')
      } catch (cause) {
        console.error('Partner sign-in failed', cause)
        setError('Could not contact the partner service. Check the Supabase URL and your connection, then try again.')
      }
      return
    }

    const phone = normalizeMobile(mobile)
    if (phone.length !== 10) {
      setError('Enter a 10-digit mobile number.')
      return
    }
    if (!otpSent) {
      void onSendOtp()
      return
    }
    if (!verifyVendorOtp(phone, otp)) {
      setError('Invalid OTP. Please try again.')
      return
    }
    try {
      const existing = await getApplication(phone)
      if (existing?.hasPassword) {
        setError('This number already has an account. Use Sign in with Vendor ID or email.')
        return
      }
      setPendingMobile(phone)
      setVendorSession(phone, existing?.vendorId)
      navigate('/vendor/register')
    } catch (cause) {
      console.error('Partner application lookup failed', cause)
      setError('Could not contact the partner service. Check the Supabase URL and your connection, then try again.')
    }
  }

  return (
    <div
      className={cn(
        'w-full max-w-md rounded-2xl border border-[#8e1454]/12 bg-white p-8 shadow-[0_20px_50px_rgba(142,20,84,0.12)] sm:p-9',
        className,
      )}
    >
      <div className="flex justify-center">
        <Logo className="h-10 w-44 sm:h-11 sm:w-48" />
      </div>
      <h2 className="mt-6 text-center font-display text-3xl text-[#3a2f32]">Become a Wedyora Partner</h2>
      <p className="mt-2 text-center text-sm text-muted">
        {mode === 'register' ? 'Register with mobile OTP.' : 'Sign in with Vendor ID or email and password.'}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg border border-[#8e1454]/20 bg-blush p-1">
        <button
          type="button"
          onClick={() => switchMode('register')}
          className={cn(
            'rounded-md px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
            mode === 'register' ? 'bg-[#8e1454] text-white' : 'text-[#8e1454] hover:bg-white',
          )}
        >
          Register
        </button>
        <button
          type="button"
          onClick={() => switchMode('signin')}
          className={cn(
            'rounded-md px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
            mode === 'signin' ? 'bg-[#8e1454] text-white' : 'text-[#8e1454] hover:bg-white',
          )}
        >
          Sign in
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        {mode === 'register' ? (
          <>
            <label className="text-sm text-[#3a2f32]">
              Mobile number
              <input
                required
                inputMode="numeric"
                autoComplete="tel"
                placeholder="10-digit mobile"
                className={field}
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value)
                  setOtpSent(false)
                  setOtp('')
                }}
              />
            </label>
            {otpSent ? (
              <label className="text-sm text-[#3a2f32]">
                OTP
                <input
                  required
                  inputMode="numeric"
                  className={field}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </label>
            ) : null}
          </>
        ) : (
          <>
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
          </>
        )}

        {notice ? <p className="text-sm text-[#3a2f32]">{notice}</p> : null}
        {error ? <p className="text-sm text-[#8e1454]">{error}</p> : null}

        <Button type="submit" className="rounded-md" disabled={sending}>
          {mode === 'register'
            ? otpSent
              ? 'Verify OTP & continue'
              : sending
                ? 'Sending…'
                : 'Send OTP'
            : 'Sign in'}
        </Button>
      </form>

      {footer}
    </div>
  )
}
