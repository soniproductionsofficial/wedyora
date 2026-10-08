import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getVendorSession } from '../../lib/vendorOtp'
import { getApplication, PIPELINE, type VendorApplication, type VendorStage } from '../../lib/vendorOnboarding'
import { cn } from '../../lib/cn'

const vendorDone = ['otp', 'category', 'profile', 'documents', 'portfolio', 'agreement', 'credentials']

const adminFlow: VendorStage[] = [
  'doc_verification',
  'skill_evaluation',
  'interview',
  'trial',
  'final_approval',
  'training',
  'active',
]

export function VendorStatus() {
  const session = getVendorSession()
  const [app, setApp] = useState<VendorApplication | null>(null)
  const [loading, setLoading] = useState(true)

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
  if (!app.hasPassword) return <Navigate to="/vendor/credentials" replace />
  if (app.stage === 'active' && !app.bankComplete) return <Navigate to="/vendor/bank" replace />

  function stateFor(id: string) {
    if (vendorDone.includes(id)) return 'done'
    if (id === 'bank') {
      if (app!.bankComplete) return 'done'
      if (app!.stage === 'active') return 'current'
      return 'locked'
    }
    if (id === 'ranking') {
      if (app!.rank !== 'none') return 'done'
      if (app!.stage === 'active' && app!.bankComplete) return 'current'
      return 'locked'
    }
    if (app!.stage === 'rejected') return id === 'doc_verification' ? 'current' : 'locked'
    if (app!.stage === 'active' && adminFlow.includes(id as VendorStage)) return 'done'
    if (id === app!.stage) return 'current'
    if (
      app!.stage === 'final_approval' &&
      (id === 'trial' || id === 'doc_verification' || id === 'skill_evaluation' || id === 'interview')
    ) {
      return 'done'
    }
    const i = adminFlow.indexOf(id as VendorStage)
    const c = adminFlow.indexOf(app!.stage)
    if (i >= 0 && c >= 0 && i < c) return 'done'
    return 'locked'
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
      <h1 className="font-display text-4xl text-[#3a2f32]">{app.businessName}</h1>
      <p className="mt-2 text-sm text-[#8e1454]">
        Vendor ID · <span className="font-semibold uppercase tracking-wider">{app.vendorId}</span>
      </p>
      <ol className="mt-8 space-y-3">
        {PIPELINE.map((item) => {
          const state = stateFor(item.id)
          return (
            <li
              key={item.label}
              className={cn(
                'rounded-xl border px-4 py-3 text-sm',
                state === 'current' && 'border-[#8e1454] bg-blush text-[#8e1454]',
                state === 'done' && 'border-[#8e1454]/20 bg-white text-[#3a2f32]',
                state === 'locked' && 'border-black/5 bg-[#fafafa] text-muted',
              )}
            >
              <span className="font-medium">{item.label}</span>
              <span className="ml-2 text-xs uppercase tracking-[0.12em]">
                {item.owner} · {state}
              </span>
            </li>
          )
        })}
      </ol>
      {app.stage === 'active' && app.bankComplete && (
        <Link to="/vendor/dashboard" className="mt-8 inline-block text-sm font-semibold text-[#8e1454]">
          Open vendor desk
        </Link>
      )}
    </div>
  )
}
