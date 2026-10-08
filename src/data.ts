export type Category = {
  slug: string
  name: string
  count: number
  image: string
  blurb: string
}

export type Vendor = {
  id: string
  name: string
  category: string
  city: string
  rating: number
  reviews: number
  startingPrice: number
  priceUnit: string
  featured: boolean
  verified: boolean
  image: string
  gallery: string[]
  tagline: string
  about: string
  services: string[]
  packages: { name: string; price: number; includes: string[] }[]
}

export type Venue = {
  id: string
  name: string
  type: string
  city: string
  capacity: string
  plateFrom: number
  rating: number
  image: string
}

export type Story = {
  id: string
  couple: string
  city: string
  date: string
  style: string
  image: string
  excerpt: string
}

export const cities = [
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kerala',
  'Pondicherry',
]

export const categories: Category[] = [
  {
    slug: 'photographers',
    name: 'Photographers',
    count: 24541,
    image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Cinematic stills, candid documentary and editorial albums.',
  },
  {
    slug: 'venues',
    name: 'Venues',
    count: 52606,
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Palaces, lawns, hotels and destination estates.',
  },
  {
    slug: 'makeup',
    name: 'Makeup Artists',
    count: 26929,
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Bridal, family and trial looks with on-site teams.',
  },
  {
    slug: 'planners',
    name: 'Planners',
    count: 3821,
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Full-service direction from moodboard to last dance.',
  },
  {
    slug: 'decorators',
    name: 'Decorators',
    count: 3612,
    image:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Floral architecture, lighting and mandap ateliers.',
  },
  {
    slug: 'mehndi',
    name: 'Mehndi Artists',
    count: 3546,
    image:
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Bridal, guest and contemporary Arabic-Indian hybrids.',
  },
  {
    slug: 'reels',
    name: 'Reel Makers',
    count: 1840,
    image:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    blurb: 'On-site cinematic reels delivered before the night ends.',
  },
  {
    slug: 'caterers',
    name: 'Caterers',
    count: 1471,
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Regional menus, live counters and plated tasting menus.',
  },
  {
    slug: 'dj',
    name: 'DJ & Live Music',
    count: 350,
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Sangeet bands, DJs and ceremony soundscapes.',
  },
  {
    slug: 'jewellery',
    name: 'Jewellery',
    count: 261,
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Heirloom polki, contemporary gold and rental sets.',
  },
  {
    slug: 'wear',
    name: 'Bridal Designers',
    count: 310,
    image:
      'https://images.unsplash.com/photo-1595475878913-2cb0292d8273?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Couture lehengas, sherwanis and reception silhouettes.',
  },
  {
    slug: 'cars',
    name: 'Wedding Cars',
    count: 181,
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Vintage, luxury and decorated baraat fleets.',
  },
]

export const vendorServiceCategories = [
  { slug: 'photographers', name: 'Photographers' },
  { slug: 'videography', name: 'Videography' },
  { slug: 'video-editors', name: 'Video editors' },
  { slug: 'drone-operators', name: 'Drone operators' },
  { slug: 'makeup', name: 'Makeup Artists' },
  { slug: 'decorators', name: 'Decorators' },
  { slug: 'wedding-decors', name: 'Wedding decors' },
  { slug: 'event-management', name: 'Event management' },
  { slug: 'mehndi', name: 'Mehndi Artists' },
  { slug: 'reels', name: 'Reel Makers' },
  { slug: 'catering', name: 'Catering' },
  { slug: 'dj', name: 'DJ & Live Music' },
  { slug: 'wear', name: 'Bridal Designers' },
  { slug: 'cars', name: 'Wedding Cars' },
]

const galleryPool = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=80',
]

