'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  IconMapPin, IconCircleCheck, IconBrandWhatsapp, IconMail,
  IconLink, IconExternalLink, IconShare, IconCheck,
  IconBriefcase, IconSchool, IconFileText,
} from '@tabler/icons-react'
import { MOCK_PROFILES, CURRENT_USER } from '@/lib/mock-data'
import { AvailabilityStatus } from '@/lib/types'

const AVAILABILITY_CONFIG: Record<AvailabilityStatus, { dot: string; label: string; pill: string }> = {
  disponible:   { dot: 'bg-success animate-pulse', label: 'Disponible',   pill: 'bg-success-light text-success border border-[#A7F3D0]' },
  en_veille:    { dot: 'bg-[#F59E0B]',             label: 'En veille',    pill: 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]' },
  indisponible: { dot: 'bg-[#D1D5DB]',             label: 'Indisponible', pill: 'bg-[#F3F4F6] text-text-secondary border border-[#E5E7EB]' },
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split('-')
  const months = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sep.', 'oct.', 'nov.', 'déc.']
  return `${months[parseInt(month) - 1]} ${year}`
}

function getDuration(start: string, end: string | null, current: boolean) {
  const startDate = new Date(start)
  const endDate = current ? new Date() : end ? new Date(end) : new Date()
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth())
  if (months < 12) return `${months} mois`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years} an${years > 1 ? 's' : ''} ${rem} mois` : `${years} an${years > 1 ? 's' : ''}`
}

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  const [copied, setCopied] = useState(false)

  const profile = params.slug === CURRENT_USER.publicUrlSlug
    ? CURRENT_USER
    : MOCK_PROFILES.find(p => p.publicUrlSlug === params.slug)

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-5xl font-extrabold text-primary mb-3">404</p>
          <p className="text-text-secondary mb-6">Ce profil n&apos;existe pas ou a été supprimé.</p>
          <Link href="/explore" className="btn-primary">Explorer les profils</Link>
        </div>
      </div>
    )
  }

  const avail = AVAILABILITY_CONFIG[profile.availabilityStatus]
  const verifiedCount = [
    ...profile.experiences.filter(e => e.verificationStatus === 'confirmée'),
    ...profile.education.filter(e => e.verificationStatus === 'confirmée'),
  ].length

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#E5E7EB] sticky top-0 z-20 px-5 py-3.5 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-primary tracking-tight">bcarte</Link>
        <Link
          href="/register"
          className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-2 rounded-btn transition-colors"
        >
          Créer mon profil gratuit
        </Link>
      </header>

      <main className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 space-y-4">

        {/* ── HERO ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]/60">
          {/* Banner with mesh gradient */}
          <div className="h-36 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7C5CBF 0%, #9B7FD4 40%, #C9A84C 100%)' }}>
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          </div>

          <div className="px-6 pb-7">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-12 mb-5">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-[#6B4DAE] border-[3px] border-white shadow-lg flex items-center justify-center text-white text-2xl font-extrabold">
                  {getInitials(profile.fullName)}
                </div>
                {profile.verified && (
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#E5E7EB]">
                    <IconCircleCheck size={18} className="text-success fill-success-light" />
                  </div>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex gap-2 mt-12">
                {profile.whatsapp && (
                  <a
                    href={`https://wa.me/${profile.whatsapp.replace(/[\s+]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-whatsapp hover:bg-[#1FAD55] text-white font-semibold text-sm px-4 py-2.5 rounded-btn transition-colors shadow-sm"
                  >
                    <IconBrandWhatsapp size={16} />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                )}
                {profile.contactEmail && (
                  <a
                    href={`mailto:${profile.contactEmail}`}
                    className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-4 py-2.5 rounded-btn transition-colors shadow-sm"
                  >
                    <IconMail size={16} />
                    <span className="hidden sm:inline">Email</span>
                  </a>
                )}
              </div>
            </div>

            {/* Name & title */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-extrabold text-text-primary leading-tight">{profile.fullName}</h1>
                {profile.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-2.5 py-1 rounded-badge">
                    <IconCircleCheck size={12} />
                    Profil vérifié
                  </span>
                )}
              </div>

              <p className="text-base font-medium text-text-secondary">{profile.title}</p>

              <div className="flex items-center gap-3 flex-wrap pt-0.5">
                <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <IconMapPin size={14} className="text-text-tertiary" />
                  {profile.city}, {profile.country}
                </span>
                {profile.externalLink && (
                  <a
                    href={profile.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover font-medium transition-colors"
                  >
                    <IconLink size={14} />
                    Portfolio
                    <IconExternalLink size={11} className="opacity-60" />
                  </a>
                )}
              </div>
            </div>

            {/* Bottom pills row */}
            <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-[#F3F4F6]">
              {/* Availability */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-badge ${avail.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
                {avail.label}
              </span>

              {/* Languages */}
              {profile.languages.map(lang => (
                <span key={lang} className="text-xs font-medium text-text-secondary bg-[#F3F4F6] px-2.5 py-1.5 rounded-badge">
                  {lang}
                </span>
              ))}

              {/* Sector */}
              <span className="text-xs font-medium text-secondary bg-secondary-light border border-secondary-border px-2.5 py-1.5 rounded-badge ml-auto">
                {profile.sector}
              </span>
            </div>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        {verifiedCount > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Expériences', value: profile.experiences.length, icon: IconBriefcase },
              { label: 'Formations', value: profile.education.length, icon: IconSchool },
              { label: 'Vérifications', value: verifiedCount, icon: IconCircleCheck, accent: true },
            ].map(({ label, value, icon: Icon, accent }) => (
              <div key={label} className={`bg-white rounded-xl border p-4 text-center shadow-sm ${accent ? 'border-[#A7F3D0]' : 'border-[#E5E7EB]/60'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${accent ? 'bg-success-light' : 'bg-primary-light'}`}>
                  <Icon size={16} className={accent ? 'text-success' : 'text-primary'} />
                </div>
                <p className={`text-xl font-extrabold ${accent ? 'text-success' : 'text-text-primary'}`}>{value}</p>
                <p className="text-[11px] text-text-tertiary mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── SKILLS ── */}
        {profile.skills.length > 0 && (
          <section className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm p-6">
            <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-widest mb-4">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <span key={skill.id} className="bg-primary-light text-primary text-sm font-semibold px-4 py-2 rounded-badge border border-primary-border hover:bg-[#EDE9FE] transition-colors cursor-default">
                  {skill.label}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── EXPERIENCES ── */}
        {profile.experiences.length > 0 && (
          <section className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm p-6">
            <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-widest mb-5">Expériences professionnelles</h2>
            <div className="space-y-0">
              {profile.experiences.map((exp, i) => (
                <div key={exp.id} className="flex gap-4 relative">
                  {/* Timeline line */}
                  {i < profile.experiences.length - 1 && (
                    <div className="absolute left-[17px] top-10 bottom-0 w-px bg-[#F3F4F6]" />
                  )}
                  {/* Dot */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 z-10 mt-0.5 font-bold text-sm ${exp.verificationStatus === 'confirmée' ? 'bg-success-light text-success' : 'bg-primary-light text-primary'}`}>
                    {exp.organization[0].toUpperCase()}
                  </div>
                  {/* Content */}
                  <div className={`flex-1 pb-6 ${i === profile.experiences.length - 1 ? 'pb-0' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-text-primary text-[15px] leading-snug">{exp.title}</p>
                        <p className="text-text-secondary text-sm font-medium mt-0.5">{exp.organization}</p>
                      </div>
                      {exp.verificationStatus === 'confirmée' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-2 py-1 rounded-badge flex-shrink-0">
                          <IconCircleCheck size={11} />
                          Vérifié
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="text-xs text-text-tertiary">
                        {formatDate(exp.startDate)} — {exp.current ? "Aujourd'hui" : exp.endDate ? formatDate(exp.endDate) : ''}
                      </p>
                      <span className="text-text-tertiary opacity-40">·</span>
                      <p className="text-xs text-text-tertiary">
                        {getDuration(exp.startDate, exp.endDate, exp.current)}
                      </p>
                      {exp.current && (
                        <span className="text-[10px] font-semibold text-primary bg-primary-light px-1.5 py-0.5 rounded">En poste</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── EDUCATION ── */}
        {profile.education.length > 0 && (
          <section className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm p-6">
            <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-widest mb-5">Formation</h2>
            <div className="space-y-0">
              {profile.education.map((edu, i) => (
                <div key={edu.id} className="flex gap-4 relative">
                  {i < profile.education.length - 1 && (
                    <div className="absolute left-[17px] top-10 bottom-0 w-px bg-[#F3F4F6]" />
                  )}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 z-10 mt-0.5 font-bold text-sm ${edu.verificationStatus === 'confirmée' ? 'bg-success-light text-success' : 'bg-secondary-light text-secondary'}`}>
                    {edu.institution[0].toUpperCase()}
                  </div>
                  <div className={`flex-1 pb-6 ${i === profile.education.length - 1 ? 'pb-0' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-text-primary text-[15px] leading-snug">{edu.degree}</p>
                        <p className="text-text-secondary text-sm font-medium mt-0.5">{edu.institution}</p>
                      </div>
                      {edu.verificationStatus === 'confirmée' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-2 py-1 rounded-badge flex-shrink-0">
                          <IconCircleCheck size={11} />
                          Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-tertiary mt-1.5">
                      {formatDate(edu.startDate)} — {edu.current ? "Aujourd'hui" : edu.endDate ? formatDate(edu.endDate) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── PUBLICATIONS ── */}
        {profile.publications && profile.publications.length > 0 && (
          <section className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm p-6">
            <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-widest mb-4">Publications</h2>
            <div className="space-y-3">
              {profile.publications.map(pub => (
                <a
                  key={pub.id}
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-xl border border-[#F3F4F6] hover:border-primary-border hover:bg-primary-light/30 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-secondary-light flex items-center justify-center flex-shrink-0">
                    <IconFileText size={16} className="text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-sm leading-snug group-hover:text-primary transition-colors">{pub.title}</p>
                    <span className="text-[11px] font-semibold text-secondary bg-secondary-light px-2 py-0.5 rounded-badge mt-1.5 inline-block capitalize">{pub.type}</span>
                  </div>
                  <IconExternalLink size={14} className="text-text-tertiary group-hover:text-primary mt-0.5 flex-shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── SHARE ── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB]/60 shadow-sm p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
              <IconShare size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Partager ce profil</p>
              <p className="text-xs text-text-tertiary mt-0.5 font-mono">bcarte.io/p/{profile.publicUrlSlug}</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-btn transition-all flex-shrink-0 ${
              copied
                ? 'bg-success-light text-success border border-[#A7F3D0]'
                : 'bg-[#F3F4F6] hover:bg-primary-light text-text-primary hover:text-primary border border-transparent'
            }`}
          >
            {copied ? <IconCheck size={15} /> : <IconShare size={15} />}
            {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>

        {/* ── FOOTER CTA ── */}
        <div className="bg-gradient-to-br from-primary to-[#6B4DAE] rounded-2xl p-6 text-center text-white">
          <p className="text-base font-bold mb-1">Vous aussi, créez votre profil vérifié</p>
          <p className="text-white/70 text-sm mb-4">Rejoignez des milliers de professionnels africains sur bcarte</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-5 py-2.5 rounded-btn hover:bg-primary-light transition-colors"
          >
            Créer mon profil gratuit →
          </Link>
        </div>

        {/* Tiny footer */}
        <p className="text-center text-xs text-text-tertiary pb-4">
          Propulsé par <Link href="/" className="font-bold text-primary">bcarte</Link> · Identité professionnelle vérifiée
        </p>
      </main>
    </div>
  )
}
