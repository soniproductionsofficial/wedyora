import { useRef, useState, useEffect, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, FileText, Trash2, Upload } from 'lucide-react'
import { Button } from '../../components/Button'
import { ServiceAreaMap } from '../../components/ServiceAreaMap'
import { vendorServiceCategories, cities } from '../../data'
import { cn } from '../../lib/cn'
import { getCityCoord } from '../../lib/cityCoords'
import { lookupPincode } from '../../lib/pincode'
import {
  getPendingMobile,
  normalizeMobile,
  setVendorSession,
} from '../../lib/vendorOtp'
import { allocateVendorId, getApplication, saveApplication, type VendorApplication } from '../../lib/vendorOnboarding'
import { saveVendorMedia } from '../../lib/vendorMedia'
import {
  VendorAgreementFields,
  VendorLegalModal,
  type LegalModalKind,
} from '../../components/vendor/VendorLegalModals'

const field =
  'mt-1.5 w-full rounded-lg border border-[#d8c9ce] bg-white px-4 py-2.5 text-sm text-[#3a2f32] outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20'

const RADIUS_OPTIONS = ['10', '25', '50', '75', '100', '150']

const EQUIPMENT_OPTIONS = [
  'Camera brand / model',
  'Wide-angle / portrait / telephoto lenses',
  'Flash and LED lights',
  'Gimbal',
  'Tripod',
  'Drone, where legally applicable',
  'Audio equipment',
  'Editing system',
] as const

const steps = ['Basic details', 'Vendor profile', 'Documents', 'Portfolio & agreement']

const kycDocs = [
  { id: 'pan', label: 'PAN card', required: true },
  { id: 'gst', label: 'GST certificate', required: false },
  { id: 'aadhaar', label: 'Aadhaar / ID proof', required: true },
  { id: 'address', label: 'Address proof', required: true },
  { id: 'cheque', label: 'Cancelled cheque / bank proof', required: true },
  { id: 'business', label: 'Business registration certificate', required: true },
  { id: 'equipment', label: 'Equipment list (file)', required: true },
] as const

type DocId = (typeof kycDocs)[number]['id']

const iconBtnLine =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#8e1454] text-[#8e1454] transition hover:bg-[#8e1454] hover:text-white'

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string
  hint?: string
  className?: string
  children: ReactNode
}) {
  return (
    <label className={cn('block text-sm text-[#3a2f32]', className)}>
      {label}
      {hint && <span className="ml-1 text-xs text-muted">({hint})</span>}
      {children}
    </label>
  )
}

