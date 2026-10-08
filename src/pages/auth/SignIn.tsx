import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { SectionEyebrow } from '../../components/Ornament'

const field =
  'w-full rounded-xl border border-gold/35 bg-blush px-4 py-3 text-sm text-[#3a2f32] outline-none focus:ring-2 focus:ring-[#8e1454]/30'

export function SignIn({
  role,
  registerTo,
}: {
  role: 'Customer' | 'Vendor' | 'Admin'
  registerTo?: string
}) {
  const navigate = useNavigate()
  const [otpSent, setOtpSent] = useState(false)
  const [done, setDone] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!otpSent && role !== 'Admin') {
      setOtpSent(true)
      return
    }
    if (role === 'Admin') {
      sessionStorage.setItem('wedyora-admin', '1')
      navigate('/admin/verification')
      return
    }
    setDone(true)
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16 lg:px-8">
      <SectionEyebrow>{`${role} portal`}</SectionEyebrow>
      <h1 className="mt-3 font-display text-4xl text-gold">{role} sign in</h1>
      <p className="mt-3 text-sm text-muted">
        {role === 'Vendor'
          ? 'Sign in to manage bookings, packages, and payouts.'
          : role === 'Admin'
            ? 'Operations desk for verification, jobs, and commissions.'
            : 'Sign in to book vendors, track jobs, and save your wishlist.'}
      </p>

      {done ? (
        <p className="mt-8 font-display text-2xl text-[#8e1454]">You are signed in as {role}.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 grid gap-3">
          {role === 'Admin' ? (
            <>
              <input required type="email" placeholder="Work email" className={field} />
              <input required type="password" placeholder="Password" className={field} />
            </>
          ) : (
            <>
              <input required placeholder="Mobile number" className={field} />
              {otpSent && <input required placeholder="Enter OTP" className={field} />}
              <p className="text-xs text-muted">Or use email and password</p>
              <input type="email" placeholder="Email" className={field} />
              <input type="password" placeholder="Password" className={field} />
            </>
          )}
          <Button type="submit">{otpSent || role === 'Admin' ? 'Sign in' : 'Send OTP'}</Button>
        </form>
      )}

      {registerTo && (
        <p className="mt-6 text-sm text-[#3a2f32]">
          New to Wedyora?{' '}
          <Link to={registerTo} className="font-semibold text-[#8e1454] underline underline-offset-2">
            Register as {role.toLowerCase()}
          </Link>
        </p>
      )}
    </div>
  )
}
