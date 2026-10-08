import { supabase, supabaseConfigured } from './supabase'
import type { VendorApplication, VendorRank, VendorStage } from './vendorOnboarding'

type DbVendorRow = {
  vendor_code: string
  mobile: string
  contact_name: string
  business_name: string
  category_slug: string
  city: string
  email: string
  address: string
  experience_years: number | null
  team_size: number | null
  equipment: string
  area: string
  pincode: string
  service_radius_km: number | null
  service_areas: string[]
  base_lat: number | null
  base_lng: number | null
  portfolio_link: string
  portfolio_video: string
  stage: string
  bank_complete: boolean
  bank_account_holder: string | null
  bank_name: string | null
  bank_account_number: string | null
  bank_ifsc: string | null
  bank_cheque_path: string | null
  partner_rank: string
  quality_score: number | null
  password_hash: string | null
  agreement_accepted: boolean
  media_saved: boolean
  submitted_at: string | null
}

export type DbMediaRow = {
  id: string
  vendor_code: string
  media_group: string
  doc_id: string | null
  label: string
  file_name: string
  storage_bucket: string
  storage_path: string
  mime_type: string | null
}

export function isSupabaseBackend() {
  return supabaseConfigured && supabase != null
}

export function rowToApplication(row: DbVendorRow): VendorApplication {
  const bankReady = row.bank_complete && row.bank_account_holder
  return {
    vendorId: row.vendor_code,
    mobile: row.mobile,
    contactName: row.contact_name,
    businessName: row.business_name,
    category: row.category_slug,
    city: row.city,
    email: row.email,
    address: row.address,
    experience: row.experience_years != null ? String(row.experience_years) : '',
    teamSize: row.team_size != null ? String(row.team_size) : '',
    equipment: row.equipment,
    area: row.area,
    pincode: row.pincode,
    serviceRadiusKm: row.service_radius_km != null ? String(row.service_radius_km) : '',
    serviceAreas: row.service_areas ?? [],
    baseLat: row.base_lat,
    baseLng: row.base_lng,
    portfolioLink: row.portfolio_link,
    portfolioVideo: row.portfolio_video,
    portfolioPhotos: [],
    portfolioVideos: [],
    portfolioClientWork: [],
    portfolioStudioWork: [],
    docsUploaded: [],
    photoUploaded: false,
    mediaSaved: row.media_saved,
    agreementAccepted: row.agreement_accepted,
    password: null,
    hasPassword: Boolean(row.password_hash),
    stage: row.stage as VendorStage,
    bankComplete: row.bank_complete,
    bankDetails: bankReady
      ? {
          accountHolder: row.bank_account_holder!,
          bankName: row.bank_name ?? '',
          accountNumber: row.bank_account_number ?? '',
          ifsc: row.bank_ifsc ?? '',
          chequeFileName: row.bank_cheque_path?.split('/').pop() ?? '',
        }
      : null,
    rank: (row.partner_rank as VendorRank) || 'none',
    qualityScore: row.quality_score,
    submittedAt: row.submitted_at,
  }
}

function applicationToPayload(app: VendorApplication) {
  return {
    vendor_code: app.vendorId,
    mobile: app.mobile,
    contact_name: app.contactName,
    business_name: app.businessName,
    category_slug: app.category,
    city: app.city,
    email: app.email,
    address: app.address,
    experience_years: app.experience || null,
    team_size: app.teamSize || null,
    equipment: app.equipment,
    area: app.area,
    pincode: app.pincode,
    service_radius_km: app.serviceRadiusKm || null,
    service_areas: app.serviceAreas,
    base_lat: app.baseLat,
    base_lng: app.baseLng,
    portfolio_link: app.portfolioLink,
    portfolio_video: app.portfolioVideo,
    stage: app.stage,
    bank_complete: app.bankComplete,
    bank_account_holder: app.bankDetails?.accountHolder ?? null,
    bank_name: app.bankDetails?.bankName ?? null,
    bank_account_number: app.bankDetails?.accountNumber ?? null,
    bank_ifsc: app.bankDetails?.ifsc ?? null,
    bank_cheque_path: app.bankDetails?.chequeFileName
      ? `${app.vendorId}/bank/${app.bankDetails.chequeFileName}`
      : null,
    partner_rank: app.rank,
    quality_score: app.qualityScore,
    agreement_accepted: app.agreementAccepted,
    media_saved: app.mediaSaved,
    submitted_at: app.submittedAt,
  }
}

