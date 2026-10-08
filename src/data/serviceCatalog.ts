/** Wedyora service tree — Soni Productions photography in `public/services/`. */

function serviceImg(slug: string) {
  return `/services/${slug}.jpg`
}

export const portfolioGallery = [
  '/services/gallery-1.jpg',
  '/services/gallery-2.jpg',
  '/services/gallery-3.jpg',
  '/services/gallery-4.jpg',
  '/services/gallery-5.jpg',
  '/services/gallery-6.jpg',
  '/services/gallery-7.jpg',
  '/services/gallery-8.jpg',
] as const

/** Palace wedding hero — do not recompress; file lives in public/gallery */
export const heroImage = '/gallery/hero-wedding.jpg?v=3'

export type ServiceOption = {
  id: string
  label: string
  unitLabel: string
  min: number
  max: number
  default: number
  included: number
  pricePerUnit: number
}

export type CatalogService = {
  id: string
  slug: string
  name: string
  tagline: string
  image: string
  basePrice: number
  highlights: string[]
  options: ServiceOption[]
}

export type ServiceBranch = {
  id: string
  name: string
  description: string
  gradient: string
  accent: string
  services: CatalogService[]
}

const photoOption = (included: number, max: number): ServiceOption[] => [
  {
    id: 'traditional',
    label: 'Traditional photos',
    unitLabel: 'photos',
    min: included,
    max,
    default: included,
    included,
    pricePerUnit: 120,
  },
  {
    id: 'candid',
    label: 'Candid photos',
    unitLabel: 'photos',
    min: 0,
    max: Math.min(max * 2, 800),
    default: Math.floor(included * 0.6),
    included: Math.floor(included * 0.4),
    pricePerUnit: 180,
  },
]

const hoursOption = (included: number, max: number, rate: number): ServiceOption[] => [
  {
    id: 'hours',
    label: 'Coverage hours',
    unitLabel: 'hours',
    min: included,
    max,
    default: included,
    included,
    pricePerUnit: rate,
  },
]

const guestOption = (included: number, max: number, rate: number): ServiceOption[] => [
  {
    id: 'guests',
    label: 'Guest count',
    unitLabel: 'guests',
    min: included,
    max,
    default: included,
    included,
    pricePerUnit: rate,
  },
]

