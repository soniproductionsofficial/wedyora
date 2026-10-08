import {
  apiAdvanceStage,
  apiAllocateVendorId,
  apiCompleteBank,
  apiGetApplication,
  apiListApplications,
  apiLogin,
  apiSaveApplication,
  apiSetVendorPassword,
  apiSetVendorRank,
  isSupabaseBackend,
} from './vendorApi'

export type VendorStage =
  | 'documents'
  | 'doc_verification'
  | 'skill_evaluation'
  | 'interview'
  | 'trial'
  | 'final_approval'
  | 'training'
  | 'active'
  | 'rejected'

export type VendorRank = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum'

export type VendorApplication = {
  vendorId: string
  mobile: string
  contactName: string
  businessName: string
  category: string
  city: string
  email: string
  address: string
  experience: string
  teamSize: string
  equipment: string
  area: string
  pincode: string
  serviceRadiusKm: string
  serviceAreas: string[]
  baseLat: number | null
  baseLng: number | null
  portfolioLink: string
  portfolioVideo: string
  portfolioPhotos: string[]
  portfolioVideos: string[]
  portfolioClientWork: string[]
  portfolioStudioWork: string[]
  docsUploaded: { id: string; label: string; fileName: string }[]
  photoUploaded: boolean
  mediaSaved: boolean
  agreementAccepted: boolean
  password: string | null
  /** True when a login password exists (Supabase hash or local demo password). */
  hasPassword: boolean
  stage: VendorStage
  bankComplete: boolean
  bankDetails: {
    accountHolder: string
    bankName: string
    accountNumber: string
    ifsc: string
    chequeFileName: string
  } | null
  rank: VendorRank
  qualityScore: number | null
  submittedAt: string | null
}

const APPS_KEY = 'wedyora-vendor-apps'
const SEQ_KEY = 'wedyora-vendor-seq'
const MOBILE_INDEX_KEY = 'wedyora-vendor-mobile-index'

export const PIPELINE: { id: string; label: string; owner: 'vendor' | 'admin' }[] = [
  { id: 'otp', label: '1. Mobile OTP verify (first visit)', owner: 'vendor' },
  { id: 'category', label: '2. Choose category & basic details', owner: 'vendor' },
  { id: 'profile', label: '3. Vendor profile & service area', owner: 'vendor' },
  { id: 'documents', label: '4. Upload KYC documents', owner: 'vendor' },
  { id: 'portfolio', label: '5. Portfolio link / video', owner: 'vendor' },
  { id: 'agreement', label: '6. Agreement & policies', owner: 'vendor' },
  { id: 'credentials', label: '7. Vendor ID & password created', owner: 'vendor' },
  { id: 'doc_verification', label: '8. Level 1 · Document verification', owner: 'admin' },
  { id: 'skill_evaluation', label: '9. Level 2 · Portfolio review', owner: 'admin' },
  { id: 'interview', label: '10. Level 3 · Interview / call', owner: 'admin' },
  { id: 'trial', label: '11. Level 4 · Quality & service check', owner: 'admin' },
  { id: 'training', label: '12. Training & guidelines', owner: 'admin' },
  { id: 'active', label: '13. Account activated · go live', owner: 'admin' },
  { id: 'bank', label: '14. Payment setup (after active)', owner: 'vendor' },
  { id: 'ranking', label: '15. Ranking after live QC', owner: 'admin' },
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
  'rejected',
]

export function stageIndex(stage: VendorStage) {
  return STAGE_ORDER.indexOf(stage)
}

function formatVendorId(n: number) {
  return `wed-${String(n).padStart(3, '0')}`
}

function readMobileIndex(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(MOBILE_INDEX_KEY) ?? '{}') as Record<string, string>
  } catch {
    return {}
  }
}

function writeMobileIndex(index: Record<string, string>) {
  localStorage.setItem(MOBILE_INDEX_KEY, JSON.stringify(index))
}

