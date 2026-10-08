export type CityCoord = { lat: number; lng: number }

/** Approximate centers for Wedyora service cities (OpenStreetMap / Leaflet). */
export const CITY_COORDS: Record<string, CityCoord> = {
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kerala: { lat: 9.9312, lng: 76.2673 },
  Pondicherry: { lat: 11.9416, lng: 79.8083 },
}

export function getCityCoord(city: string): CityCoord | null {
  return CITY_COORDS[city] ?? null
}
