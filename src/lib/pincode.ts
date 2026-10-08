import { CITY_COORDS, type CityCoord } from './cityCoords'

/** Common Wedyora-area pincodes → city (offline fallback). */
const PIN_CITY: Record<string, string> = {
  // Bengaluru
  '560001': 'Bengaluru',
  '560002': 'Bengaluru',
  '560003': 'Bengaluru',
  '560004': 'Bengaluru',
  '560008': 'Bengaluru',
  '560025': 'Bengaluru',
  '560034': 'Bengaluru',
  '560038': 'Bengaluru',
  '560066': 'Bengaluru',
  '560068': 'Bengaluru',
  '560076': 'Bengaluru',
  '560100': 'Bengaluru',
  // Hyderabad
  '500001': 'Hyderabad',
  '500003': 'Hyderabad',
  '500016': 'Hyderabad',
  '500032': 'Hyderabad',
  '500033': 'Hyderabad',
  '500034': 'Hyderabad',
  '500081': 'Hyderabad',
  '500084': 'Hyderabad',
  // Chennai
  '600001': 'Chennai',
  '600002': 'Chennai',
  '600004': 'Chennai',
  '600017': 'Chennai',
  '600028': 'Chennai',
  '600040': 'Chennai',
  '600042': 'Chennai',
  '600100': 'Chennai',
  // Kerala (Kochi / Ernakulam)
  '682001': 'Kerala',
  '682011': 'Kerala',
  '682015': 'Kerala',
  '682016': 'Kerala',
  '682018': 'Kerala',
  '682020': 'Kerala',
  '682030': 'Kerala',
  '695001': 'Kerala',
  '695014': 'Kerala',
  // Pondicherry
  '605001': 'Pondicherry',
  '605003': 'Pondicherry',
  '605008': 'Pondicherry',
  '605010': 'Pondicherry',
  '605014': 'Pondicherry',
}

export type PincodeLookup = {
  city: string
  area: string
  coord: CityCoord | null
}

function mapDistrictToCity(district: string, state: string): string {
  const d = district.toLowerCase()
  const s = state.toLowerCase()
  if (d.includes('bangalore') || d.includes('bengaluru')) return 'Bengaluru'
  if (d.includes('hyderabad') || d.includes('rangareddy') || d.includes('medchal')) return 'Hyderabad'
  if (d.includes('chennai') || d.includes('kancheepuram') || d.includes('tiruvallur')) return 'Chennai'
  if (s.includes('kerala') || d.includes('ernakulam') || d.includes('thiruvananthapuram') || d.includes('kochi'))
    return 'Kerala'
  if (d.includes('pondicherry') || d.includes('puducherry') || s.includes('puducherry')) return 'Pondicherry'
  return district
}

/**
 * Resolve Indian pincode → city / area. Tries local map first, then India Post API.
 * City can still be edited manually by the vendor after autofill.
 */
export async function lookupPincode(pin: string): Promise<PincodeLookup | null> {
  const pincode = pin.replace(/\D/g, '').slice(0, 6)
  if (pincode.length !== 6) return null

  const localCity = PIN_CITY[pincode]
  if (localCity) {
    return {
      city: localCity,
      area: '',
      coord: CITY_COORDS[localCity] ?? null,
    }
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    const data = (await res.json()) as Array<{
      Status?: string
      PostOffice?: Array<{ Name?: string; District?: string; State?: string; Block?: string }>
    }>
    const office = data?.[0]?.PostOffice?.[0]
    if (data?.[0]?.Status !== 'Success' || !office) return null
    const city = mapDistrictToCity(office.District ?? '', office.State ?? '')
    const area = office.Name || office.Block || ''
    return {
      city,
      area,
      coord: CITY_COORDS[city] ?? null,
    }
  } catch {
    return null
  }
}
