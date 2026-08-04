'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  IconShieldCheck, IconMapPin, IconBriefcase, IconBrandLinkedin,
  IconLoader2, IconCopy, IconCheck, IconSchool, IconCode,
  IconPhone, IconShare, IconDownload, IconArrowUpRight,
  IconMail, IconWorld,
} from '@tabler/icons-react'

/* ── helpers ────────────────────────────────────────────────────────────── */
function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

const PALETTE = ['#6C47FF', '#059669', '#2563EB', '#D97706', '#DC2626', '#7C3AED', '#0891B2', '#C026D3']
function accentColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return PALETTE[Math.abs(h) % PALETTE.length]
}

function fmtDate(d: string | null | undefined) {
  if (!d) return null
  try { return new Date(d).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) }
  catch { return d }
}

function downloadVCard(profile: any) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.fullName ?? ''}`,
    profile.title   ? `TITLE:${profile.title}`  : '',
    profile.phone   ? `TEL:${profile.phone}`    : '',
    profile.linkedin ? `URL;type=LinkedIn:${profile.linkedin}` : '',
    `URL:${window.location.href}`,
    'END:VCARD',
  ].filter(Boolean).join('\n')

  const blob = new Blob([lines], { type: 'text/vcard' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${(profile.fullName ?? 'contact').replace(/\s+/g, '_')}.vcf`
  a.click()
  URL.revokeObjectURL(url)
}

