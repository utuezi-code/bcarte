export type UserRole = 'professionnel' | 'recruteur' | 'institution' | 'admin'
export type AvailabilityStatus = 'disponible' | 'en_veille' | 'indisponible'
export type VerificationStatus = 'non_demandée' | 'en_attente' | 'confirmée' | 'rejetée'
export type NFCStatus = 'commandée' | 'en_fabrication' | 'expédiée' | 'livrée'
export type PublicationType = 'thèse' | 'article' | 'autre'

export interface User {
  id: string
  email: string
  role: UserRole
  emailVerified: boolean
  createdAt: string
}

export interface Skill {
  id: string
  label: string
}

export interface Experience {
  id: string
  title: string
  organization: string
  startDate: string
  endDate: string | null
  current: boolean
  verificationStatus: VerificationStatus
  institutionId?: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  startDate: string
  endDate: string | null
  current: boolean
  verificationStatus: VerificationStatus
}

export interface Publication {
  id: string
  type: PublicationType
  title: string
  link: string
}

export interface Profile {
  id: string
  userId: string
  fullName: string
  title: string
  city: string
  country: string
  sector: string
  languages: string[]
  availabilityStatus: AvailabilityStatus
  whatsapp: string
  contactEmail: string
  externalLink: string
  profileViewsCount: number
  publicUrlSlug: string
  skills: Skill[]
  experiences: Experience[]
  education: Education[]
  publications: Publication[]
  verified: boolean
  completionPercent: number
}

export interface Organization {
  id: string
  name: string
  type: 'recruteur' | 'institution'
  verified: boolean
  logo?: string
  description?: string
}

export interface JobOffer {
  id: string
  organizationId: string
  title: string
  description: string
  location: string
  createdAt: string
}

export interface VerificationRequest {
  id: string
  type: 'experience' | 'education'
  itemId: string
  itemTitle: string
  profileName: string
  profileTitle: string
  institutionEmail: string
  status: VerificationStatus
  sentAt: string
  resolvedAt?: string
}

export interface NFCCard {
  profileId: string
  status: NFCStatus
  designVariant: 'violet' | 'or'
  vcardData: {
    name: string
    title: string
    organization: string
    whatsapp: string
    email: string
    profileUrl: string
  }
}