function readApps(): Record<string, VendorApplication> {
  try {
    const raw = JSON.parse(localStorage.getItem(APPS_KEY) ?? '{}') as Record<string, VendorApplication>
    return migrateApps(raw)
  } catch {
    return {}
  }
}

function normalizeApp(app: VendorApplication, vendorId: string): VendorApplication {
  return {
    ...app,
    vendorId,
    password: app.password ?? null,
    portfolioLink: app.portfolioLink ?? '',
    portfolioVideo: app.portfolioVideo ?? '',
    portfolioPhotos: app.portfolioPhotos ?? [],
    portfolioVideos: app.portfolioVideos ?? [],
    portfolioClientWork: app.portfolioClientWork ?? [],
    portfolioStudioWork: app.portfolioStudioWork ?? [],
    docsUploaded: app.docsUploaded ?? [],
    photoUploaded: app.photoUploaded ?? false,
    mediaSaved: app.mediaSaved ?? false,
    agreementAccepted: app.agreementAccepted ?? false,
    hasPassword: app.hasPassword ?? Boolean(app.password),
    serviceAreas: app.serviceAreas ?? [],
    serviceRadiusKm: app.serviceRadiusKm ?? '',
    equipment: app.equipment ?? '',
    area: app.area ?? '',
    pincode: app.pincode ?? '',
    bankDetails: app.bankDetails ?? null,
    submittedAt: app.submittedAt ?? null,
  }
}

function migrateApps(raw: Record<string, VendorApplication>): Record<string, VendorApplication> {
  const byId: Record<string, VendorApplication> = {}
  const index = readMobileIndex()
  let maxSeq = Number(localStorage.getItem(SEQ_KEY) ?? '0')
  let changed = false

  for (const [key, app] of Object.entries(raw)) {
    let vendorId = app.vendorId
    if (!vendorId) {
      if (/^wed-\d+$/i.test(key)) {
        vendorId = key.toLowerCase()
      } else {
        maxSeq += 1
        vendorId = formatVendorId(maxSeq)
      }
      changed = true
    }
    const seqNum = Number(vendorId.replace(/^wed-/i, ''))
    if (!Number.isNaN(seqNum)) maxSeq = Math.max(maxSeq, seqNum)

    const next = normalizeApp(app, vendorId)
    byId[vendorId] = next
    if (next.mobile) index[next.mobile] = vendorId
  }

  if (changed || Object.keys(byId).length !== Object.keys(raw).length) {
    localStorage.setItem(APPS_KEY, JSON.stringify(byId))
    localStorage.setItem(SEQ_KEY, String(maxSeq))
    writeMobileIndex(index)
  }

  return byId
}

function writeApps(apps: Record<string, VendorApplication>) {
  localStorage.setItem(APPS_KEY, JSON.stringify(apps))
}

function localNextVendorId(): string {
  const n = Number(localStorage.getItem(SEQ_KEY) ?? '0') + 1
  localStorage.setItem(SEQ_KEY, String(n))
  return formatVendorId(n)
}

function localSaveApplication(app: VendorApplication) {
  const apps = readApps()
  const index = readMobileIndex()
  apps[app.vendorId] = normalizeApp(app, app.vendorId)
  index[app.mobile] = app.vendorId
  writeApps(apps)
  writeMobileIndex(index)
}

export async function allocateVendorId(mobile: string): Promise<string> {
  if (isSupabaseBackend()) return apiAllocateVendorId(mobile)
  const apps = readApps()
  const index = readMobileIndex()
  const existingId = index[mobile]
  if (existingId && apps[existingId]) return existingId
  const byMobile = Object.values(apps).find((a) => a.mobile === mobile)
  if (byMobile?.vendorId) {
    index[mobile] = byMobile.vendorId
    writeMobileIndex(index)
    return byMobile.vendorId
  }
  return localNextVendorId()
}

export async function saveApplication(app: VendorApplication): Promise<VendorApplication> {
  if (isSupabaseBackend()) return apiSaveApplication(app)
  localSaveApplication(app)
  return app
}