function FilePickBox({
  label,
  hint,
  file,
  accept,
  required,
  onPick,
}: {
  label: string
  hint?: string
  file: File | null
  accept: string
  required?: boolean
  onPick: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="text-sm text-[#3a2f32]">
      <p>
        {label}
        {hint && <span className="ml-1 text-xs text-muted">({hint})</span>}
      </p>
      <button
        type="button"
        className={cn(
          field,
          'mt-1.5 flex w-full items-center gap-2 text-left',
          file ? 'border-[#8e1454]/40' : '',
        )}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4 shrink-0 text-[#8e1454]" />
        <span className={cn('truncate', file ? 'text-[#3a2f32]' : 'text-muted')}>
          {file ? file.name : 'Choose file…'}
        </span>
      </button>
      <input
        ref={inputRef}
        required={required && !file}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}

function MultiFileBox({
  label,
  hint,
  files,
  accept,
  max,
  onAdd,
  onRemove,
  onReview,
}: {
  label: string
  hint: string
  files: File[]
  accept: string
  max: number
  onAdd: (incoming: File[]) => void
  onRemove: (index: number) => void
  onReview: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const remaining = Math.max(0, max - files.length)

  return (
    <div className="rounded-xl border border-[#8e1454]/15 bg-[#fff8f9] p-4 sm:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-[#3a2f32]">{label}</p>
          <p className="mt-0.5 text-xs text-muted">{hint}</p>
        </div>
        <p className="text-xs font-semibold text-[#8e1454]">
          {files.length}/{max}
        </p>
      </div>
      <button
        type="button"
        disabled={remaining === 0}
        className={cn(
          field,
          'mt-3 flex w-full items-center gap-2 text-left disabled:cursor-not-allowed disabled:opacity-50',
        )}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4 shrink-0 text-[#8e1454]" />
        <span className="text-muted">
          {remaining === 0 ? 'Limit reached' : `Choose files… (up to ${remaining} more)`}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={(e) => {
          const list = Array.from(e.target.files ?? [])
          if (list.length) onAdd(list.slice(0, remaining))
          e.target.value = ''
        }}
      />
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#d8c9ce] bg-white px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2 text-[#3a2f32]">
                <FileText className="h-4 w-4 shrink-0 text-[#8e1454]" />
                <span className="truncate">{file.name}</span>
              </span>
              <span className="flex items-center gap-2">
                <button type="button" aria-label="View file" className={iconBtnLine} onClick={() => onReview(file)}>
                  <Eye className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Remove file" className={iconBtnLine} onClick={() => onRemove(i)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function VendorRegister() {
  const navigate = useNavigate()
  const photoRef = useRef<HTMLInputElement>(null)
  const pending = getPendingMobile()
  const [existing, setExisting] = useState<VendorApplication | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoOk, setPhotoOk] = useState(false)
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)
  const [equipmentSelected, setEquipmentSelected] = useState<string[]>([])
  const [cameraCount, setCameraCount] = useState('')
  const [pinLooking, setPinLooking] = useState(false)
  const [mapLat, setMapLat] = useState<number | null>(null)
  const [mapLng, setMapLng] = useState<number | null>(null)
  const [portfolioPhotos, setPortfolioPhotos] = useState<File[]>([])
  const [portfolioVideos, setPortfolioVideos] = useState<File[]>([])
  const [portfolioClientWork, setPortfolioClientWork] = useState<File[]>([])
  const [portfolioStudioWork, setPortfolioStudioWork] = useState<File[]>([])
  const [docFiles, setDocFiles] = useState<Partial<Record<DocId, File>>>({})
  const [reviewUrl, setReviewUrl] = useState<string | null>(null)
  const [reviewName, setReviewName] = useState('')
  const [reviewKind, setReviewKind] = useState<'image' | 'video' | 'file'>('file')
  const [legalModal, setLegalModal] = useState<LegalModalKind>(null)
  const [form, setForm] = useState({
    category: '',
    contactName: '',
    businessName: '',
    city: '',
    mobile: pending ?? '',
    email: '',
    address: '',
    experience: '',
    teamSize: '',
    area: '',
    pincode: '',
    serviceRadiusKm: '',
    portfolioLink: '',
    portfolioVideo: '',
    agreeTerms: false,
    agreeCancellation: false,
  })

  useEffect(() => {
    if (!pending) return
    void getApplication(pending).then(setExisting)
  }, [pending])

  if (!pending) {
    return <Navigate to="/vendor/join" replace />
  }

  if (existing?.hasPassword) {
    return <Navigate to="/vendor/login" replace />
  }

  function patch(key: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleEquipment(label: string) {
    setEquipmentSelected((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    )
  }

  async function onPincodeChange(raw: string) {
    const pincode = raw.replace(/\D/g, '').slice(0, 6)
    setForm((f) => ({ ...f, pincode }))
    if (pincode.length !== 6) return
    setPinLooking(true)
    setError('')
    const found = await lookupPincode(pincode)
    setPinLooking(false)
    if (!found) {
      setError('Pincode not found. Enter city and area manually.')
      return
    }
    setForm((f) => ({
      ...f,
      pincode,
      city: found.city || f.city,
      area: found.area || f.area,
    }))
    if (found.coord) {
      setMapLat(found.coord.lat)
      setMapLng(found.coord.lng)
    } else {
      const c = getCityCoord(found.city)
      setMapLat(c?.lat ?? null)
      setMapLng(c?.lng ?? null)
    }
  }

  function onCityManual(value: string) {
    patch('city', value)
    const c = getCityCoord(value)
    if (c) {
      setMapLat(c.lat)
      setMapLng(c.lng)
    }
  }

  function setDoc(id: DocId, file: File | null) {
    setDocFiles((prev) => {
      const next = { ...prev }
      if (!file) delete next[id]
      else next[id] = file
      return next
    })
  }

  function openReview(file: File) {
    if (reviewUrl) URL.revokeObjectURL(reviewUrl)
    setReviewName(file.name)
    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(file.name)
    const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(file.name)
    setReviewKind(isImage ? 'image' : isVideo ? 'video' : 'file')
    setReviewUrl(URL.createObjectURL(file))
  }

  function closeReview() {
    if (reviewUrl) URL.revokeObjectURL(reviewUrl)
    setReviewUrl(null)
    setReviewName('')
    setReviewKind('file')
  }

  function onPhoto(file: File | undefined) {
    if (!file) return
    const ok = ['image/jpeg', 'image/png'].includes(file.type) || /\.(jpe?g|png)$/i.test(file.name)
    if (!ok) {
      setPhotoOk(false)
      setProfilePhotoFile(null)
      setPhotoPreview('')
      setError('Profile photo must be JPG or PNG.')
      if (photoRef.current) photoRef.current.value = ''
      return
    }
    setError('')
    setPhotoOk(true)
    setProfilePhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function next(e: FormEvent) {
    e.preventDefault()
    setError('')
    const fail = (message: string) => {
      setError(message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    if (step === 2 && !photoOk) {
      fail('Upload a JPG or PNG profile photo.')
      return
    }
    if (step === 2 && equipmentSelected.length === 0 && !cameraCount.trim()) {
      fail('Select equipment or enter number of cameras.')
      return
    }
    if (step === 2 && cameraCount.trim() && (!/^\d+$/.test(cameraCount) || Number(cameraCount) < 1)) {
      fail('Enter a valid number of cameras.')
      return
    }
    if (step === 2 && !form.city.trim()) {
      fail('Enter service city.')
      return
    }
    if (step === 2 && form.pincode.replace(/\D/g, '').length !== 6) {
      fail('Enter a valid 6-digit pincode.')
      return
    }
    if (step === 2 && !form.serviceRadiusKm) {
      fail('Select a service radius in km.')
      return
    }
    if (step === 3) {
      const missing = kycDocs.filter((d) => d.required && !docFiles[d.id])
      if (missing.length) {
        fail(`Upload required: ${missing.map((d) => d.label).join(', ')}`)
        return
      }
    }
    if (step < 4) {
      setStep(step + 1)
      return
    }
    if (portfolioPhotos.length < 5 || portfolioPhotos.length > 10) {
      fail(`Upload 5–10 sample photographs (you have ${portfolioPhotos.length}).`)
      return
    }
    if (portfolioVideos.length < 2 || portfolioVideos.length > 5) {
      fail(`Upload 2–5 sample videos / reels (you have ${portfolioVideos.length}).`)
      return
    }
    if (!form.agreeTerms || !form.agreeCancellation) {
      fail('Read and accept both the Vendor Terms & Conditions and the Cancellation Policy to submit.')
      return
    }
    try {
      setSubmitting(true)
      const mobile = normalizeMobile(form.mobile)
      const coord = mapLat != null && mapLng != null ? { lat: mapLat, lng: mapLng } : getCityCoord(form.city)
      const vendorId = await allocateVendorId(mobile)

      const draft: VendorApplication = {
        vendorId,
        mobile,
        contactName: form.contactName,
        businessName: form.businessName,
        category: form.category,
        city: form.city.trim(),
        email: form.email,
        address: form.address,
        experience: form.experience,
        teamSize: form.teamSize,
        equipment: [
          ...equipmentSelected,
          cameraCount.trim() ? `Number of cameras: ${cameraCount.trim()}` : null,
        ]
          .filter(Boolean)
          .join(', '),
        area: form.area.trim(),
        pincode: form.pincode.replace(/\D/g, '').slice(0, 6),
        serviceRadiusKm: form.serviceRadiusKm,
        serviceAreas: form.area.trim() ? [form.area.trim()] : [],
        baseLat: coord?.lat ?? null,
        baseLng: coord?.lng ?? null,
        portfolioLink: form.portfolioLink.trim(),
        portfolioVideo: form.portfolioVideo.trim(),
        portfolioPhotos: portfolioPhotos.map((f) => f.name),
        portfolioVideos: portfolioVideos.map((f) => f.name),
        portfolioClientWork: portfolioClientWork.map((f) => f.name),
        portfolioStudioWork: portfolioStudioWork.map((f) => f.name),
        docsUploaded: kycDocs
          .filter((d) => docFiles[d.id])
          .map((d) => ({ id: d.id, label: d.label, fileName: docFiles[d.id]!.name })),
        photoUploaded: photoOk,
        mediaSaved: false,
        agreementAccepted: form.agreeTerms && form.agreeCancellation,
        password: null,
        hasPassword: false,
        stage: 'doc_verification',
        bankComplete: false,
        bankDetails: null,
        rank: 'none',
        qualityScore: null,
        submittedAt: new Date().toISOString(),
      }

      await saveApplication(draft)

      await saveVendorMedia(vendorId, {
        docs: kycDocs.filter((d) => docFiles[d.id]).map((d) => ({ id: d.id, label: d.label, file: docFiles[d.id]! })),
        portfolioPhotos,
        portfolioVideos,
        portfolioClientWork,
        portfolioStudioWork,
        profilePhoto: profilePhotoFile,
      })

      await saveApplication({ ...draft, mediaSaved: true })
      setVendorSession(mobile, vendorId)
      navigate('/vendor/credentials')
    } catch (err) {
      console.error(err)
      fail('Could not save application and files. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function goBack() {
    setError('')
    if (step > 1) {
      setStep(step - 1)
      return
    }
    navigate('/vendor/join')
  }

  const header = (
    <div className="mb-5">
      <button type="button" aria-label="Back" className="text-[#8e1454]" onClick={goBack}>
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none" aria-hidden>
          <path
            d="M7 1.5 1.5 8 7 14.5M2 8h24.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )

  const continueBtn = (
    <div className="mt-6 sm:col-span-2">
      <Button type="submit" className="rounded-md px-6 py-2.5" disabled={submitting}>
        {step === 4 ? (submitting ? 'Submitting…' : 'Submit') : 'Continue'}
      </Button>
    </div>
  )

  return (
    <div>
      <div className="border-b border-[#8e1454]/10 bg-[#fff8f9]">
        <div className="mx-auto max-w-3xl px-5 py-5 lg:px-8">
          <h1 className="font-display text-3xl text-[#3a2f32] sm:text-4xl">Register as a vendor</h1>
          <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {steps.map((label, i) => {
              const n = i + 1
              const done = n < step
              const current = n === step
              return (
                <li key={label} className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                        (done || current) && 'bg-[#8e1454] text-white',
                        !done && !current && 'bg-[#8e1454]/15 text-[#8e1454]',
                      )}
                    >
                      {done ? '✓' : n}
                    </span>
                    <span className={cn('h-1 flex-1 rounded-full', n <= step ? 'bg-[#8e1454]' : 'bg-[#8e1454]/15')} />
                  </div>
                  <p
                    className={cn(
                      'mt-2 text-[10px] font-semibold uppercase tracking-[0.12em]',
                      current ? 'text-[#8e1454]' : 'text-[#3a2f32]',
                    )}
                  >
                    {n}. {label}
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-6 lg:px-8">
        <form
          onSubmit={next}
          noValidate
          className="rounded-2xl border border-[#8e1454]/12 bg-white p-6 shadow-[0_12px_40px_rgba(142,20,84,0.06)]"
        >
          {header}
          {error && (
            <p className="mb-4 rounded-lg border border-[#8e1454]/30 bg-[#fff8f9] px-3 py-2 text-sm font-medium text-[#8e1454]">
              {error}
            </p>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Service category">
                <select required className={field} value={form.category} onChange={(e) => patch('category', e.target.value)}>
                  <option value="" disabled>
                    Select category
                  </option>
                  {vendorServiceCategories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Full name">
                <input required className={field} value={form.contactName} onChange={(e) => patch('contactName', e.target.value)} />
              </Field>
              <Field label="Business / studio name">
                <input required className={field} value={form.businessName} onChange={(e) => patch('businessName', e.target.value)} />
              </Field>
              <Field label="Mobile">
                <input required readOnly inputMode="numeric" className={field + ' bg-[#fafafa]'} value={form.mobile} />
              </Field>
              <Field label="City">
                <select
                  required
                  className={field}
                  value={form.city}
                  onChange={(e) => onCityManual(e.target.value)}
                >
                  <option value="" disabled>
                    Select city
                  </option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  className={field}
                  value={form.email}
                  onChange={(e) => patch('email', e.target.value)}
                />
              </Field>
              <Field label="Business address" className="sm:col-span-2">
                <textarea
                  required
                  rows={4}
                  className="mt-1.5 w-full resize-y rounded-none border border-[#d8c9ce] bg-white px-4 py-2.5 text-sm text-[#3a2f32] outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20"
                  value={form.address}
                  onChange={(e) => patch('address', e.target.value)}
                />
              </Field>
              {continueBtn}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center sm:col-span-2">
                <button
                  type="button"
                  className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[#8e1454] bg-blush"
                  onClick={() => photoRef.current?.click()}
                  aria-label="Upload profile photo"
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center px-2 text-center text-[10px] uppercase tracking-wider text-[#8e1454]">
                      Add photo
                    </span>
                  )}
                </button>
                <input
                  ref={photoRef}
                  required={!photoOk}
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  className="sr-only"
                  onChange={(e) => onPhoto(e.target.files?.[0])}
                />
                <p className="mt-2 text-xs text-muted">JPG or PNG only</p>
              </div>
              <Field label="Years of experience">
                <input
                  required
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  className={field}
                  value={form.experience}
                  onChange={(e) => patch('experience', e.target.value)}
                />
              </Field>
              <Field label="Team size">
                <input
                  required
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  className={field}
                  value={form.teamSize}
                  onChange={(e) => patch('teamSize', e.target.value)}
                />
              </Field>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-[#3a2f32]">Equipment details</p>
                <p className="mt-1 text-xs text-muted">
                  Select all that apply. Helps Wedyora match you to booking types.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <label
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition',
                      cameraCount
                        ? 'border-[#8e1454] bg-[#fff8f9] text-[#3a2f32]'
                        : 'border-[#d8c9ce] bg-white text-[#3a2f32]',
                    )}
                  >
                    <span className="shrink-0">Number of cameras</span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      inputMode="numeric"
                      placeholder="Qty"
                      className="ml-auto w-20 rounded-md border border-[#d8c9ce] bg-white px-2 py-1.5 text-sm text-[#3a2f32] outline-none focus:border-[#8e1454] focus:ring-2 focus:ring-[#8e1454]/20"
                      value={cameraCount}
                      onChange={(e) => setCameraCount(e.target.value.replace(/[^\d]/g, ''))}
                    />
                  </label>
                  {EQUIPMENT_OPTIONS.map((label) => {
                    const on = equipmentSelected.includes(label)
                    return (
                      <label
                        key={label}
                        className={cn(
                          'flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition',
                          on
                            ? 'border-[#8e1454] bg-[#fff8f9] text-[#3a2f32]'
                            : 'border-[#d8c9ce] bg-white text-[#3a2f32] hover:border-[#8e1454]/50',
                        )}
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[#8e1454]"
                          checked={on}
                          onChange={() => toggleEquipment(label)}
                        />
                        <span>{label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="sm:col-span-2 rounded-xl border border-[#8e1454]/15 bg-[#fff8f9] p-4">
                <p className="text-sm font-medium text-[#3a2f32]">Service area</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Pincode">
                    <input
                      required
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6-digit pincode"
                      className={field}
                      value={form.pincode}
                      onChange={(e) => void onPincodeChange(e.target.value)}
                    />
                    {pinLooking && <p className="mt-1 text-xs text-muted">Looking up city…</p>}
                  </Field>
                  <Field label="City">
                    <input
                      required
                      list="service-cities"
                      placeholder="City (auto-fills from pincode)"
                      className={field}
                      value={form.city}
                      onChange={(e) => onCityManual(e.target.value)}
                    />
                    <datalist id="service-cities">
                      {cities.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </Field>
                  <Field label="Area / locality">
                    <input
                      placeholder="Area or locality"
                      className={field}
                      value={form.area}
                      onChange={(e) => patch('area', e.target.value)}
                    />
                  </Field>
                  <Field label="Travel radius (km)">
                    <select
                      required
                      className={field}
                      value={form.serviceRadiusKm}
                      onChange={(e) => patch('serviceRadiusKm', e.target.value)}
                    >
                      <option value="" disabled>
                        Select radius
                      </option>
                      {RADIUS_OPTIONS.map((km) => (
                        <option key={km} value={km}>
                          {km} km
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="mt-4">
                  <ServiceAreaMap
                    city={form.city}
                    radiusKm={form.serviceRadiusKm || '25'}
                    lat={mapLat}
                    lng={mapLng}
                  />
                </div>
              </div>
              {continueBtn}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {kycDocs.map((doc) => {
                const file = docFiles[doc.id] ?? null
                return (
                  <FilePickBox
                    key={doc.id}
                    label={doc.label}
                    hint={doc.required ? 'required' : 'if applicable'}
                    file={file}
                    accept="image/*,.pdf"
                    required={doc.required}
                    onPick={(f) => {
                      setError('')
                      setDoc(doc.id, f)
                    }}
                  />
                )
              })}

              <div className="rounded-xl border border-[#8e1454]/15 bg-[#fff8f9] p-4 sm:col-span-2">
                <p className="text-sm font-medium text-[#3a2f32]">Upload review</p>
                <ul className="mt-3 space-y-2">
                  {kycDocs.map((doc) => {
                    const file = docFiles[doc.id]
                    const done = Boolean(file)
                    return (
                      <li
                        key={doc.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#d8c9ce] bg-white px-3 py-2 text-sm"
                      >
                        <span className="flex min-w-0 items-center gap-2 text-[#3a2f32]">
                          <FileText className={cn('h-4 w-4 shrink-0', done ? 'text-[#8e1454]' : 'text-muted')} />
                          <span className="truncate">
                            {doc.label}
                            {!doc.required && <span className="text-muted"> · optional</span>}
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className={cn('text-xs font-medium uppercase tracking-wider', done ? 'text-[#8e1454]' : 'text-muted')}>
                            {done ? 'Uploaded' : 'Missing'}
                          </span>
                          {file && (
                            <>
                              <button
                                type="button"
                                aria-label="View file"
                                className={iconBtnLine}
                                onClick={() => openReview(file)}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                aria-label="Remove file"
                                className={iconBtnLine}
                                onClick={() => setDoc(doc.id, null)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
              {continueBtn}
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-[#3a2f32]">Upload portfolio</p>
                <p className="mt-1 text-xs text-muted">
                  Verification team reviews for quality, consistency, and authenticity.
                </p>
              </div>

              <MultiFileBox
                label="Sample photographs"
                hint="Required · 5–10 photos (JPG / PNG)"
                files={portfolioPhotos}
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                max={10}
                onAdd={(incoming) => {
                  setError('')
                  setPortfolioPhotos((prev) => [...prev, ...incoming].slice(0, 10))
                }}
                onRemove={(i) => setPortfolioPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                onReview={openReview}
              />

              <MultiFileBox
                label="Sample videos / reels"
                hint="Required · 2–5 videos (MP4 / MOV / WebM)"
                files={portfolioVideos}
                accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                max={5}
                onAdd={(incoming) => {
                  setError('')
                  setPortfolioVideos((prev) => [...prev, ...incoming].slice(0, 5))
                }}
                onRemove={(i) => setPortfolioVideos((prev) => prev.filter((_, idx) => idx !== i))}
                onReview={openReview}
              />

              <MultiFileBox
                label="Previous client work"
                hint="Optional"
                files={portfolioClientWork}
                accept="image/*,video/*,.pdf"
                max={20}
                onAdd={(incoming) => {
                  setError('')
                  setPortfolioClientWork((prev) => [...prev, ...incoming].slice(0, 20))
                }}
                onRemove={(i) => setPortfolioClientWork((prev) => prev.filter((_, idx) => idx !== i))}
                onReview={openReview}
              />

              <MultiFileBox
                label="Studio / event / product work"
                hint="Optional"
                files={portfolioStudioWork}
                accept="image/*,video/*,.pdf"
                max={20}
                onAdd={(incoming) => {
                  setError('')
                  setPortfolioStudioWork((prev) => [...prev, ...incoming].slice(0, 20))
                }}
                onRemove={(i) => setPortfolioStudioWork((prev) => prev.filter((_, idx) => idx !== i))}
                onReview={openReview}
              />

              <Field label="Portfolio link" hint="optional · website, Drive, Behance, Instagram" className="sm:col-span-2">
                <input
                  type="text"
                  inputMode="url"
                  placeholder="https://"
                  className={field}
                  value={form.portfolioLink}
                  onChange={(e) => patch('portfolioLink', e.target.value)}
                />
              </Field>
              <Field label="Extra video link" hint="optional · YouTube, Vimeo, Drive" className="sm:col-span-2">
                <input
                  type="text"
                  inputMode="url"
                  placeholder="https://"
                  className={field}
                  value={form.portfolioVideo}
                  onChange={(e) => patch('portfolioVideo', e.target.value)}
                />
              </Field>

              <VendorAgreementFields
                agreeTerms={form.agreeTerms}
                agreeCancellation={form.agreeCancellation}
                onAgreeTerms={(v) => patch('agreeTerms', v)}
                onAgreeCancellation={(v) => patch('agreeCancellation', v)}
                onOpenTerms={() => setLegalModal('terms')}
                onOpenCancellation={() => setLegalModal('cancellation')}
              />
              {error && (
                <p className="rounded-lg border border-[#8e1454]/30 bg-[#fff8f9] px-3 py-2 text-sm font-medium text-[#8e1454] sm:col-span-2">
                  {error}
                </p>
              )}
              {continueBtn}
            </div>
          )}
        </form>

        <VendorLegalModal kind={legalModal} onClose={() => setLegalModal(null)} />

        {reviewUrl && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal>
            <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
                <p className="truncate text-sm font-medium text-[#3a2f32]">{reviewName}</p>
                <button type="button" className="text-sm font-semibold text-[#8e1454]" onClick={closeReview}>
                  Close
                </button>
              </div>
              <div className="max-h-[75vh] overflow-auto bg-[#fafafa] p-4">
                {reviewKind === 'image' ? (
                  <img src={reviewUrl} alt={reviewName} className="mx-auto max-h-[70vh] max-w-full object-contain" />
                ) : reviewKind === 'video' ? (
                  <video src={reviewUrl} controls className="mx-auto max-h-[70vh] max-w-full" />
                ) : (
                  <iframe title={reviewName} src={reviewUrl} className="h-[70vh] w-full rounded-lg border border-[#d8c9ce] bg-white" />
                )}
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-sm">
          Already in review?{' '}
          <Link to="/vendor/login" className="font-semibold text-[#8e1454]">
            Vendor website login
          </Link>
        </p>
      </div>
    </div>
  )
}
