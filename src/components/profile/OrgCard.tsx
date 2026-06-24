import Link from 'next/link'
import { IconCircleCheck, IconMapPin, IconUsers, IconBriefcase, IconArrowUpRight } from '@tabler/icons-react'

export interface OrgCardData {
  slug: string
  name: string
  initials: string
  type: 'Entreprise' | 'Université' | 'École' | 'ONG' | 'Institution'
  sector: string
  city: string
  country: string
  verified: boolean
  membersOnBcarte: number
  activeOffers: number
  logoColor: string
}

export default function OrgCard({ org }: { org: OrgCardData }) {
  return (
    <Link href={`/org/${org.slug}`} className="card hover:shadow-md hover:border-primary-border transition-all block group">
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: org.logoColor }}
        >
          <span className="text-sm font-extrabold text-white tracking-tight">{org.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-semibold text-text-primary text-sm group-hover:text-primary transition-colors leading-tight">{org.name}</p>
            {org.verified && <IconCircleCheck size={13} className="text-success flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[11px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-badge">{org.type}</span>
            <span className="text-xs text-text-tertiary">{org.sector}</span>
          </div>
          <p className="text-text-tertiary text-xs flex items-center gap-1 mt-1">
            <IconMapPin size={11} />
            {org.city}, {org.country}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary flex items-center gap-1">
            <IconUsers size={13} className="text-text-tertiary" />
            {org.membersOnBcarte} membre{org.membersOnBcarte > 1 ? 's' : ''}
          </span>
          {org.activeOffers > 0 && (
            <span className="text-xs text-success flex items-center gap-1">
              <IconBriefcase size={13} />
              {org.activeOffers} offre{org.activeOffers > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F3F4F6] group-hover:bg-primary-light transition-colors">
          <IconArrowUpRight size={13} className="text-text-tertiary group-hover:text-primary transition-colors" />
        </span>
      </div>
    </Link>
  )
}
