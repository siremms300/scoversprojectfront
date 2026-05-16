export const APP_NAME = 'Scovers Education'
export const APP_DESCRIPTION = 'Your Gateway to Global Education'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const APPLICATION_STATUSES = [
  'draft',
  'submitted',
  'under_review',
  'processing',
  'documents_pending',
  'interview_scheduled',
  'accepted',
  'rejected',
  'completed',
] as const

export const PROBABILITY_SCORES = ['high', 'medium', 'low', 'pending'] as const

export const SOURCES = [
  'ads',
  'agent',
  'referral',
  'organic',
  'social_media',
  'email',
  'other',
] as const

export const COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United Kingdom',
  'United States', 'Canada', 'Australia', 'Germany', 'France',
  'Ireland', 'Netherlands', 'Sweden', 'Norway', 'Finland',
  'Denmark', 'Belgium', 'Switzerland', 'Austria', 'Italy',
  'Spain', 'Portugal', 'Malaysia', 'Singapore', 'Japan',
  'South Korea', 'China', 'India', 'UAE', 'Qatar',
]

export const PROGRAM_LEVELS = [
  'certificate',
  'diploma',
  'associate',
  'bachelors',
  'masters',
  'phd',
  'postdoctoral',
  'professional',
]

export const NAVIGATION = [
  {
    name: 'Find Institutions',
    href: '/institutions',
    children: [
      { name: 'Universities', href: '/institutions?type=university' },
      { name: 'Colleges', href: '/institutions?type=college' },
      { name: 'Polytechnics', href: '/institutions?type=polytechnic' },
    ],
  },
  { name: 'Courses', href: '/courses' },
  { name: 'UPI Program', href: '/upi-program' },
  { name: 'Scholarships', href: '/scholarships' },
  { name: 'Blog', href: '/blog' },
]