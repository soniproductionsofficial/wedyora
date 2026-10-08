/** Demo customer OTP — mirror vendorOtp until MSG91 is wired. */

export const DEMO_CUSTOMER_OTP = '123456'
const SESSION_KEY = 'wedyora-customer-session'

export function normalizeMobile(value: string) {
  return value.replace(/\D/g, '').slice(-10)
}

export async function sendCustomerOtp(mobile: string): Promise<{ ok: boolean; message: string }> {
  const phone = normalizeMobile(mobile)
  if (phone.length !== 10) {
    return { ok: false, message: 'Enter a 10-digit mobile number.' }
  }
  return { ok: true, message: 'OTP sent to your mobile.' }
}

export function verifyCustomerOtp(mobile: string, otp: string) {
  return normalizeMobile(mobile).length === 10 && otp.trim() === DEMO_CUSTOMER_OTP
}

export type CustomerSession = {
  mobile: string
  name?: string
  at: number
}

export function setCustomerSession(mobile: string, name?: string) {
  const session: CustomerSession = {
    mobile: normalizeMobile(mobile),
    name: name?.trim() || undefined,
    at: Date.now(),
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getCustomerSession(): CustomerSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CustomerSession
  } catch {
    return null
  }
}

export function clearCustomerSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function requireCustomerLogin(): boolean {
  return !getCustomerSession()
}
