'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  IconShieldCheck, IconMapPin, IconBriefcase, IconBrandLinkedin,
  IconLoader2, IconCopy, IconCheck, IconSchool, IconCode,
  IconPhone, IconShare, IconDownload, IconArrowUpRight,
  IconUser,
} from '@tabler/icons-react'

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
    'BEGIN:VCARD', 'VERSION:3.0',
    `FN:${profile.fullName ?? ''}`,
    profile.title    ? `TITLE:${profile.title}`   : '',
    profile.phone    ? `TEL:${profile.phone}`     : '',
    profile.linkedin ? `URL;type=LinkedIn:${profile.linkedin}` : '',
    `URL:${window.location.href}`,
    'END:VCARD',
  ].filter(Boolean).join('\n')
  const blob = new Blob([lines], { type: 'text/vcard' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: `${(profile.fullName ?? 'contact').replace(/\s+/g, '_')}.vcf` })
  a.click(); URL.revokeObjectURL(url)
}

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
    if (navigator.share) navigator.share({ title: profile?.fullName, url: window.location.href })
    else { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2500) }
  }

  const verifiedCount = profile?.verifications?.filter((v: any) => v.status === 'CONFIRMEE').length ?? 0
  const color = profile ? accentColor(profile.fullName ?? '') : '#6C47FF'
  const hasContact = profile?.phone || profile?.linkedin
  const hasContent = (profile?.skills?.length ?? 0) > 0 || (profile?.experiences?.length ?? 0) > 0 || (profile?.educations?.length ?? 0) > 0

  if (loading) return (
    <div className="min-h-screen bg-[#F4F3FB] flex items-center justify-center">
      <IconLoader2 size={28} className="animate-spin" style={{ color }} />
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-[#F4F3FB] flex flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-bold text-text-primary text-lg">Profil introuvable</p>
      <p className="text-sm text-text-secondary">Ce profil n&apos;existe pas ou a été supprimé.</p>
      <Link href="/" className="btn-primary mt-2">Retour à l&apos;accueil</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F4F3FB] flex flex-col">
      {/* accent bar */}
      <div className="h-1 w-full flex-shrink-0" style={{ backgroundColor: color }} />

      {/* nav */}
      <header className="bg-white border-b border-[#EEEEF5]">
        <div className="max-w-[480px] mx-auto px-5 h-12 flex items-center justify-between">
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

      <main className="flex-1 max-w-[480px] mx-auto w-full px-4 py-5 space-y-3">

        {/* ── Identity card ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-[24px] overflow-hidden border border-[#EEEEF5] shadow-sm">

          {/* Cover */}
          <div className="h-28 relative"
            style={{ background: `linear-gradient(145deg, #0D0824 0%, #2A1180 55%, ${color} 100%)` }}>
            {verifiedCount > 0 && (
              <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <IconShieldCheck size={10} /> Vérifié
              </span>
            )}
          </div>

          {/* Avatar + identity */}
          <div className="px-6 pb-5 -mt-11 flex flex-col items-center text-center">
            <div className="w-[88px] h-[88px] rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-2xl mb-3 flex-shrink-0"
              style={{ backgroundColor: color }}>
              {initials(profile.fullName ?? '')}
            </div>

            <h1 className="text-[22px] font-bold text-text-primary leading-tight">
              {profile.fullName}
            </h1>

            {profile.title ? (
              <p className="text-sm text-text-secondary mt-1 font-medium">{profile.title}</p>
            ) : (
              <p className="text-sm text-text-tertiary mt-1 italic">Titre non renseigné</p>
            )}

            <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
              {(profile.city || profile.country) && (
                <span className="flex items-center gap-1 text-xs text-text-tertiary">
                  <IconMapPin size={11} />
                  {[profile.city, profile.country].filter(Boolean).join(', ')}
                </span>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm text-text-secondary mt-3 leading-relaxed text-center max-w-xs">
                {profile.bio}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2.5 mt-4 w-full">
              <button onClick={() => downloadVCard(profile)}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-[12px] text-sm font-semibold text-white transition-all active:scale-[0.97] shadow-sm"
                style={{ backgroundColor: color }}>
                <IconDownload size={15} /> Enregistrer
              </button>
              <button onClick={handleShare}
                className="flex-1 h-11 btn-secondary rounded-[12px] justify-center gap-2 text-sm">
                {copied ? <><IconCheck size={14} className="text-success" /> Copié !</> : <><IconShare size={14} /> Partager</>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Expériences', value: profile.experiences?.length ?? 0, color: '#6C47FF', bg: '#F0EDFF' },
            { label: 'Vérifiées',   value: verifiedCount,                    color: '#059669', bg: '#ECFDF5' },
            { label: 'Formations',  value: profile.educations?.length  ?? 0, color: '#2563EB', bg: '#EFF6FF' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#EEEEF5] rounded-[16px] py-3.5 text-center">
              <p className={`text-2xl font-black leading-none ${s.value === 0 ? 'text-text-tertiary' : ''}`}
                style={s.value > 0 ? { color: s.color } : {}}>
                {s.value}
              </p>
              <p className="text-[10px] text-text-tertiary mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Contact ────────────────────────────────────────────────────── */}
        {hasContact && (
          <div className="bg-white rounded-[20px] border border-[#EEEEF5] shadow-sm overflow-hidden divide-y divide-[#F4F3FB]">
            {profile.phone && (
              <a href={`tel:${profile.phone}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors group">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}18` }}>
                  <IconPhone size={15} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-text-tertiary font-semibold uppercase tracking-wide">Téléphone</p>
                  <p className="text-sm font-semibold text-text-primary">{profile.phone}</p>
                </div>
                <IconArrowUpRight size={14} className="text-text-tertiary group-hover:text-text-secondary" />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors group">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}18` }}>
                  <IconBrandLinkedin size={15} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-text-tertiary font-semibold uppercase tracking-wide">LinkedIn</p>
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')}
                  </p>
                </div>
                <IconArrowUpRight size={14} className="text-text-tertiary group-hover:text-text-secondary" />
              </a>
            )}
          </div>
        )}

        {/* ── Empty state ─────────────────────────────────────────────────── */}
        {!hasContent && !hasContact && (
          <div className="bg-white rounded-[20px] border border-[#EEEEF5] px-5 py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
              <IconUser size={20} style={{ color }} />
            </div>
            <p className="text-sm font-semibold text-text-primary">Profil en construction</p>
            <p className="text-xs text-text-tertiary max-w-[200px] mx-auto">
              Ce profil n&apos;a pas encore été complété.
            </p>
          </div>
        )}

        {/* ── Skills ─────────────────────────────────────────────────────── */}
        {(profile.skills?.length ?? 0) > 0 && (
          <div className="bg-white rounded-[20px] border border-[#EEEEF5] shadow-sm px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                <IconCode size={12} style={{ color }} />
              </div>
              <p className="text-xs font-bold text-text-primary uppercase tracking-wide">Compétences</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: string) => (
                <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${color}15`, color }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Experiences ─────────────────────────────────────────────────── */}
        {(profile.experiences?.length ?? 0) > 0 && (
          <div className="bg-white rounded-[20px] border border-[#EEEEF5] shadow-sm px-5 py-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                <IconBriefcase size={12} style={{ color }} />
              </div>
              <p className="text-xs font-bold text-text-primary uppercase tracking-wide">Expériences</p>
            </div>
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
                  <div className={`flex-1 min-w-0 ${isLast ? '' : 'pb-4'}`}>
                    <div className="flex items-start gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-text-primary leading-snug">{exp.title}</p>
                      {isVerified && (
                        <span className="badge-verified flex-shrink-0 mt-0.5">
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
        )}

        {/* ── Educations ──────────────────────────────────────────────────── */}
        {(profile.educations?.length ?? 0) > 0 && (
          <div className="bg-white rounded-[20px] border border-[#EEEEF5] shadow-sm px-5 py-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                <IconSchool size={12} style={{ color }} />
              </div>
              <p className="text-xs font-bold text-text-primary uppercase tracking-wide">Formations</p>
            </div>
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
                  <div className={`flex-1 min-w-0 ${isLast ? '' : 'pb-4'}`}>
                    <p className="text-sm font-semibold text-text-primary leading-snug">{edu.degree}</p>
                    {edu.field && <p className="text-xs font-semibold mt-0.5" style={{ color }}>{edu.field}</p>}
                    <p className="text-xs text-text-secondary mt-0.5">{orgName}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {edu.startYear} – {edu.isCurrent ? 'Présent' : (edu.endYear ?? 'Présent')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="pt-2 pb-6 flex flex-col items-center gap-2">
          <Link href="/register"
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-[#EEEEF5] bg-white text-text-secondary hover:text-primary hover:border-primary/30 transition-colors shadow-sm">
            Créer ma bcarte gratuite <IconArrowUpRight size={12} />
          </Link>
          <p className="text-[10px] text-text-tertiary">
            Propulsé par <Link href="/" className="font-semibold text-primary hover:underline">bcarte.io</Link>
          </p>
        </div>

      </main>
    </div>
  )
}