export const vendors: Vendor[] = [
  {
    id: 'aperture-atelier',
    name: 'Aperture Atelier',
    category: 'photographers',
    city: 'Bengaluru',
    rating: 4.9,
    reviews: 312,
    startingPrice: 85000,
    priceUnit: 'per day',
    featured: true,
    verified: true,
    image: galleryPool[0],
    gallery: galleryPool,
    tagline: 'Quiet documentary. Editorial colour. Film grain.',
    about:
      'Aperture Atelier photographs Indian weddings as cinema — long takes, unforced emotion, and an album that still feels alive ten years later. Dual shooters, colour science built for gold and magenta palettes, and a discreet on-floor presence.',
    services: ['Candid photography', 'Cinematic film', 'Pre-wedding', 'Drone', 'Same-day edit'],
    packages: [
      { name: 'Intimate', price: 85000, includes: ['1 photographer', '8 hours', '200 edited images'] },
      { name: 'Signature', price: 165000, includes: ['2 photographers', 'Cinematic film', 'Same-day reel'] },
      { name: 'House', price: 280000, includes: ['Full team', '3-day coverage', 'Heirloom album'] },
    ],
  },
  {
    id: 'noir-nuptials',
    name: 'Noir Nuptials',
    category: 'photographers',
    city: 'Mumbai',
    rating: 4.8,
    reviews: 198,
    startingPrice: 120000,
    priceUnit: 'per day',
    featured: true,
    verified: true,
    image: galleryPool[1],
    gallery: [...galleryPool].reverse(),
    tagline: 'Black-tie stills for city and destination weddings.',
    about:
      'Studio-trained, fashion-led photography for couples who want magazine-grade portraits without losing the chaos of a real Indian wedding.',
    services: ['Editorial portraits', 'Destination', 'Family formal', 'After-hours'],
    packages: [
      { name: 'City Day', price: 120000, includes: ['Lead + second', '10 hours', 'Online gallery'] },
      { name: 'Destination', price: 240000, includes: ['Travel included', '2 days', 'Teaser film'] },
    ],
  },
  {
    id: 'lumen-house',
    name: 'Lumen House Makeup',
    category: 'makeup',
    city: 'Delhi NCR',
    rating: 4.9,
    reviews: 421,
    startingPrice: 35000,
    priceUnit: 'bridal',
    featured: true,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc37cd9?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc37cd9?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1400&q=80',
      galleryPool[3],
    ],
    tagline: 'Skin-first bridal makeup that photographs in gold light.',
    about:
      'Lumen House builds bridal looks that survive 16-hour days, flash, and candlelight. Trials are treated as fittings — colour, jewellery, and dupatta all tested on camera.',
    services: ['Bridal', 'Groom grooming', 'Family', 'Airbrush', 'Hair'],
    packages: [
      { name: 'Bride only', price: 35000, includes: ['Trial', 'Jewellery setting', 'Touch-ups'] },
      { name: 'Bride + family', price: 78000, includes: ['4 looks', 'On-site team'] },
    ],
  },
  {
    id: 'mandap-noir',
    name: 'Mandap Noir',
    category: 'decorators',
    city: 'Jaipur',
    rating: 4.7,
    reviews: 156,
    startingPrice: 450000,
    priceUnit: 'per event',
    featured: true,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80',
      galleryPool[2],
      galleryPool[4],
    ],
    tagline: 'Sculptural florals, black marble, and a single gold line.',
    about:
      'An atelier for couples who want restraint. We design one strong idea per function — then execute it at palace scale.',
    services: ['Mandap', 'Stage', 'Entrance', 'Lighting design'],
    packages: [
      { name: 'Ceremony', price: 450000, includes: ['Mandap + aisle', 'Lighting plot'] },
      { name: 'Three-day house', price: 1400000, includes: ['All functions', 'Florals + fabric'] },
    ],
  },
  {
    id: 'frame-in-ten',
    name: 'Frame in Ten',
    category: 'reels',
    city: 'Hyderabad',
    rating: 4.9,
    reviews: 640,
    startingPrice: 1999,
    priceUnit: 'per reel',
    featured: true,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80',
      galleryPool[5],
      galleryPool[0],
    ],
    tagline: 'Trained reel-makers. Shot, cut, delivered on the floor.',
    about:
      'Wedyora Reel partners arrive with cinema phones, a colour LUT matched to your theme, and a 10-minute delivery promise so guests can post while the baraat is still moving.',
    services: ['On-site reels', 'Sangeet coverage', 'Brand/event', 'RAW dump'],
    packages: [
      { name: 'Quick Shoot', price: 1999, includes: ['1 hour', '1 reel', 'On-site export'] },
      { name: 'Half Day', price: 4999, includes: ['3 hours', '2 reels'] },
      { name: 'Wedding Gold', price: 59999, includes: ['Full day', '6 reels', 'Highlight film'] },
    ],
  },
  {
    id: 'atelier-plan',
    name: 'Atelier Plan',
    category: 'planners',
    city: 'Udaipur',
    rating: 5,
    reviews: 88,
    startingPrice: 350000,
    priceUnit: 'planning fee',
    featured: false,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=80',
    gallery: [galleryPool[2], galleryPool[1], galleryPool[4]],
    tagline: 'Destination direction with a black-and-gold production bible.',
    about:
      'We run destination weddings like film sets — call sheets, vendor wrangling, guest logistics, and a single point of taste.',
    services: ['Full planning', 'Partial', 'Destination', 'Guest management'],
    packages: [
      { name: 'Month-of', price: 350000, includes: ['Run of show', 'Vendor desk'] },
      { name: 'Full house', price: 900000, includes: ['Design + planning', 'On-ground team'] },
    ],
  },
  {
    id: 'henna-house',
    name: 'Henna House Studio',
    category: 'mehndi',
    city: 'Mumbai',
    rating: 4.8,
    reviews: 274,
    startingPrice: 18000,
    priceUnit: 'bridal',
    featured: false,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1400&q=80',
    ],
    tagline: 'Fine-line bridal mehndi with custom motifs from your story.',
    about:
      'Portrait-grade detail work, guest stations, and stain specialists who stay through the evening.',
    services: ['Bridal', 'Guests', 'Groom', 'White henna'],
    packages: [
      { name: 'Bride', price: 18000, includes: ['Arms + feet', 'Custom motif'] },
      { name: 'House', price: 45000, includes: ['Bride + 40 guests'] },
    ],
  },
  {
    id: 'saffron-table',
    name: 'Saffron Table',
    category: 'caterers',
    city: 'Chennai',
    rating: 4.6,
    reviews: 190,
    startingPrice: 1850,
    priceUnit: 'per plate',
    featured: false,
    verified: true,
    image:
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1400&q=80',
    ],
    tagline: 'Regional kitchens, live grills, dessert architecture.',
    about:
      'From Chettinad to Awadhi, we build menus that photograph as well as they taste — and we staff for 80 or 800.',
    services: ['Buffet', 'Plated', 'Live counters', 'Tastings'],
    packages: [
      { name: 'Classic', price: 1850, includes: ['Veg + non-veg', '3 live counters'] },
      { name: 'Atelier', price: 3200, includes: ['Chef table', 'Dessert lab'] },
    ],
  },
]

