import {
  Camera,
  ChefHat,
  Clapperboard,
  Flower2,
  Music,
  Paintbrush,
  Plane,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type { ShopService } from '../data/shopPackages'
import { formatInr, isCateringPackage } from '../data/shopPackages'

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  photography: Camera,
  videography: Clapperboard,
  drone: Plane,
  decoration: Flower2,
  catering: ChefHat,
  makeup: Sparkles,
  mehendi: Paintbrush,
  music: Music,
}

export function getServiceIcon(id: string): LucideIcon {
  return SERVICE_ICONS[id] ?? Sparkles
}

export function getServiceFromPrice(service: ShopService): number {
  if (service.id === 'catering') {
    return Math.min(
      ...service.packages.map((p) => {
        if (isCateringPackage(p)) {
          return Math.min(p.vegPrice ?? p.price, p.nonVegPrice ?? p.price)
        }
        return p.price
      }),
    )
  }
  return Math.min(...service.packages.map((p) => p.price))
}

export function serviceKpiMeta(service: ShopService) {
  return {
    icon: getServiceIcon(service.id),
    fromPrice: getServiceFromPrice(service),
    packageCount: service.packages.length,
  }
}

export function formatServiceFrom(service: ShopService): string {
  return `From ${formatInr(getServiceFromPrice(service))}`
}

/** Uppercase badge on service KPI cards. */
export const SERVICE_BADGES: Record<string, string> = {
  photography: 'Professional Photography',
  videography: 'Cinematic Videography',
  drone: 'Aerial Drone Coverage',
  decoration: 'Decoration & Venue',
  catering: 'Premium Catering',
  makeup: 'Bridal Makeup Artists',
  mehendi: 'Mehendi Artists',
  music: 'DJ & Live Music',
}

export function getServiceBadge(id: string, name: string): string {
  return (SERVICE_BADGES[id] ?? name).toUpperCase()
}
