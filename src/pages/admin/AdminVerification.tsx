import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ArrowLeft, Check, Eye, FileText, X } from 'lucide-react'
import { Button } from '../../components/Button'
import { isAdminLoggedIn } from '../../lib/adminAuth'
import { cn } from '../../lib/cn'
import {
  isImageMime,
  isVideoMime,
  loadVendorMedia,
  type StoredMediaFile,
} from '../../lib/vendorMedia'
import {
  advanceStage,
  categoryLabel,
  listApplications,
  setVendorRank,
  type VendorApplication,
  type VendorRank,
  type VendorStage,
  rankLabel,
} from '../../lib/vendorOnboarding'

const NEXT: Partial<Record<VendorStage, VendorStage>> = {
  doc_verification: 'skill_evaluation',
  skill_evaluation: 'interview',
  interview: 'trial',
  trial: 'training',
  final_approval: 'training',
  training: 'active',
}

const ACTION: Partial<Record<VendorStage, string>> = {
  doc_verification: 'Pass Level 1 · documents',
  skill_evaluation: 'Pass Level 2 · portfolio',
  interview: 'Pass Level 3 · interview',
  trial: 'Pass Level 4 · quality check',
  final_approval: 'Approve & send to training',
  training: 'Complete training & activate',
}

const VERIFY_STEPS: { stage: VendorStage; label: string; detail: string }[] = [
  { stage: 'doc_verification', label: 'Level 1', detail: 'Documents' },
  { stage: 'skill_evaluation', label: 'Level 2', detail: 'Portfolio' },
  { stage: 'interview', label: 'Level 3', detail: 'Interview' },
  { stage: 'trial', label: 'Level 4', detail: 'Quality check' },
  { stage: 'training', label: 'Training', detail: 'Guidelines' },
  { stage: 'active', label: 'Active', detail: 'Go live' },
]

const STAGE_ORDER: VendorStage[] = [
  'documents',
  'doc_verification',
  'skill_evaluation',
  'interview',
  'trial',
  'final_approval',
  'training',
  'active',
]

function stageRank(stage: VendorStage) {
  return STAGE_ORDER.indexOf(stage)
}

function stepStatus(appStage: VendorStage, stepStage: VendorStage): 'done' | 'current' | 'upcoming' | 'rejected' {
  if (appStage === 'rejected') return 'rejected'
  const a = stageRank(appStage)
  const s = stageRank(stepStage)
  if (appStage === 'active' && stepStage === 'active') return 'done'
  if (a > s) return 'done'
  if (a === s) return 'current'
  return 'upcoming'
}

function stageBadgeClass(stage: VendorStage) {
  if (stage === 'active') return 'bg-emerald-50 text-emerald-800'
  if (stage === 'rejected') return 'bg-red-50 text-red-700'
  return 'bg-[#fff8f9] text-[#8e1454]'
}

