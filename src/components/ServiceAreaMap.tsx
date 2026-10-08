import { useEffect } from 'react'
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { getCityCoord } from '../lib/cityCoords'
import 'leaflet/dist/leaflet.css'

const pin = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function Recenter({ lat, lng, radiusKm }: { lat: number; lng: number; radiusKm: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], radiusKm >= 100 ? 8 : radiusKm >= 50 ? 9 : 10)
  }, [lat, lng, radiusKm, map])
  return null
}

export function ServiceAreaMap({
  city,
  radiusKm,
  lat,
  lng,
}: {
  city: string
  radiusKm: string
  lat?: number | null
  lng?: number | null
}) {
  const fromCity = getCityCoord(city)
  const center =
    lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)
      ? { lat, lng }
      : fromCity
  const km = Number(radiusKm) || 25

  if (!center) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-[#d8c9ce] bg-white text-sm text-muted">
        Enter city or pincode to show the map
      </div>
    )
  }

  return (
    <div className="h-56 overflow-hidden rounded-xl border border-[#8e1454]/20">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={10}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter lat={center.lat} lng={center.lng} radiusKm={km} />
        <Marker position={[center.lat, center.lng]} icon={pin} />
        <Circle
          center={[center.lat, center.lng]}
          radius={km * 1000}
          pathOptions={{ color: '#8e1454', fillColor: '#8e1454', fillOpacity: 0.15, weight: 2 }}
        />
      </MapContainer>
    </div>
  )
}