export const venues: Venue[] = [
  {
    id: 'obsidian-palace',
    name: 'Obsidian Palace',
    type: 'Heritage palace',
    city: 'Udaipur',
    capacity: '80 – 400',
    plateFrom: 6500,
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'gold-lawn',
    name: 'The Gold Lawn',
    type: 'Marriage garden',
    city: 'Jaipur',
    capacity: '200 – 1200',
    plateFrom: 2200,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'noir-ballroom',
    name: 'Noir Ballroom',
    type: '5-star hotel',
    city: 'Mumbai',
    capacity: '120 – 600',
    plateFrom: 4800,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'coastal-mandap',
    name: 'Coastal Mandap',
    type: 'Destination resort',
    city: 'Goa',
    capacity: '40 – 250',
    plateFrom: 3900,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80',
  },
]

export const stories: Story[] = [
  {
    id: 'ira-kabir',
    couple: 'Ira & Kabir',
    city: 'Udaipur',
    date: 'December 2025',
    style: 'Palace night',
    image: galleryPool[0],
    excerpt:
      'A black-tie mehndi under jharokhas, then a gold-lined pheras court that held 180 guests and one long film take.',
  },
  {
    id: 'meher-arjun',
    couple: 'Meher & Arjun',
    city: 'Goa',
    date: 'February 2026',
    style: 'Coastal modern',
    image: galleryPool[1],
    excerpt:
      'Barefoot sangeet, a magenta dusk baraat, and reels delivered before the first toast.',
  },
  {
    id: 'anya-veer',
    couple: 'Anya & Veer',
    city: 'Delhi NCR',
    date: 'November 2025',
    style: 'City editorial',
    image: galleryPool[3],
    excerpt:
      'A farmhouse transformed into a fashion set — charcoal drapes, a single floral mandap, no visual noise.',
  },
]

export const testimonials = [
  {
    quote:
      'Wedyora felt like a private studio, not a directory. The photographer they matched us with already understood our black-and-gold brief before the first call.',
    name: 'Harmeet Kaur',
    meta: 'Makeup & photography · Indore',
  },
  {
    quote:
      'We booked a reel-maker the morning of sangeet. The cut was on our phones before the DJ packed down. That is the product.',
    name: 'S. Rahul',
    meta: 'Reels · Bengaluru',
  },
  {
    quote:
      'Vendor prices, reviews, and a planner who actually negotiated. Planning stopped feeling like a second job.',
    name: 'Shatabdi & Rohan',
    meta: 'Destination · Chennai',
  },
]

export const reelPackages = [
  {
    id: 'quick',
    name: 'Quick Shoot',
    price: 1999,
    tag: 'For a single reel',
    popular: false,
    hours: 'Up to 1 hour',
    reels: '1 edited reel',
    items: [
      'On-site edit and export',
      'Trained, verified reel-maker',
      'Shot on cinema phone',
      'Colour matched to your theme',
    ],
  },
  {
    id: 'half',
    name: 'Half Day',
    price: 4999,
    tag: 'Most booked',
    popular: true,
    hours: 'Up to 3 hours',
    reels: '2 edited reels',
    items: [
      'On-site reel delivery',
      'Sangeet or cocktail coverage',
      'Trained, verified reel-maker',
      'Shot on cinema phone',
    ],
  },
  {
    id: 'gold',
    name: 'Wedding Gold',
    price: 59999,
    tag: 'Ceremony + reception',
    popular: false,
    hours: 'Full day',
    reels: '6 reels + highlight',
    items: [
      'Two creators',
      'Same-night highlight',
      'RAW optional add-on',
      'Live tracking from arrival',
    ],
  },
]

export const stats = [
  { value: '2.8L+', label: 'Verified vendors' },
  { value: '40+', label: 'Cities live' },
  { value: '20L+', label: 'Couples hosted' },
  { value: '4.9', label: 'Average rating' },
]