export const serviceBranches: ServiceBranch[] = [
  {
    id: 'photo-video',
    name: 'Photography & Videography',
    description: 'Cinematic coverage for every chapter of your celebration.',
    gradient: 'from-[#8e1454] via-[#5c1838] to-[#2d0f1c]',
    accent: '#D4AF37',
    services: [
      {
        id: 'wedding-photography',
        slug: 'wedding-photography',
        name: 'Wedding Photography',
        tagline: 'Full-day heirloom coverage with candid storytelling.',
        image: serviceImg('wedding-photography'),
        basePrice: 45000,
        highlights: ['Lead photographer + assistant', 'Same-day preview reel', 'Online gallery delivery'],
        options: photoOption(400, 600),
      },
      {
        id: 'pre-wedding',
        slug: 'pre-wedding',
        name: 'Pre-Wedding',
        tagline: 'Destination or city shoots with cinematic direction.',
        image: serviceImg('pre-wedding'),
        basePrice: 28000,
        highlights: ['2 locations', 'Styled direction', '30 edited stills included'],
        options: [...photoOption(80, 200), ...hoursOption(4, 10, 3500)],
      },
      {
        id: 'maternity',
        slug: 'maternity',
        name: 'Maternity',
        tagline: 'Soft light portraits in studio, garden, or at home.',
        image: serviceImg('maternity'),
        basePrice: 12000,
        highlights: ['Wardrobe guidance', 'Retouched album set', 'Partner & sibling frames'],
        options: photoOption(40, 80),
      },
      {
        id: 'baby-newborn',
        slug: 'baby-newborn',
        name: 'Toddler / Baby Shoot',
        tagline: 'Gentle, safe newborn and milestone sessions.',
        image: serviceImg('baby-newborn'),
        basePrice: 9500,
        highlights: ['Prop styling', 'Parent + baby combos', 'Print-ready files'],
        options: photoOption(35, 70),
      },
      {
        id: 'birthday',
        slug: 'birthday',
        name: 'Birthday',
        tagline: 'From intimate home parties to grand milestone celebrations.',
        image: serviceImg('birthday'),
        basePrice: 8500,
        highlights: ['Candid + posed mix', 'Same-day highlights', 'Family group shots'],
        options: [...photoOption(60, 150), ...hoursOption(3, 8, 2200)],
      },
      {
        id: 'housewarming-pooja',
        slug: 'housewarming-pooja',
        name: 'Housewarming / Pooja',
        tagline: 'Document rituals, family blessings, and the new home.',
        image: serviceImg('housewarming-pooja'),
        basePrice: 7500,
        highlights: ['Ritual coverage', 'Home portrait set', 'Quick turnaround edits'],
        options: [...photoOption(50, 120), ...hoursOption(2, 6, 2000)],
      },
      {
        id: 'corporate-product',
        slug: 'corporate-product',
        name: 'Corporate / Product Shoot',
        tagline: 'Brand campaigns, headshots, and catalog product stills.',
        image: serviceImg('corporate-product'),
        basePrice: 18000,
        highlights: ['Lighting kit on-site', 'Commercial usage license', 'Color-graded deliverables'],
        options: [...photoOption(30, 100), ...hoursOption(4, 12, 4000)],
      },
      {
        id: 'reels-short-videos',
        slug: 'reels-short-videos',
        name: 'Reels & Short Videos',
        tagline: 'Vertical reels delivered before the night ends.',
        image: serviceImg('reels-short-videos'),
        basePrice: 5999,
        highlights: ['On-site editor', 'Trending audio sync', '3–5 reel variants'],
        options: [
          {
            id: 'reels',
            label: 'Reel count',
            unitLabel: 'reels',
            min: 3,
            max: 15,
            default: 5,
            included: 3,
            pricePerUnit: 1500,
          },
          ...hoursOption(4, 10, 2500),
        ],
      },
      {
        id: 'drone-services',
        slug: 'drone-services',
        name: 'Drone Services',
        tagline: 'Licensed aerials for venues, processions, and films.',
        image: serviceImg('drone-services'),
        basePrice: 15000,
        highlights: ['DGCA-compliant pilot', '4K aerial footage', 'Venue reveal shots'],
        options: hoursOption(2, 6, 4500),
      },
    ],
  },
  {
    id: 'wedding-services',
    name: 'Wedding Services',
    description: 'Every artisan and experience to complete your day.',
    gradient: 'from-[#3a171e] via-[#8e1454] to-[#D4AF37]/40',
    accent: '#F6E04D',
    services: [
      {
        id: 'makeup-artists',
        slug: 'makeup-artists',
        name: 'Makeup Artists',
        tagline: 'Bridal, family, and trial looks with on-site teams.',
        image: serviceImg('makeup-artists'),
        basePrice: 18000,
        highlights: ['HD bridal makeup', 'Trial session', 'Touch-up kit on-site'],
        options: guestOption(1, 8, 3500),
      },
      {
        id: 'mehendi',
        slug: 'mehendi',
        name: 'Mehendi',
        tagline: 'Bridal, Arabic-Indian fusion, and guest mehendi artists.',
        image: serviceImg('mehendi'),
        basePrice: 8000,
        highlights: ['Custom bridal design', 'Organic cones', 'Guest packages available'],
        options: guestOption(1, 15, 450),
      },
      {
        id: 'decorators',
        slug: 'decorators',
        name: 'Decorators & Venues',
        tagline: 'Mandap, floral architecture, lighting, and ceremony spaces.',
        image: serviceImg('decorators'),
        basePrice: 85000,
        highlights: ['3D mock-ups', 'Fresh florals', 'Banquet & destination venues'],
        options: guestOption(100, 800, 120),
      },
      {
        id: 'caterers',
        slug: 'caterers',
        name: 'Caterers',
        tagline: 'Regional menus, live counters, and plated service.',
        image: serviceImg('caterers'),
        basePrice: 450,
        highlights: ['Per-plate pricing', 'Live counters', 'Tasting session'],
        options: guestOption(50, 1000, 450),
      },
      {
        id: 'wedding-planners',
        slug: 'wedding-planners',
        name: 'Wedding Planners',
        tagline: 'End-to-end direction from moodboard to last dance.',
        image: serviceImg('wedding-planners'),
        basePrice: 75000,
        highlights: ['Vendor coordination', 'Run-of-show', 'On-day command center'],
        options: guestOption(50, 500, 0),
      },
      {
        id: 'dj-live-music',
        slug: 'dj-live-music',
        name: 'DJ & Live Music',
        tagline: 'Sangeet nights, reception sound, and live bands.',
        image: serviceImg('entertainment'),
        basePrice: 35000,
        highlights: ['Sound + lighting', 'MC coordination', 'Custom playlists'],
        options: hoursOption(3, 8, 8000),
      },
    ],
  },
]

export function getAllServices(): CatalogService[] {
  return serviceBranches.flatMap((b) => b.services)
}

export function getServiceById(id: string): CatalogService | undefined {
  return getAllServices().find((s) => s.id === id)
}

export function getBranchForService(id: string): ServiceBranch | undefined {
  return serviceBranches.find((b) => b.services.some((s) => s.id === id))
}

export function calcLineTotal(
  service: CatalogService,
  selections: Record<string, number>,
): number {
  let total = service.basePrice
  for (const opt of service.options) {
    const qty = selections[opt.id] ?? opt.default
    const extra = Math.max(0, qty - opt.included)
    total += extra * opt.pricePerUnit
  }
  return total
}

export function defaultSelections(service: CatalogService): Record<string, number> {
  return Object.fromEntries(service.options.map((o) => [o.id, o.default]))
}
