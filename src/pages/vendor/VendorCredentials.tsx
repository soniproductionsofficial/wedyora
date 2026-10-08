import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import vendorLoginImg from '../../assets/vendor-login.jpg'
import { getApplication, setVendorPassword, type VendorApplication } from '../../lib/vendorOnboarding'
import { clearPendingMobile, getPendingMobile, getVendorSession, setVendorSession } from '../../lib/vendorOtp'

const field =
  'mt-1.5 w-full rounded-lg border border-[#d8c9ce] bg-white px-4 py-2.5 text-sm text-[#3a2f32] outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20'

export function VendorCredentials() {
  const navigate = useNavigate()
  const session = getVendorSession()
  const pending = getPendingMobile()
  const mobile = session?.mobile || pending || ''
  const [app, setApp] = useState<VendorApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!mobile) {
      setLoading(false)
      return
    }
    void getApplication(mobile).then((row) => {
      setApp(row)
      setLoading(false)
    })
  }, [mobile])

  if (loading) {
    return <div className="px-5 py-16 text-sm text-muted">Loading…</div>
  }

  if (!app) return <Navigate to="/vendor/register" replace />
  if (app.hasPassword && !done) return <Navigate to="/vendor/status" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSaving(true)
    try {
      const ok = await setVendorPassword(app!.vendorId, password)
      if (!ok) {
        setError('Could not save password. Try again.')
        return
      }
      setVendorSession(app!.mobile, app!.vendorId)
      clearPendingMobile()
      setDone(true)
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 lg:px-8">
        <div className="rounded-2xl border border-[#8e1454]/15 bg-white p-8 text-center shadow-[0_12px_40px_rgba(142,20,84,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8e1454]">Account ready</p>
          <h1 className="mt-3 font-display text-3xl text-[#3a2f32]">Save your login details</h1>
          <p className="mt-4 rounded-xl bg-blush px-4 py-4 text-sm text-[#3a2f32]">
            Vendor ID
            <span className="mt-1 block font-display text-3xl uppercase tracking-wider text-[#8e1454]">{app.vendorId}</span>
          </p>
          <p className="mt-3 text-sm text-muted">Use this Vendor ID and your password the next time you sign in.</p>
          <Button className="mt-8 rounded-md px-6 py-2.5" onClick={() => navigate('/vendor/status')}>
            Continue to status
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-[calc(100dvh-4.75rem)] lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#fff8f9] lg:block">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="h-full max-h-[36rem] w-full max-w-md overflow-hidden rounded-[999px] border-[6px] border-white shadow-[0_24px_60px_rgba(142,20,84,0.18)]">
            <img src={vendorLoginImg} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </aside>

      <div className="flex items-center justify-center bg-[#fff8f9] px-5 py-16">
        <div className="w-full max-w-md rounded-2xl border border-[#8e1454]/10 bg-white p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8e1454]">Create login</p>
          <h1 className="mt-2 font-display text-3xl text-[#3a2f32]">Your Vendor ID</h1>
          <p className="mt-4 rounded-xl bg-blush px-4 py-3 text-center">
            <span className="text-xs uppercase tracking-[0.14em] text-muted">User ID</span>
            <span className="mt-1 block font-display text-3xl uppercase tracking-wider text-[#8e1454]">{app.vendorId}</span>
          </p>
          <p className="mt-3 text-sm text-muted">Set a password for this ID. Next visits use Vendor ID + password only.</p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <label className="text-sm text-[#3a2f32]">
              Password
              <input
                required
                type="password"
                autoComplete="new-password"
                className={field}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className="text-sm text-[#3a2f32]">
              Confirm password
              <input
                required
                type="password"
                autoComplete="new-password"
                className={field}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
            {error && <p className="text-sm text-[#8e1454]">{error}</p>}
            <Button type="submit" className="rounded-md" disabled={saving}>
              {saving ? 'Saving…' : 'Save password'}
            </Button>
          </form>

          <p className="mt-6 text-sm">
            Already have a password?{' '}
            <Link to="/vendor/login" className="font-semibold text-[#8e1454]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
