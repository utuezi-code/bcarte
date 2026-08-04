'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  IconShieldCheck, IconMapPin, IconBriefcase, IconBrandLinkedin,
  IconLoader2, IconCopy, IconCheck, IconSchool, IconCode,
  IconPhone, IconArrowUpRight,
} from '@tabler/icons-react'

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

const AVATAR_COLORS = ['#6C47FF', '#059669', '#2563EB', '#D97706', '#DC2626', '#7C3AED', '#0891B2']
function avatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function fmtDate(d: string | null | undefined) {
  if (!d) return null
  try { return new Date(d).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) }
  catch { return d }
}

export default function PublicProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied,  setCopied]  = useState(false)

  useEffect(() => {
    fetch(`/api/profiles/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setProfile(d); setLoading(false) })
  }, [slug])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const verifiedCount = profile?.verifications?.filter((v: any) => v.status === 'CONFIRMEE').length ?? 0
  const color = profile ? avatarColor(profile.fullName ?? '') : '#6C47FF'

  /* ── Loading ──────────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="min-h-screen bg-[#F4F3FB] flex items-center justify-center">
      <IconLoader2 size={28} className="animate-spin text-primary" />
    </div>
  )

  /* ── 404 ──────────────────────────────────────────────────────────────── */
  if (!profile) return (
    <div className="min-h-screen bg-[#F4F3FB] flex flex-col items-center justify-center gap-4 px-5 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white border border-[#EEEEF5] flex items-center justify-center">
        <IconBriefcase size={24} className="text-text-tertiary" />
      </div>
      <div>
        <p className="font-bold text-text-primary text-lg">Profil introuvable</p>
        <p className="text-sm text-text-secondary mt-1">Ce profil n&apos;existe pas ou a été supprimé.</p>
      </div>
      <Link href="/" className="btn-primary mt-2">Retour à l&apos;accueil</Link>
    </div>
  )

  /* ── Profile ──────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F4F3FB]">

      {/* ── Top nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-[#EEEEF5]">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[7px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #9B6DFF 100%)' }}>
              <span className="text-white text-[11px] font-black">b</span>
            </div>
            <span className="text-[15px] font-black text-text-primary tracking-tight">bcarte</span>
          </Link>
          <Link href="/register" className="btn-primary h-8 px-4 text-xs">
            Créer mon profil
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 pb-12">

        {/* ── Hero card ───────────────────────────────────────────────────── */}
        <div className="rounded-[20px] overflow-hidden shadow-sm mt-6 bg-white border border-[#EEEEF5]">

          {/* Cover gradient */}
          <div className="h-32 sm:h-40"
            style={{ background: `linear-gradient(135deg, #1A0E4E 0%, #3B1FA0 55%, ${color} 100%)` }} />

          {/* Identity row */}
          <div className="px-5 sm:px-7 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-2xl sm:text-3xl flex-shrink-0"
                style={{ backgroundColor: color }}>
                {initials(profile.fullName ?? '')}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <button onClick={copyLink}
                  className="btn-secondary h-9 px-3 text-xs gap-1.5">
                  {copied
                    ? <><IconCheck size={13} className="text-success" /> Copié !</>
                    : <><IconCopy size={13} /> Copier le lien</>}
                </button>
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-[10px] border border-[#E2E0F0] flex items-center justify-center text-[#0A66C2] hover:bg-blue-50 transition-colors">
                    <IconBrandLinkedin size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Name & meta */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary leading-tight">
                  {profile.fullName}
                </h1>
                {verifiedCount > 0 && (
                  <span className="badge-verified">
                    <IconShieldCheck size={10} /> Vérifié
                  </span>
                )}
              </div>
              {profile.title && (
                <p className="text-sm sm:text-base text-text-secondary">{profile.title}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-tertiary">
                {(profile.city || profile.country) && (
                  <span className="flex items-center gap-1">
                    <IconMapPin size={12} />
                    {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <IconPhone size={12} /> {profile.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm text-text-secondary leading-relaxed mt-4 pt-4 border-t border-[#F0EFF8]">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* ── Stats row ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Expériences',      value: profile.experiences?.length ?? 0,  color: '#6C47FF', bg: '#F0EDFF' },
            { label: 'Vérifiées',        value: verifiedCount,                      color: '#059669', bg: '#ECFDF5' },
            { label: 'Formations',       value: profile.educations?.length  ?? 0,  color: '#2563EB', bg: '#EFF6FF' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#EEEEF5] rounded-[16px] py-4 text-center">
              <p className="text-2xl font-black leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-text-tertiary mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Skills ──────────────────────────────────────────────────────── */}
        {(profile.skills?.length ?? 0) > 0 && (
          <section className="mt-4 bg-white border border-[#EEEEF5] rounded-[20px] p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-bold text-text-primary mb-4">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#FFFBEB' }}>
                <IconCode size={14} style={{ color: '#D97706' }} />
              </span>
              Compétences
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: string) => (
                <span key={s}
                  className="text-xs font-medium bg-[#F0EDFF] text-primary px-3 py-1.5 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Experiences ─────────────────────────────────────────────────── */}
        {(profile.experiences?.length ?? 0) > 0 && (
          <section className="mt-4 bg-white border border-[#EEEEF5] rounded-[20px] p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-bold text-text-primary mb-5">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#F0EDFF' }}>
                <IconBriefcase size={14} style={{ color: '#6C47FF' }} />
              </span>
              Expériences
            </h2>
            <div className="space-y-0">
              {profile.experiences.map((exp: any, i: number) => {
                const verified = profile.verifications?.find(
                  (v: any) => v.organisationId === exp.organisationId && v.status === 'CONFIRMEE'
                )
                const isLast = i === profile.experiences.length - 1
                return (
                  <div key={exp.id} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: avatarColor(exp.company ?? '') }}>
                        {initials(exp.company ?? '')}
                      </div>
                      {!isLast && <div className="w-px flex-1 bg-[#F0EFF8] mt-2 mb-2 min-h-[20px]" />}
                    </div>
                    {/* Content */}
                    <div className={`flex-1 min-w-0 pb-5 ${isLast ? '' : ''}`}>
                      <div className="flex items-start gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-text-primary leading-tight">{exp.title}</p>
                        {verified && (
                          <span className="badge-verified flex-shrink-0">
                            <IconShieldCheck size={9} /> Vérifié
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary mt-0.5">{exp.company}</p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {fmtDate(exp.startDate)} – {exp.isCurrent ? 'Présent' : (fmtDate(exp.endDate) ?? 'Présent')}
                        {exp.city ? ` · ${exp.city}` : ''}
                      </p>
                      {exp.description && (
                        <p className="text-xs text-text-secondary mt-2 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Educations ──────────────────────────────────────────────────── */}
        {(profile.educations?.length ?? 0) > 0 && (
          <section className="mt-4 bg-white border border-[#EEEEF5] rounded-[20px] p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-bold text-text-primary mb-5">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#ECFDF5' }}>
                <IconSchool size={14} style={{ color: '#059669' }} />
              </span>
              Formations
            </h2>
            <div className="space-y-0">
              {profile.educations.map((edu: any, i: number) => {
                const orgName = edu.organisation?.name ?? edu.school ?? ''
                const isLast  = i === profile.educations.length - 1
                return (
                  <div key={edu.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: avatarColor(orgName) }}>
                        {initials(orgName)}
                      </div>
                      {!isLast && <div className="w-px flex-1 bg-[#F0EFF8] mt-2 mb-2 min-h-[20px]" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-5">
                      <p className="text-sm font-semibold text-text-primary leading-tight">{edu.degree}</p>
                      {edu.field && <p className="text-xs text-primary font-medium mt-0.5">{edu.field}</p>}
                      <p className="text-sm text-text-secondary mt-0.5">{orgName}</p>
                      <p className="text-xs text-text-tertiary mt-1">
                        {edu.startYear} – {edu.isCurrent ? 'Présent' : (edu.endYear ?? 'Présent')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link href="/register"
            className="btn-primary gap-2">
            Créer mon profil bcarte
            <IconArrowUpRight size={14} />
          </Link>
          <p className="text-xs text-text-tertiary">
            Profil hébergé sur{' '}
            <Link href="/" className="text-primary hover:underline font-medium">bcarte.io</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