export async function getApplication(mobile: string): Promise<VendorApplication | null> {
  if (isSupabaseBackend()) return apiGetApplication(mobile, undefined)
  const apps = readApps()
  const index = readMobileIndex()
  const id = index[mobile]
  if (id && apps[id]) return apps[id]
  return Object.values(apps).find((a) => a.mobile === mobile) ?? null
}

export async function getApplicationById(vendorId: string): Promise<VendorApplication | null> {
  if (isSupabaseBackend()) return apiGetApplication(undefined, vendorId)
  return readApps()[vendorId] ?? null
}

export async function listApplications(): Promise<VendorApplication[]> {
  if (isSupabaseBackend()) return apiListApplications()
  return Object.values(readApps()).sort((a, b) => a.vendorId.localeCompare(b.vendorId, undefined, { numeric: true }))
}

export async function advanceStage(mobile: string, stage: VendorStage): Promise<void> {
  if (isSupabaseBackend()) {
    await apiAdvanceStage(mobile, stage)
    return
  }
  const app = await getApplication(mobile)
  if (!app) return
  await saveApplication({ ...app, stage })
}

export async function setVendorRank(mobile: string, rank: VendorRank, qualityScore: number): Promise<void> {
  if (isSupabaseBackend()) {
    await apiSetVendorRank(mobile, rank, qualityScore)
    return
  }
  const app = await getApplication(mobile)
  if (!app || app.stage !== 'active' || !app.bankComplete) return
  await saveApplication({ ...app, rank, qualityScore })
}

export async function completeBank(
  mobile: string,
  details: {
    accountHolder: string
    bankName: string
    accountNumber: string
    ifsc: string
    chequeFileName: string
    chequePath?: string
  },
): Promise<void> {
  if (isSupabaseBackend()) {
    await apiCompleteBank(mobile, {
      accountHolder: details.accountHolder,
      bankName: details.bankName,
      accountNumber: details.accountNumber,
      ifsc: details.ifsc,
      chequePath: details.chequePath,
    })
    return
  }
  const app = await getApplication(mobile)
  if (!app || app.stage !== 'active') return
  await saveApplication({
    ...app,
    bankComplete: true,
    bankDetails: {
      accountHolder: details.accountHolder.trim(),
      bankName: details.bankName.trim(),
      accountNumber: details.accountNumber.trim(),
      ifsc: details.ifsc.trim().toUpperCase(),
      chequeFileName: details.chequeFileName,
    },
  })
}

export async function setVendorPassword(vendorId: string, password: string): Promise<boolean> {
  if (isSupabaseBackend()) return apiSetVendorPassword(vendorId, password)
  const app = await getApplicationById(vendorId)
  if (!app) return false
  await saveApplication({ ...app, password, hasPassword: true })
  return true
}

export async function loginWithVendorId(vendorId: string, password: string): Promise<VendorApplication | null> {
  if (isSupabaseBackend()) return apiLogin(vendorId, password)
  const id = vendorId.trim().toLowerCase()
  const app = await getApplicationById(id)
  if (!app || !app.password) return null
  if (app.password !== password) return null
  return app
}

export async function loginWithUserOrEmail(userOrEmail: string, password: string): Promise<VendorApplication | null> {
  if (isSupabaseBackend()) return apiLogin(userOrEmail, password)
  const value = userOrEmail.trim()
  if (!value || !password) return null
  if (value.includes('@')) {
    const email = value.toLowerCase()
    const apps = await listApplications()
    const app = apps.find((a) => a.email.toLowerCase() === email) ?? null
    if (!app || !app.password || app.password !== password) return null
    return app
  }
  return loginWithVendorId(value, password)
}

export function categoryLabel(slug: string) {
  return slug.replace(/-/g, ' ')
}

export function rankLabel(rank: VendorRank) {
  const map: Record<VendorRank, string> = {
    none: 'Not ranked yet',
    bronze: 'Bronze partner',
    silver: 'Silver partner',
    gold: 'Gold partner',
    platinum: 'Platinum partner',
  }
  return map[rank]
}
