import { Camera, Heart, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import { SHOP_SERVICES } from './shopPackages'

export type NavServiceItem = {
  id: string
  name: string
  to: string
}

export type NavServiceGroup = {
  id: string
  label: string
  icon: LucideIcon
  items: NavServiceItem[]
}

function category(id: string, name?: string): NavServiceItem {
  const service = SHOP_SERVICES.find((s) => s.id === id)
  return { id, name: name ?? service?.name ?? id, to: `/services#${id}` }
}

function packageItem(packageId: string, name: string): NavServiceItem {
  return { id: packageId, name, to: `/services#${packageId}` }
}

/** Navbar mega-menu — Wedyora services only. */
export const navServiceGroups: NavServiceGroup[] = [
  {
    id: 'capture',
    label: 'Capture & Media',
    icon: Camera,
    items: [
      category('photography'),
      category('videography'),
      category('drone'),
      packageItem('photo-prewedding', 'Pre-Wedding'),
      packageItem('photo-maternity', 'Maternity Shoot'),
      packageItem('photo-baby', 'Toddler / Baby Shoot'),
      packageItem('decor-housewarming', 'Housewarming'),
    ],
  },
  {
    id: 'artisans',
    label: 'Wedding Artisans',
    icon: Heart,
    items: [
      category('decoration', 'Decoration & Venue'),
      category('makeup'),
      category('mehendi'),
      category('music'),
    ],
  },
  {
    id: 'feast',
    label: 'Feast',
    icon: UtensilsCrossed,
    items: [category('catering')],
  },
]

export const navServicesTotal = navServiceGroups.reduce((n, g) => n + g.items.length, 0)

export const navServicesSummary = `${navServicesTotal} services across capture, artisans & feast`