export async function apiAllocateVendorId(mobile: string): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.rpc('allocate_vendor_code', { p_mobile: mobile })
  if (error) throw error
  return data as string
}

export async function apiSaveApplication(app: VendorApplication): Promise<VendorApplication> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.rpc('upsert_vendor_application', {
    p_payload: applicationToPayload(app),
  })
  if (error) throw error
  return rowToApplication(data as DbVendorRow)
}

export async function apiListApplications(): Promise<VendorApplication[]> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.rpc('list_vendor_applications')
  if (error) throw error
  return ((data as DbVendorRow[]) ?? []).map(rowToApplication)
}

export async function apiGetApplication(mobile?: string, vendorCode?: string): Promise<VendorApplication | null> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.rpc('get_vendor_application', {
    p_mobile: mobile ?? null,
    p_vendor_code: vendorCode ?? null,
  })
  if (error) throw error
  if (!data) return null
  return rowToApplication(data as DbVendorRow)
}

export async function apiAdvanceStage(mobile: string, stage: VendorStage): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.rpc('advance_vendor_stage', { p_mobile: mobile, p_stage: stage })
  if (error) throw error
}

export async function apiSetVendorRank(mobile: string, rank: VendorRank, qualityScore: number): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.rpc('set_vendor_application_rank', {
    p_mobile: mobile,
    p_rank: rank,
    p_score: qualityScore,
  })
  if (error) throw error
}

export async function apiCompleteBank(
  mobile: string,
  details: {
    accountHolder: string
    bankName: string
    accountNumber: string
    ifsc: string
    chequePath?: string
  },
): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.rpc('complete_vendor_bank', {
    p_mobile: mobile,
    p_payload: {
      account_holder: details.accountHolder,
      bank_name: details.bankName,
      account_number: details.accountNumber,
      ifsc: details.ifsc,
      cheque_path: details.chequePath ?? null,
    },
  })
  if (error) throw error
}

export async function apiSetVendorPassword(vendorId: string, password: string): Promise<boolean> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.rpc('set_vendor_application_password', {
    p_vendor_code: vendorId,
    p_password: password,
  })
  if (error) throw error
  return Boolean(data)
}

export async function apiLogin(userOrEmail: string, password: string): Promise<VendorApplication | null> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.rpc('login_vendor_application', {
    p_user_or_email: userOrEmail,
    p_password: password,
  })
  if (error) throw error
  if (!data) return null
  return rowToApplication(data as DbVendorRow)
}

export async function apiRegisterMedia(row: {
  vendorCode: string
  mediaGroup: string
  docId?: string
  label: string
  fileName: string
  storageBucket: string
  storagePath: string
  mimeType: string
}): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.rpc('register_vendor_media', {
    p_vendor_code: row.vendorCode,
    p_media_group: row.mediaGroup,
    p_doc_id: row.docId ?? null,
    p_label: row.label,
    p_file_name: row.fileName,
    p_storage_bucket: row.storageBucket,
    p_storage_path: row.storagePath,
    p_mime_type: row.mimeType,
  })
  if (error) throw error
}

export async function apiListMedia(vendorCode: string): Promise<DbMediaRow[]> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.rpc('list_vendor_application_media', {
    p_vendor_code: vendorCode,
  })
  if (error) throw error
  return (data as DbMediaRow[]) ?? []
}

export function storagePublicUrl(bucket: string, path: string) {
  if (!supabase) return ''
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function storageUpload(bucket: string, path: string, file: File, upsert = true) {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert,
    contentType: file.type || 'application/octet-stream',
  })
  if (error) throw error
}

export async function storageDownload(bucket: string, path: string) {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.storage.from(bucket).download(path)
  if (error) throw error
  return data
}
