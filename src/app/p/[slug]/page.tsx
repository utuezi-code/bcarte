'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  IconMapPin, IconCircleCheck, IconBrandWhatsapp, IconMail,
  IconExternalLink, IconCheck, IconArrowUpRight,
} from '@tabler/icons-react'
import { MOCK_PROFILES, CURRENT_USER } from '@/lib/mock-data'
import { AvailabilityStatus } from '@/lib/types'

const AVAIL: Record<AvailabilityStatus, { dot: string; label: string }> = {
  disponible:   { dot: '#059669', label: 'Disponible' },
  en_veille:    { dot: '#F59E0B', label: 'En veille'  },
  indisponible: { dot: '#9CA3AF', label: 'Indisponible' },
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function fmtDate(d: string) {
  const [y, m] = d.split('-')
  return ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'][+m - 1] + ' ' + y
}

function duration(start: string, end: string | null, current: boolean) {
  const s = new Date(start)
  const e = current ? new Date() : new Date(end ?? start)
  const m = (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth()
  if (m < 12) return `${m} mois`
  const y = Math.floor(m / 12), r = m % 12
  return r ? `${y} an${y > 1 ? 's' : ''} ${r} mois` : `${y} an${y > 1 ? 's' : ''}`
}

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  const [copied, setCopied] = useState(false)

  const profile = params.slug === CURRENT_USER.publicUrlSlug
    ? CURRENT_USER
    : MOCK_PROFILES.find(p => p.publicUrlSlug === params.slug)

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-text-tertiary text-sm">Ce profil n&apos;existe pas.</p>
          <Link href="/explore" className="text-primary text-sm font-medium hover:underline">Explorer les profils →</Link>
        </div>
      </div>
    )
  }

  const av = AVAIL[profile.availabilityStatus]

  const copy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Nav — ultra-minimal */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#F3F4F6]">
        <Link href="/" className="text-lg font-extrabold text-primary">bcarte</Link>
        <Link href="/register" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">
          Créer mon profil →
        </Link>
      </header>

      <main className="max-w-[600px] mx-auto px-6 py-12 space-y-12">

        {/* ── IDENTITY ── */}
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-[72px] h-[72px] rounded-2xl bg-primary flex-shrink-0 flex items-center justify-center text-white font-extrabold text-xl">
            {initials(profile.fullName)}
          </div>

          {/* Info */}
          <div className="flex-1 pt-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-text-primary">{profile.fullName}</h1>
              {profile.verified && (
                <IconCircleCheck size={18} className="text-success flex-shrink-0" />
              )}
            </div>
            <p className="text-text-secondary mt-1 text-[15px]">{profile.title}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-text-tertiary text-sm flex items-center gap-1">
                <IconMapPin size={13} />
                {profile.city}, {profile.country}
              </span>
              {profile.externalLink && (
                <a
                  href={profile.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-tertiary hover:text-primary text-sm flex items-center gap-1 transition-colors"
                >
                  <IconExternalLink size={13} />
                  Portfolio
                </a>
              )}
            </div>
            {/* Availability */}
            <div className="flex items-center gap-1.5 mt-3">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: av.dot }} />
              <span className="text-xs text-text-secondary font-medium">{av.label}</span>
              {profile.languages.length > 0 && (
                <>
                  <span className="text-[#E5E7EB] mx-1">·</span>
                  <span className="text-xs text-text-tertiary">{profile.languages.join(' · ')}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div className="flex gap-3">
          {profile.whatsapp && (
            <a
              href={`https://wa.me/${profile.whatsapp.replace(/[\s+]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-whatsapp text-white font-semibold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              <IconBrandWhatsapp size={17} />
              WhatsApp
            </a>
          )}
          {profile.contactEmail && (
            <a
              href={`mailto:${profile.contactEmail}`}
              className="flex-1 flex items-center justify-center gap-2 bg-[#F3F4F6] hover:bg-primary-light text-text-primary hover:text-primary font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              <IconMail size={17} />
              Email
            </a>
          )}
        </div>

        {/* ── SKILLS ── */}
        {profile.skills.length > 0 && (
          <section>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] mb-3">Compétences</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(s => (
                <span key={s.id} className="text-sm text-text-primary bg-[#F3F4F6] px-3 py-1.5 rounded-lg font-medium">
                  {s.label}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── EXPERIENCES ── */}
        {profile.experiences.length > 0 && (
          <section>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] mb-5">Expérience</p>
            <div className="space-y-6">
              {profile.experiences.map(exp => (
                <div key={exp.id} className="flex gap-4">
                  {/* Org logo placeholder */}
                  <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center text-text-secondary font-bold text-sm flex-shrink-0 mt-0.5">
                    {exp.organization[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-text-primary text-[15px]">{exp.title}</p>
                      {exp.verificationStatus === 'confirmée' && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-success flex-shrink-0">
                          <IconCircleCheck size={13} />
                          Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary text-sm mt-0.5">{exp.organization}</p>
                    <p className="text-text-tertiary text-xs mt-1">
                      {fmtDate(exp.startDate)} — {exp.current ? "Aujourd'hui" : exp.endDate ? fmtDate(exp.endDate) : ''}
                      <span className="mx-1.5 opacity-40">·</span>
                      {duration(exp.startDate, exp.endDate, exp.current)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── EDUCATION ── */}
        {profile.education.length > 0 && (
          <section>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] mb-5">Formation</p>
            <div className="space-y-6">
              {profile.education.map(edu => (
                <div key={edu.id} className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center text-text-secondary font-bold text-sm flex-shrink-0 mt-0.5">
                    {edu.institution[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-text-primary text-[15px]">{edu.degree}</p>
                      {edu.verificationStatus === 'confirmée' && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-success flex-shrink-0">
                          <IconCircleCheck size={13} />
                          Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary text-sm mt-0.5">{edu.institution}</p>
                    <p className="text-text-tertiary text-xs mt-1">
                      {fmtDate(edu.startDate)} — {edu.current ? "Aujourd'hui" : edu.endDate ? fmtDate(edu.endDate) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── PUBLICATIONS ── */}
        {profile.publications && profile.publications.length > 0 && (
          <section>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] mb-4">Publications</p>
            <div className="space-y-2">
              {profile.publications.map(pub => (
                <a
                  key={pub.id}
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl hover:bg-[#F3F4F6] transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors truncate">{pub.title}</p>
                    <p className="text-xs text-text-tertiary capitalize mt-0.5">{pub.type}</p>
                  </div>
                  <IconArrowUpRight size={15} className="text-text-tertiary group-hover:text-primary flex-shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── SHARE ── */}
        <div className="flex items-center justify-between py-5 border-t border-[#F3F4F6]">
          <p className="text-xs text-text-tertiary font-mono">bcarte.io/p/{profile.publicUrlSlug}</p>
          <button
            onClick={copy}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
              copied ? 'bg-success-light text-success' : 'bg-[#F3F4F6] text-text-secondary hover:text-text-primary'
            }`}
          >
            {copied ? <IconCheck size={13} /> : null}
            {copied ? 'Copié' : 'Copier le lien'}
          </button>
        </div>

        {/* ── FOOTER ── */}
        <div className="text-center pb-6">
          <p className="text-xs text-text-tertiary">
            Propulsé par{' '}
            <Link href="/" className="font-bold text-primary">bcarte</Link>
            {' '}· Profils professionnels vérifiés
          </p>
        </div>

      </main>
    </div>
  )
}
