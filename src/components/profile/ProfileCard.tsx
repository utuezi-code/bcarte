import Link from 'next/link'
import { IconMapPin, IconCircleCheck, IconBrandWhatsapp, IconMail } from '@tabler/icons-react'
import { Profile, AvailabilityStatus } from '@/lib/types'

function getAvatarColor(name: string): string {
  const colors = [
    'bg-[#7C5CBF]', 'bg-[#059669]', 'bg-[#C9A84C]',
    'bg-[#2563EB]', 'bg-[#DC2626]', 'bg-[#7C3AED]',
    'bg-[#0891B2]', 'bg-[#D97706]',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const AVAILABILITY_LABELS: Record<AvailabilityStatus, { dot: string; label: string }> = {
  disponible: { dot: 'bg-success', label: 'Disponible' },
  en_veille: { dot: 'bg-[#F59E0B]', label: 'En veille' },
  indisponible: { dot: 'bg-text-tertiary', label: 'Indisponible' },
}

interface Props {
  profile: Profile
}

export default function ProfileCard({ profile }: Props) {
  const avail = AVAILABILITY_LABELS[profile.availabilityStatus]

  return (
    <div className="card hover:shadow-md hover:border-primary-border transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full ${getAvatarColor(profile.fullName)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {getInitials(profile.fullName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-semibold text-text-primary text-sm">{profile.fullName}</p>
            {profile.verified && (
              <span className="badge-verified">
                <IconCircleCheck size={11} />
                Vérifié
              </span>
            )}
          </div>
          <p className="text-text-secondary text-xs mt-0.5 truncate">{profile.title}</p>
          <p className="text-text-tertiary text-xs flex items-center gap-1 mt-0.5">
            <IconMapPin size={11} />
            {profile.city}, {profile.country}
          </p>
        </div>
      </div>

      {/* Skills */}
      {profile.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {profile.skills.slice(0, 3).map((skill) => (
            <span key={skill.id} className="text-[11px] bg-primary-light text-primary px-2 py-0.5 rounded-badge font-medium">
              {skill.label}
            </span>
          ))}
          {profile.skills.length > 3 && (
            <span className="text-[11px] bg-[#F3F4F6] text-text-secondary px-2 py-0.5 rounded-badge font-medium">
              +{profile.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Availability */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span className={`w-2 h-2 rounded-full ${avail.dot}`} />
          {avail.label}
        </span>
        <div className="flex items-center gap-1">
          {profile.whatsapp && (
            <a
              href={`https://wa.me/${profile.whatsapp.replace(/\s+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contacter via WhatsApp"
              className="w-8 h-8 flex items-center justify-center rounded-btn bg-[#ECFDF5] hover:bg-[#D1FAE5] transition-colors"
            >
              <IconBrandWhatsapp size={16} className="text-whatsapp" />
            </a>
          )}
          {profile.contactEmail && (
            <a
              href={`mailto:${profile.contactEmail}`}
              aria-label="Envoyer un email"
              className="w-8 h-8 flex items-center justify-center rounded-btn bg-primary-light hover:bg-[#EDE9FE] transition-colors"
            >
              <IconMail size={16} className="text-primary" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