export function AdminVerification() {
  const [tick, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)
  const [apps, setApps] = useState<VendorApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [preview, setPreview] = useState<{ url: string; name: string; kind: 'image' | 'video' | 'file' } | null>(
    null,
  )

  useEffect(() => {
    void listApplications()
      .then(setApps)
      .finally(() => setLoading(false))
  }, [tick])

  const selectedApp = useMemo(
    () => (selectedId ? apps.find((a) => a.vendorId === selectedId) ?? null : null),
    [apps, selectedId],
  )

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  function openBlob(file: StoredMediaFile) {
    if (preview?.url) URL.revokeObjectURL(preview.url)
    const url = URL.createObjectURL(file.blob)
    const kind = isImageMime(file.mime, file.fileName)
      ? 'image'
      : isVideoMime(file.mime, file.fileName)
        ? 'video'
        : 'file'
    setPreview({ url, name: `${file.label} · ${file.fileName}`, kind })
  }

  function closePreview() {
    if (preview?.url) URL.revokeObjectURL(preview.url)
    setPreview(null)
  }

  function closeDetail() {
    setSelectedId(null)
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      {!selectedApp ? (
        <>
          <h1 className="font-display text-3xl text-[#3a2f32]">Partners</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            All registered partners from Supabase. Use the eye icon to open verification and review documents.
          </p>

          {loading && <p className="mt-4 text-sm text-muted">Loading partners…</p>}

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#8e1454]/12 bg-white shadow-sm">
            {apps.length === 0 ? (
              <p className="p-6 text-sm text-muted">No applications yet. A vendor must register first.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#8e1454]/10 bg-[#fff8f9] text-[11px] uppercase tracking-wider text-muted">
                      <th className="px-5 py-3 font-semibold">Vendor ID</th>
                      <th className="px-5 py-3 font-semibold">Vendor name</th>
                      <th className="px-5 py-3 font-semibold">Business</th>
                      <th className="px-5 py-3 font-semibold">Contact</th>
                      <th className="px-5 py-3 font-semibold">City</th>
                      <th className="px-5 py-3 font-semibold">Category</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold text-right">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apps.map((app) => (
                      <tr key={app.vendorId} className="border-b border-[#8e1454]/05 transition hover:bg-[#fffdfd]">
                        <td className="px-5 py-3.5 font-semibold text-[#8e1454]">{app.vendorId}</td>
                        <td className="px-5 py-3.5 font-medium text-[#3a2f32]">{app.contactName || '—'}</td>
                        <td className="px-5 py-3.5 font-medium text-[#3a2f32]">{app.businessName}</td>
                        <td className="px-5 py-3.5 text-muted">{app.mobile}</td>
                        <td className="px-5 py-3.5 text-muted">{app.city || '—'}</td>
                        <td className="px-5 py-3.5 text-muted">{categoryLabel(app.category)}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              'inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                              stageBadgeClass(app.stage),
                            )}
                          >
                            {app.stage.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            aria-label={`View ${app.businessName}`}
                            title="View details"
                            onClick={() => setSelectedId(app.vendorId)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#8e1454] text-[#8e1454] transition hover:bg-[#8e1454] hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : (
        <PartnerDetailPanel
          app={selectedApp}
          onClose={closeDetail}
          onAdvance={async (stage) => {
            await advanceStage(selectedApp.mobile, stage)
            refresh()
          }}
          onRank={async (rank, score) => {
            await setVendorRank(selectedApp.mobile, rank, score)
            refresh()
          }}
          onPreview={openBlob}
        />
      )}

      {preview && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal>
          <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
              <p className="truncate text-sm font-medium text-[#3a2f32]">{preview.name}</p>
              <button type="button" className="text-sm font-semibold text-[#8e1454]" onClick={closePreview}>
                Close
              </button>
            </div>
            <div className="max-h-[80vh] overflow-auto bg-[#fafafa] p-4">
              {preview.kind === 'image' ? (
                <img src={preview.url} alt={preview.name} className="mx-auto max-h-[75vh] max-w-full object-contain" />
              ) : preview.kind === 'video' ? (
                <video src={preview.url} controls className="mx-auto max-h-[75vh] max-w-full" />
              ) : (
                <a href={preview.url} download className="text-sm font-semibold text-[#8e1454]">
                  Download file
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PartnerDetailPanel({
  app,
  onClose,
  onAdvance,
  onRank,
  onPreview,
}: {
  app: VendorApplication
  onClose: () => void
  onAdvance: (stage: VendorStage) => void | Promise<void>
  onRank: (rank: VendorRank, score: number) => void | Promise<void>
  onPreview: (file: StoredMediaFile) => void
}) {
  const [media, setMedia] = useState<StoredMediaFile[]>([])
  const [loadingMedia, setLoadingMedia] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoadingMedia(true)
    void loadVendorMedia(app.vendorId).then((rows) => {
      if (!cancelled) {
        setMedia(rows)
        setLoadingMedia(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [app.vendorId])

  const docs = useMemo(() => media.filter((m) => m.group === 'doc'), [media])
  const photos = useMemo(() => media.filter((m) => m.group === 'portfolioPhoto'), [media])
  const videos = useMemo(() => media.filter((m) => m.group === 'portfolioVideo'), [media])
  const clientWork = useMemo(() => media.filter((m) => m.group === 'clientWork'), [media])
  const studioWork = useMemo(() => media.filter((m) => m.group === 'studioWork'), [media])
  const profile = useMemo(() => media.find((m) => m.group === 'profile'), [media])
  const bankCheque = useMemo(() => media.find((m) => m.group === 'bankCheque'), [media])

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-[#8e1454]/15 bg-white shadow-[0_8px_24px_rgba(142,20,84,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#8e1454]/10 bg-[#fff8f9] px-5 py-4">
        <div>
          <button
            type="button"
            onClick={onClose}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8e1454] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to list
          </button>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e1454]">{app.vendorId}</p>
          <h2 className="mt-1 font-display text-2xl text-[#3a2f32]">{app.businessName}</h2>
          <p className="text-sm text-muted">
            {app.contactName} · {app.city} · {app.mobile}
          </p>
        </div>
        <span
          className={cn(
            'inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider',
            stageBadgeClass(app.stage),
          )}
        >
          {app.stage.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="border-b border-[#8e1454]/08 px-5 py-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Verification steps</p>
        <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {VERIFY_STEPS.map((step) => {
            const status = stepStatus(app.stage, step.stage)
            return (
              <li
                key={step.stage}
                className={cn(
                  'rounded-xl border px-3 py-2.5 text-center',
                  status === 'done' && 'border-emerald-200 bg-emerald-50',
                  status === 'current' && 'border-[#8e1454] bg-[#fff8f9] ring-2 ring-[#8e1454]/20',
                  status === 'upcoming' && 'border-[#e8dce0] bg-[#fafafa]',
                  status === 'rejected' && 'border-red-100 bg-red-50',
                )}
              >
                <span
                  className={cn(
                    'mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                    status === 'done' && 'bg-emerald-600 text-white',
                    status === 'current' && 'bg-[#8e1454] text-white',
                    status === 'upcoming' && 'border border-[#d8c9ce] bg-white text-muted',
                    status === 'rejected' && 'bg-red-500 text-white',
                  )}
                >
                  {status === 'done' ? (
                    <Check className="h-4 w-4" />
                  ) : status === 'rejected' ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    step.label.replace('Level ', 'L')
                  )}
                </span>
                <p className="mt-1.5 text-[11px] font-semibold text-[#3a2f32]">{step.label}</p>
                <p className="text-[10px] text-muted">{step.detail}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider">
                  {status === 'done' && <span className="text-emerald-700">Checked</span>}
                  {status === 'current' && <span className="text-[#8e1454]">In review</span>}
                  {status === 'upcoming' && <span className="text-muted">Pending</span>}
                  {status === 'rejected' && <span className="text-red-600">Stopped</span>}
                </p>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="space-y-6 p-5">
        <div className="grid gap-2 rounded-xl border border-[#8e1454]/10 bg-[#fffdfd] p-4 text-sm text-[#3a2f32] sm:grid-cols-2">
          <p>
            <span className="text-muted">Category · </span>
            {categoryLabel(app.category)}
          </p>
          <p>
            <span className="text-muted">Email · </span>
            {app.email}
          </p>
          <p>
            <span className="text-muted">Experience · </span>
            {app.experience} yrs · Team {app.teamSize}
          </p>
          <p>
            <span className="text-muted">Rank · </span>
            {rankLabel(app.rank)}
            {app.qualityScore != null ? ` · QC ${app.qualityScore}/5` : ''}
          </p>
          <p className="sm:col-span-2">
            <span className="text-muted">Address · </span>
            {app.address}
          </p>
          <p className="sm:col-span-2">
            <span className="text-muted">Equipment · </span>
            {app.equipment || '—'}
          </p>
          <p className="sm:col-span-2">
            <span className="text-muted">Service area · </span>
            {app.city}
            {app.pincode ? ` · ${app.pincode}` : ''}
            {app.area ? ` · ${app.area}` : ''}
            {app.serviceRadiusKm ? ` · ${app.serviceRadiusKm} km` : ''}
          </p>
          <p>
            <span className="text-muted">Files saved · </span>
            {app.mediaSaved ? 'Yes (viewable below)' : 'Names only — ask vendor to re-submit'}
          </p>
          <p>
            <span className="text-muted">Submitted · </span>
            {app.submittedAt ? new Date(app.submittedAt).toLocaleString() : '—'}
          </p>
          {app.bankDetails && (
            <div className="sm:col-span-2 rounded-lg border border-[#8e1454]/10 bg-[#fff8f9] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8e1454]">Bank details (saved)</p>
              <p className="mt-1">
                {app.bankDetails.accountHolder} · {app.bankDetails.bankName}
              </p>
              <p className="text-muted">
                A/C {app.bankDetails.accountNumber} · IFSC {app.bankDetails.ifsc}
              </p>
              {app.bankDetails.chequeFileName && (
                <p className="text-xs text-muted">Cheque file · {app.bankDetails.chequeFileName}</p>
              )}
            </div>
          )}
        </div>

        {profile && <MediaSection title="Profile photo" files={[profile]} onPreview={onPreview} />}

        <MediaSection
          title="KYC documents"
          hint="Level 1 — open each file to verify"
          files={docs}
          fallbackNames={app.docsUploaded.map((d) => ({ label: d.label, fileName: d.fileName }))}
          loading={loadingMedia}
          onPreview={onPreview}
        />

        <MediaSection
          title="Portfolio photographs"
          hint="Level 2 — 5–10 sample photos"
          files={photos}
          fallbackNames={app.portfolioPhotos.map((n, i) => ({ label: `Photo ${i + 1}`, fileName: n }))}
          loading={loadingMedia}
          onPreview={onPreview}
        />

        <MediaSection
          title="Portfolio videos / reels"
          hint="Level 2 — sample videos"
          files={videos}
          fallbackNames={app.portfolioVideos.map((n, i) => ({ label: `Video ${i + 1}`, fileName: n }))}
          loading={loadingMedia}
          onPreview={onPreview}
        />

        {(clientWork.length > 0 || app.portfolioClientWork.length > 0) && (
          <MediaSection
            title="Previous client work"
            files={clientWork}
            fallbackNames={app.portfolioClientWork.map((n, i) => ({ label: `Client ${i + 1}`, fileName: n }))}
            loading={loadingMedia}
            onPreview={onPreview}
          />
        )}

        {(studioWork.length > 0 || app.portfolioStudioWork.length > 0) && (
          <MediaSection
            title="Studio / event / product work"
            files={studioWork}
            fallbackNames={app.portfolioStudioWork.map((n, i) => ({ label: `Studio ${i + 1}`, fileName: n }))}
            loading={loadingMedia}
            onPreview={onPreview}
          />
        )}

        {bankCheque && <MediaSection title="Bank cheque (after activation)" files={[bankCheque]} onPreview={onPreview} />}

        {(app.portfolioLink || app.portfolioVideo) && (
          <div className="rounded-xl border border-[#8e1454]/10 bg-white p-4 text-sm">
            {app.portfolioLink && (
              <p>
                <span className="text-muted">Portfolio link · </span>
                <a href={app.portfolioLink} target="_blank" rel="noreferrer" className="break-all font-medium text-[#8e1454]">
                  {app.portfolioLink}
                </a>
              </p>
            )}
            {app.portfolioVideo && (
              <p className="mt-2">
                <span className="text-muted">Extra video link · </span>
                <a href={app.portfolioVideo} target="_blank" rel="noreferrer" className="break-all font-medium text-[#8e1454]">
                  {app.portfolioVideo}
                </a>
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {app.stage !== 'active' && app.stage !== 'rejected' && NEXT[app.stage] && (
            <Button className="rounded-md py-2" onClick={() => void onAdvance(NEXT[app.stage]!)}>
              {ACTION[app.stage] ?? 'Advance'}
            </Button>
          )}
          {app.stage !== 'rejected' && app.stage !== 'active' && (
            <Button variant="line" className="rounded-md py-2" onClick={() => void onAdvance('rejected')}>
              Reject
            </Button>
          )}
        </div>

        {app.stage === 'active' && !app.bankComplete && (
          <p className="text-sm text-muted">Waiting for vendor to add bank details (after activation).</p>
        )}

        {app.stage === 'active' && app.bankComplete && (
          <form
            className="flex flex-wrap items-end gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                const data = new FormData(e.currentTarget)
                void onRank(data.get('rank') as VendorRank, Number(data.get('score')))
              }}
          >
            <label className="text-xs uppercase tracking-[0.12em] text-[#3a2f32]">
              Rank after QC
              <select
                name="rank"
                defaultValue={app.rank === 'none' ? 'bronze' : app.rank}
                className="mt-1 block rounded-lg border border-[#8e1454]/25 px-3 py-2"
              >
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </label>
            <label className="text-xs uppercase tracking-[0.12em] text-[#3a2f32]">
              Quality score /5
              <input
                name="score"
                type="number"
                min={1}
                max={5}
                step={0.1}
                defaultValue={app.qualityScore ?? 4.5}
                className="mt-1 block w-24 rounded-lg border border-[#8e1454]/25 px-3 py-2"
              />
            </label>
            <Button type="submit" className="rounded-md py-2">
              Save rank
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}

function MediaSection({
  title,
  hint,
  files,
  fallbackNames,
  loading,
  onPreview,
}: {
  title: string
  hint?: string
  files: StoredMediaFile[]
  fallbackNames?: { label: string; fileName: string }[]
  loading?: boolean
  onPreview: (file: StoredMediaFile) => void
}) {
  const [thumbs, setThumbs] = useState<Record<string, string>>({})

  useEffect(() => {
    const urls: string[] = []
    const next: Record<string, string> = {}
    for (const f of files) {
      if (isImageMime(f.mime, f.fileName)) {
        const u = URL.createObjectURL(f.blob)
        urls.push(u)
        next[f.key] = u
      }
    }
    setThumbs(next)
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [files])

  return (
    <section>
      <div className="mb-3">
        <h3 className="font-display text-lg text-[#3a2f32]">{title}</h3>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
      {loading && <p className="text-sm text-muted">Loading files…</p>}
      {!loading && files.length === 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {(fallbackNames ?? []).map((d) => (
            <div
              key={d.fileName + d.label}
              className="flex items-center gap-3 rounded-xl border border-dashed border-[#d8c9ce] bg-white px-3 py-3 text-sm"
            >
              <FileText className="h-5 w-5 shrink-0 text-muted" />
              <div className="min-w-0">
                <p className="font-medium text-[#3a2f32]">{d.label}</p>
                <p className="truncate text-xs text-muted">{d.fileName}</p>
                <p className="mt-0.5 text-[10px] text-amber-700">Name only — re-register vendor to store viewable files</p>
              </div>
            </div>
          ))}
          {(!fallbackNames || fallbackNames.length === 0) && <p className="text-sm text-muted">No files uploaded.</p>}
        </div>
      )}
      {files.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((f) => (
            <div key={f.key} className="overflow-hidden rounded-xl border border-[#8e1454]/12 bg-white">
              <div className="flex h-36 items-center justify-center bg-[#f6f1f3]">
                {thumbs[f.key] ? (
                  <img src={thumbs[f.key]} alt={f.label} className="h-full w-full object-cover" />
                ) : isVideoMime(f.mime, f.fileName) ? (
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8e1454]">Video</span>
                ) : (
                  <FileText className="h-10 w-10 text-[#8e1454]/50" />
                )}
              </div>
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#3a2f32]">{f.label}</p>
                  <p className="truncate text-[11px] text-muted">{f.fileName}</p>
                </div>
                <button
                  type="button"
                  aria-label={`View ${f.label}`}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#8e1454] text-[#8e1454] hover:bg-[#8e1454] hover:text-white"
                  onClick={() => onPreview(f)}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
