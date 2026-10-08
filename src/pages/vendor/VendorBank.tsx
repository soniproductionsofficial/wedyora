import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { getVendorSession } from '../../lib/vendorOtp'
import { completeBank, getApplication, type VendorApplication } from '../../lib/vendorOnboarding'
import { saveBankChequeMedia } from '../../lib/vendorMedia'

const field =
  'mt-1.5 w-full rounded-lg border border-[#d8c9ce] bg-white px-4 py-2.5 text-sm text-[#3a2f32] outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20'

export function VendorBank() {
  const navigate = useNavigate()
  const session = getVendorSession()
  const [app, setApp] = useState<VendorApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [accountHolder, setAccountHolder] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifsc, setIfsc] = useState('')
  const [cheque, setCheque] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }
    void getApplication(session.mobile).then((row) => {
      setApp(row)
      setLoading(false)
    })
  }, [session])

  if (!session) return <Navigate to="/vendor/login" replace />
  if (loading) return <div className="px-5 py-10 text-sm text-muted">Loading…</div>
  if (!app) return <Navigate to="/vendor/register" replace />
  if (app.stage !== 'active') return <Navigate to="/vendor/status" replace />
  if (app.bankComplete) return <Navigate to="/vendor/dashboard" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!cheque) {
      setError('Upload cancelled cheque / bank proof.')
      return
    }
    setSaving(true)
    try {
      const chequePath = await saveBankChequeMedia(app!.vendorId, cheque)
      await completeBank(session!.mobile, {
        accountHolder,
        bankName,
        accountNumber,
        ifsc,
        chequeFileName: cheque.name,
        chequePath,
      })
      navigate('/vendor/dashboard')
    } catch (err) {
      console.error(err)
      setError('Could not save bank details. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-10 lg:px-8">
      <h1 className="font-display text-4xl text-[#3a2f32]">Payment setup</h1>
      <p className="mt-2 text-sm text-[#8e1454]">
        Vendor ID · <span className="font-semibold uppercase tracking-wider">{app.vendorId}</span>
      </p>
      <p className="mt-1 text-xs text-muted">All bank details are saved for payouts and admin review.</p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-2xl border border-[#8e1454]/12 bg-white p-6">
        <label className="text-sm text-[#3a2f32]">
          Account holder name
          <input required className={field} value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} />
        </label>
        <label className="text-sm text-[#3a2f32]">
          Bank name
          <input required className={field} value={bankName} onChange={(e) => setBankName(e.target.value)} />
        </label>
        <label className="text-sm text-[#3a2f32]">
          Account number
          <input required className={field} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
        </label>
        <label className="text-sm text-[#3a2f32]">
          IFSC
          <input required className={field} value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
        </label>
        <label className="text-sm text-[#3a2f32]">
          Cancelled cheque / bank proof
          <input
            required
            type="file"
            accept="image/*,.pdf"
            className="mt-1.5 block text-xs"
            onChange={(e) => setCheque(e.target.files?.[0] ?? null)}
          />
          {cheque && <span className="mt-1 block text-xs text-muted">{cheque.name}</span>}
        </label>
        {error && <p className="text-sm text-[#8e1454]">{error}</p>}
        <div>
          <Button type="submit" className="rounded-md px-6 py-2.5" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  )
}