/* ── component ──────────────────────────────────────────────────────────── */
export default function PublicProfilePage() {
  const { slug }  = useParams<{ slug: string }>()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied,  setCopied]  = useState(false)

  useEffect(() => {
    fetch(`/api/profiles/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setProfile(d); setLoading(false) })
  }, [slug])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: profile?.fullName, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const verifiedCount = profile?.verifications?.filter((v: any) => v.status === 'CONFIRMEE').length ?? 0
  const color = profile ? accentColor(profile.fullName ?? '') : '#6C47FF'

  /* loading */
  if (loading) return (
    <div className="min-h-screen bg-[#F4F3FB] flex items-center justify-center">
      <IconLoader2 size={28} className="animate-spin" style={{ color }} />
    </div>
  )

  /* 404 */
  if (!profile) return (
    <div className="min-h-screen bg-[#F4F3FB] flex flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-bold text-text-primary text-lg">Profil introuvable</p>
      <p className="text-sm text-text-secondary">Ce profil n&apos;existe pas ou a été supprimé.</p>
      <Link href="/" className="btn-primary mt-2">Retour à l&apos;accueil</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F4F3FB] flex flex-col">

      {/* ── Top accent bar ────────────────────────────────────────────────── */}
      <div className="h-1 w-full" style={{ backgroundColor: color }} />

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#EEEEF5]">
        <div className="max-w-[460px] mx-auto px-5 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-[6px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #9B6DFF 100%)' }}>
              <span className="text-white text-[10px] font-black">b</span>
            </div>
            <span className="text-[13px] font-black text-text-primary tracking-tight">bcarte</span>
          </Link>
          <Link href="/register" className="text-[11px] font-semibold text-primary hover:underline">
            Créer mon profil →
          </Link>
        </div>
      </header>

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-[460px] mx-auto w-full px-4 py-6 space-y-3">

        {/* Identity block */}
        <div className="bg-white rounded-[24px] overflow-hidden border border-[#EEEEF5] shadow-sm">

          {/* Gradient top strip */}
          <div className="h-24"
            style={{ background: `linear-gradient(135deg, #0D0824 0%, #2A1180 60%, ${color} 100%)` }} />

          {/* Avatar + info */}
          <div className="px-5 pb-6 -mt-12 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-2xl mb-3"
              style={{ backgroundColor: color }}>
              {initials(profile.fullName ?? '')}
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <h1 className="text-xl font-bold text-text-primary leading-tight">
                {profile.fullName}
              </h1>
              {verifiedCount > 0 && (
                <span className="badge-verified">
                  <IconShieldCheck size={10} /> Vérifié
                </span>
              )}
            </div>

            {profile.title && (
              <p className="text-sm text-text-secondary mt-1">{profile.title}</p>
            )}

            {(profile.city || profile.country) && (
              <p className="text-xs text-text-tertiary flex items-center gap-1 mt-1.5">
                <IconMapPin size={11} />
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2.5 mt-5 w-full">
              <button onClick={() => downloadVCard(profile)}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-[12px] text-sm font-semibold text-white transition-all active:scale-[0.97]"
                style={{ backgroundColor: color }}>
                <IconDownload size={15} />
                Enregistrer
              </button>
              <button onClick={handleShare}
                className="flex-1 btn-secondary h-11 rounded-[12px] justify-center gap-2 text-sm">
                {copied
                  ? <><IconCheck size={15} className="text-success" /> Copié !</>
                  : <><IconShare size={15} /> Partager</>}
              </button>
            </div>
          </div>
        </div>

        {/* Contact info */}
        {(profile.phone || profile.linkedin) && (
          <div className="bg-white rounded-[20px] border border-[#EEEEF5] shadow-sm overflow-hidden divide-y divide-[#F4F3FB]">
            {profile.phone && (
              <a href={`tel:${profile.phone}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAFA] transition-colors group">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}18` }}>
                  <IconPhone size={16} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-text-tertiary font-medium uppercase tracking-wide">Téléphone</p>
                  <p className="text-sm font-semibold text-text-primary">{profile.phone}</p>
                </div>
                <IconArrowUpRight size={14} className="text-text-tertiary group-hover:text-text-secondary transition-colors" />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAFA] transition-colors group">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}18` }}>
                  <IconBrandLinkedin size={16} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-text-tertiary font-medium uppercase tracking-wide">LinkedIn</p>
                  <p className="text-sm font-semibold text-text-primary truncate">{profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</p>
                </div>
                <IconArrowUpRight size={14} className="text-text-tertiary group-hover:text-text-secondary transition-colors" />
              </a>
            )}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <div className="bg-white rounded-[20px] border border-[#EEEEF5] shadow-sm px-5 py-4">
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-2">À propos</p>
            <p className="text-sm text-text-secondary leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Skills */}
        {(profile.skills?.length ?? 0) > 0 && (
          <div className="bg-white rounded-[20px] border border-[#EEEEF5] shadow-sm px-5 py-4">
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-3">Compétences</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: string) => (
                <span key={s}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${color}15`, color }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experiences */}
        {(profile.experiences?.length ?? 0) > 0 && (
          <div className="bg-white rounded-[20px] border border-[#EEEEF5] shadow-sm px-5 py-4">
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-4">Expériences</p>
            <div className="space-y-0">
              {profile.experiences.map((exp: any, i: number) => {
                const isVerified = profile.verifications?.some(
                  (v: any) => v.organisationId === exp.organisationId && v.status === 'CONFIRMEE'
                )
                const isLast = i === profile.experiences.length - 1
                return (
                  <div key={exp.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: accentColor(exp.company ?? '') }}>
                        {initials(exp.company ?? '')}
                      </div>
                      {!isLast && <div className="w-px bg-[#EEEEF5] flex-1 mt-1.5 mb-1.5 min-h-[16px]" />}
                    </div>
                    <div className={`flex-1 min-w-0 ${isLast ? 'pb-0' : 'pb-4'}`}>
                      <div className="flex items-start gap-1.5 flex-wrap">
                        <p className="text-sm font-semibold text-text-primary leading-snug">{exp.title}</p>
                        {isVerified && (
                          <span className="badge-verified flex-shrink-0" style={{ marginTop: '2px' }}>
                            <IconShieldCheck size={9} /> Vérifié
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">{exp.company}{exp.city ? ` · ${exp.city}` : ''}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {fmtDate(exp.startDate)} – {exp.isCurrent ? 'Présent' : (fmtDate(exp.endDate) ?? 'Présent')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Educations */}
        {(profile.educations?.length ?? 0) > 0 && (
          <div className="bg-white rounded-[20px] border border-[#EEEEF5] shadow-sm px-5 py-4">
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-4">Formations</p>
            <div className="space-y-0">
              {profile.educations.map((edu: any, i: number) => {
                const orgName = edu.organisation?.name ?? edu.school ?? ''
                const isLast  = i === profile.educations.length - 1
                return (
                  <div key={edu.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: accentColor(orgName) }}>
                        {initials(orgName)}
                      </div>
                      {!isLast && <div className="w-px bg-[#EEEEF5] flex-1 mt-1.5 mb-1.5 min-h-[16px]" />}
                    </div>
                    <div className={`flex-1 min-w-0 ${isLast ? 'pb-0' : 'pb-4'}`}>
                      <p className="text-sm font-semibold text-text-primary leading-snug">{edu.degree}</p>
                      {edu.field && <p className="text-xs font-medium mt-0.5" style={{ color }}>{edu.field}</p>}
                      <p className="text-xs text-text-secondary mt-0.5">{orgName}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {edu.startYear} – {edu.isCurrent ? 'Présent' : (edu.endYear ?? 'Présent')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 pb-6 flex flex-col items-center gap-2">
          <Link href="/register"
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-[#EEEEF5] bg-white text-text-secondary hover:text-primary hover:border-primary/30 transition-colors shadow-sm">
            Créer ma bcarte gratuite
            <IconArrowUpRight size={12} />
          </Link>
          <p className="text-[10px] text-text-tertiary">
            Propulsé par <Link href="/" className="font-semibold text-primary hover:underline">bcarte.io</Link>
          </p>
        </div>

      </main>
    </div>
  )
}
