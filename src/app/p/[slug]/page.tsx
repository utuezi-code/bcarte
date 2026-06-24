import Link from 'next/link'
import {
  IconMapPin, IconCircleCheck, IconBrandWhatsapp, IconMail,
  IconLink, IconCalendar, IconExternalLink, IconShare,
} from '@tabler/icons-react'
import { MOCK_PROFILES, CURRENT_USER } from '@/lib/mock-data'
import { AvailabilityStatus } from '@/lib/types'

const AVAILABILITY_CONFIG: Record<AvailabilityStatus, { dot: string; label: string; bg: string; text: string }> = {
  disponible: { dot: 'bg-success', label: 'Disponible', bg: 'bg-success-light', text: 'text-success' },
  en_veille: { dot: 'bg-[#F59E0B]', label: 'En veille', bg: 'bg-[#FFFBEB]', text: 'text-[#D97706]' },
  indisponible: { dot: 'bg-text-tertiary', label: 'Indisponible', bg: 'bg-[#F3F4F6]', text: 'text-text-secondary' },
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split('-')
  const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sep.', 'oct.', 'nov.', 'déc.']
  return `${months[parseInt(month) - 1]} ${year}`
}

export function generateStaticParams() {
  return [
    ...MOCK_PROFILES.map(p => ({ slug: p.publicUrlSlug })),
    { slug: CURRENT_USER.publicUrlSlug },
  ]
}

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  const profile = params.slug === CURRENT_USER.publicUrlSlug
    ? CURRENT_USER
    : MOCK_PROFILES.find(p => p.publicUrlSlug === params.slug)

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-4xl font-bold text-primary mb-3">404</p>
          <p className="text-text-secondary">Ce profil n&apos;existe pas.</p>
          <Link href="/explore" className="btn-primary mt-4 inline-flex">Explorer les profils</Link>
        </div>
      </div>
    )
  }

  const avail = AVAILABILITY_CONFIG[profile.availabilityStatus]
  const verifiedExperiences = profile.experiences.filter(e => e.verificationStatus === 'confirmée')
  const verifiedEducation = profile.education.filter(e => e.verificationStatus === 'confirmée')

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Top bar */}
      <header className="bg-white border-b border-[#E5E7EB] px-5 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-primary">bcarte</Link>
        <Link href="/register" className="btn-primary py-2 text-xs">
          Créer mon profil
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8 space-y-5">
        {/* Hero card */}
        <div className="bg-white border border-[#E5E7EB] rounded-card-lg overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-primary to-[#6B4DAE]" />

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-full bg-primary border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                {getInitials(profile.fullName)}
              </div>
              <div className="flex gap-2 mt-10">
                {profile.whatsapp && (
                  <a
                    href={`https://wa.me/${profile.whatsapp.replace(/[\s+]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-whatsapp font-medium text-sm px-4 py-2 rounded-btn transition-colors"
                  >
                    <IconBrandWhatsapp size={16} />
                    WhatsApp
                  </a>
                )}
                {profile.contactEmail && (
                  <a
                    href={`mailto:${profile.contactEmail}`}
                    className="flex items-center gap-2 bg-primary-light hover:bg-[#EDE9FE] text-primary font-medium text-sm px-4 py-2 rounded-btn transition-colors"
                  >
                    <IconMail size={16} />
                    Email
                  </a>
                )}
              </div>
            </div>

            {/* Identity */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-text-primary">{profile.fullName}</h1>
                {profile.verified && (
                  <span className="badge-verified">
                    <IconCircleCheck size={13} />
                    Vérifié
                  </span>
                )}
              </div>
              <p className="text-text-secondary font-medium">{profile.title}</p>
              <div className="flex items-center gap-4 flex-wrap text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <IconMapPin size={14} />
                  {profile.city}, {profile.country}
                </span>
                {profile.externalLink && (
                  <a
                    href={profile.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <IconLink size={14} />
                    Portfolio
                  </a>
                )}
              </div>

              {/* Availability */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-badge ${avail.bg} ${avail.text}`}>
                <span className={`w-2 h-2 rounded-full ${avail.dot}`} />
                {avail.label}
              </span>
            </div>

            {/* Languages */}
            {profile.languages.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {profile.languages.map((lang) => (
                  <span key={lang} className="text-xs bg-[#F3F4F6] text-text-secondary px-2.5 py-1 rounded-badge font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {profile.skills.length > 0 && (
          <section className="bg-white border border-[#E5E7EB] rounded-card-lg p-6">
            <h2 className="font-semibold text-text-primary mb-3">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill.id} className="bg-primary-light text-primary text-sm font-medium px-3 py-1.5 rounded-badge border border-primary-border">
                  {skill.label}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experiences */}
        {profile.experiences.length > 0 && (
          <section className="bg-white border border-[#E5E7EB] rounded-card-lg p-6">
            <h2 className="font-semibold text-text-primary mb-4">Expériences</h2>
            <div className="space-y-5">
              {profile.experiences.map((exp, i) => (
                <div key={exp.id} className={`flex gap-4 ${i < profile.experiences.length - 1 ? 'pb-5 border-b border-[#F3F4F6]' : ''}`}>
                  <div className="w-9 h-9 rounded-card bg-primary-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-xs">{exp.organization[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-text-primary text-sm">{exp.title}</p>
                        <p className="text-text-secondary text-sm">{exp.organization}</p>
                      </div>
                      {exp.verificationStatus === 'confirmée' && (
                        <span className="badge-verified flex-shrink-0 text-[11px]">
                          <IconCircleCheck size={11} />
                          Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-tertiary flex items-center gap-1 mt-1">
                      <IconCalendar size={11} />
                      {formatDate(exp.startDate)} — {exp.current ? "Aujourd'hui" : exp.endDate ? formatDate(exp.endDate) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {profile.education.length > 0 && (
          <section className="bg-white border border-[#E5E7EB] rounded-card-lg p-6">
            <h2 className="font-semibold text-text-primary mb-4">Formation</h2>
            <div className="space-y-5">
              {profile.education.map((edu, i) => (
                <div key={edu.id} className={`flex gap-4 ${i < profile.education.length - 1 ? 'pb-5 border-b border-[#F3F4F6]' : ''}`}>
                  <div className="w-9 h-9 rounded-card bg-secondary-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-secondary font-bold text-xs">{edu.institution[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-text-primary text-sm">{edu.degree}</p>
                        <p className="text-text-secondary text-sm">{edu.institution}</p>
                      </div>
                      {edu.verificationStatus === 'confirmée' && (
                        <span className="badge-verified flex-shrink-0 text-[11px]">
                          <IconCircleCheck size={11} />
                          Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-tertiary flex items-center gap-1 mt-1">
                      <IconCalendar size={11} />
                      {formatDate(edu.startDate)} — {edu.current ? "Aujourd'hui" : edu.endDate ? formatDate(edu.endDate) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications */}
        {profile.publications && profile.publications.length > 0 && (
          <section className="bg-white border border-[#E5E7EB] rounded-card-lg p-6">
            <h2 className="font-semibold text-text-primary mb-4">Publications</h2>
            <div className="space-y-3">
              {profile.publications.map((pub) => (
                <div key={pub.id} className="flex items-start gap-3">
                  <span className="text-xs font-medium text-secondary bg-secondary-light px-2 py-0.5 rounded-badge capitalize flex-shrink-0 mt-0.5">
                    {pub.type}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{pub.title}</p>
                    {pub.link && (
                      <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5">
                        <IconExternalLink size={11} />
                        Voir la publication
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Share footer */}
        <div className="bg-white border border-[#E5E7EB] rounded-card-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Partager ce profil</p>
            <p className="text-xs text-text-tertiary mt-0.5">bcarte.io/p/{profile.publicUrlSlug}</p>
          </div>
          <button className="btn-secondary text-xs py-2">
            <IconShare size={14} />
            Copier le lien
          </button>
        </div>

        {/* bcarte footer */}
        <div className="text-center py-4">
          <p className="text-xs text-text-tertiary">
            Profil hébergé sur{' '}
            <Link href="/" className="text-primary font-semibold">bcarte</Link>
            {' '}· Identité professionnelle vérifiée
          </p>
        </div>
      </main>
    </div>
  )
}
