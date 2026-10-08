/** Demo OTP until MSG91 is wired. Replace sendVendorOtp() with the MSG91 API. */

export const DEMO_VENDOR_OTP = '123456'
const SESSION_KEY = 'wedyora-vendor-session'
const PENDING_MOBILE_KEY = 'wedyora-vendor-pending-mobile'

export function normalizeMobile(value: string) {
  return value.replace(/\D/g, '').slice(-10)
}

export async function sendVendorOtp(mobile: string): Promise<{ ok: boolean; message: string }> {
  // TODO: MSG91 send OTP
  const phone = normalizeMobile(mobile)
  if (phone.length !== 10) {
    return { ok: false, message: 'Enter a 10-digit mobile number.' }
  }
  return { ok: true, message: 'OTP sent to your mobile.' }
}

export function verifyVendorOtp(mobile: string, otp: string) {
  // TODO: MSG91 verify OTP
  return normalizeMobile(mobile).length === 10 && otp.trim() === DEMO_VENDOR_OTP
}

/** After first-time OTP, allow registration for this mobile. */
export function setPendingMobile(mobile: string) {
  sessionStorage.setItem(PENDING_MOBILE_KEY, normalizeMobile(mobile))
}

export function getPendingMobile(): string | null {
  return sessionStorage.getItem(PENDING_MOBILE_KEY)
}

export function clearPendingMobile() {
  sessionStorage.removeItem(PENDING_MOBILE_KEY)
}

export function setVendorSession(mobile: string, vendorId?: string) {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ mobile: normalizeMobile(mobile), vendorId: vendorId ?? null, at: Date.now() }),
  )
}

export function getVendorSession(): { mobile: string; vendorId: string | null } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { mobile: string; vendorId?: string | null }
    return { mobile: parsed.mobile, vendorId: parsed.vendorId ?? null }
  } catch {
    return null
  }
}

export function clearVendorSession() {
  sessionStorage.removeItem(SESSION_KEY)
}
