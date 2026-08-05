'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  IconShieldCheck, IconMapPin, IconBriefcase, IconBrandLinkedin,
  IconLoader2, IconCheck, IconSchool, IconCode,
  IconPhone, IconShare, IconDownload, IconArrowUpRight,
  IconStar,
} from '@tabler/icons-react'

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

const PALETTE = ['#6C47FF', '#0891B2', '#059669', '#D97706', '#DC2626', '#7C3AED', '#2563EB', '#C026D3']
function accentColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return PALETTE[Math.abs(h) % PALETTE.length]
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
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
  const color  = profile ? accentColor(profile.fullName ?? '') : '#6C47FF'
  const rgb    = hexToRgb(color)
  const hasContact = profile?.phone || profile?.linkedin
  const hasContent = (profile?.skills?.length ?? 0) > 0 || (profile?.experiences?.length ?? 0) > 0 || (profile?.educations?.length ?? 0) > 0

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0824' }}>
      <IconLoader2 size={28} className="animate-spin" style={{ color }} />
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-[#F4F3FB] flex flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-bold text-lg" style={{ color }}>Profil introuvable</p>
      <p className="text-sm text-gray-500">Ce profil n&apos;existe pas ou a été supprimé.</p>
      <Link href="/" className="mt-2 px-5 py-2.5 rounded-full text-sm font-bold text-white" style={{ backgroundColor: color }}>
        Retour à l&apos;accueil
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(160deg, #0D0824 0%, #160D3A 50%, #0D0824 100%)` }}>

      {/* ── Top nav ──────────────────────────────────────────────────────── */}
      <header className="max-w-[520px] mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[8px] flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${color} 0%, #9B6DFF 100%)` }}>
            <span className="text-white text-[11px] font-black">b</span>
          </div>
          <span className="text-white/80 text-sm font-bold tracking-tight">bcarte</span>
        </Link>
        <Link href="/register"
          className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors">
          Créer mon profil →
        </Link>
      </header>

      {/* ── Hero card ────────────────────────────────────────────────────── */}
      <div className="max-w-[520px] mx-auto px-4 pt-2 pb-4">
        <div className="relative rounded-[28px] overflow-hidden"
          style={{ background: `linear-gradient(145deg, rgba(${rgb},0.25) 0%, rgba(${rgb},0.08) 100%)`, border: `1px solid rgba(${rgb},0.3)` }}>

          {/* Glow background */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(${rgb},0.3) 0%, transparent 70%)` }} />

          {/* Verified badge */}
          {verifiedCount > 0 && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
              style={{ background: `rgba(${rgb},0.2)`, color, border: `1px solid rgba(${rgb},0.4)` }}>
              <IconShieldCheck size={11} /> Vérifié
            </div>
          )}

          <div className="relative px-6 pt-8 pb-7 flex flex-col items-center text-center">

            {/* Avatar */}
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full blur-xl opacity-60"
                style={{ backgroundColor: color, transform: 'scale(1.2)' }} />
              <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden border-[3px] shadow-2xl"
                style={{ borderColor: `rgba(${rgb}, 0.5)` }}>
                {profile.avatarUrl
                  ? <img src={profile.avatarUrl} alt={profile.fullName} className="object-cover w-full h-full block" />
                  : (
                    <div className="w-full h-full flex items-center justify-center text-white font-black text-4xl"
                      style={{ background: `linear-gradient(135deg, ${color}, #0D0824)` }}>
                      {initials(profile.fullName ?? '')}
                    </div>
                  )}
              </div>
            </div>

            {/* Name */}
            <h1 className="text-[28px] font-black text-white leading-tight tracking-tight">
              {profile.fullName}
            </h1>

            {/* Title */}
            {profile.title && (
              <p className="text-base font-semibold mt-1.5" style={{ color }}>
                {profile.title}
              </p>
            )}

            {/* Location */}
            {(profile.city || profile.country) && (
              <p className="flex items-center gap-1.5 text-xs text-white/50 mt-2 font-medium">
                <IconMapPin size={12} />
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </p>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm text-white/65 mt-4 leading-relaxed max-w-[320px]">
                {profile.bio}
              </p>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3 mt-6 w-full">
              <button onClick={() => downloadVCard(profile)}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-[14px] text-sm font-bold text-white transition-all active:scale-[0.97] shadow-lg"
                style={{ background: `linear-gradient(135deg, ${color} 0%, rgba(${rgb},0.7) 100%)`, boxShadow: `0 4px 20px rgba(${rgb},0.4)` }}>
                <IconDownload size={16} /> Enregistrer
              </button>
              <button onClick={handleShare}
                className="flex-1 h-12 flex items-center justify-center gap-2 rounded-[14px] text-sm font-bold transition-all active:scale-[0.97]"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                {copied
                  ? <><IconCheck size={15} style={{ color }} /> Copié !</>
                  : <><IconShare size={15} /> Partager</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-[520px] mx-auto px-4 pb-10 space-y-3">

        {/* Stats */}
        {(profile.experiences?.length > 0 || profile.educations?.length > 0 || verifiedCount > 0) && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Expériences', value: profile.experiences?.length ?? 0 },
              { label: 'Vérifiées',   value: verifiedCount },
              { label: 'Formations',  value: profile.educations?.length  ?? 0 },
            ].map(s => (
              <div key={s.label}
                className="rounded-[18px] py-4 text-center"
                style={{ background: `rgba(255,255,255,0.05)`, border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-2xl font-black leading-none"
                  style={{ color: s.value > 0 ? color : 'rgba(255,255,255,0.2)' }}>
                  {s.value}
                </p>
                <p className="text-[10px] mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Contact */}
        {hasContact && (
          <div className="rounded-[20px] overflow-hidden divide-y"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {profile.phone && (
              <a href={`tel:${profile.phone}`}
                className="flex items-center gap-4 px-5 py-4 transition-colors group"
                style={{ borderBottom: profile.linkedin ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(${rgb},0.2)` }}>
                  <IconPhone size={16} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Téléphone</p>
                  <p className="text-sm font-bold text-white">{profile.phone}</p>
                </div>
                <IconArrowUpRight size={15} style={{ color: 'rgba(255,255,255,0.3)' }} />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 px-5 py-4 transition-colors group">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(${rgb},0.2)` }}>
                  <IconBrandLinkedin size={16} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>LinkedIn</p>
                  <p className="text-sm font-bold text-white truncate">
                    {profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')}
                  </p>
                </div>
                <IconArrowUpRight size={15} style={{ color: 'rgba(255,255,255,0.3)' }} />
              </a>
            )}
          </div>
        )}

        {/* Skills */}
        {(profile.skills?.length ?? 0) > 0 && (
          <div className="rounded-[20px] px-5 py-5"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 mb-4">
              <IconCode size={14} style={{ color }} />
              <p className="text-xs font-black text-white uppercase tracking-widest">Compétences</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: string) => (
                <span key={s}
                  className="text-xs font-bold px-3.5 py-1.5 rounded-full"
                  style={{ background: `rgba(${rgb},0.15)`, color, border: `1px solid rgba(${rgb},0.3)` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experiences */}
        {(profile.experiences?.length ?? 0) > 0 && (
          <div className="rounded-[20px] px-5 py-5"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 mb-5">
              <IconBriefcase size={14} style={{ color }} />
              <p className="text-xs font-black text-white uppercase tracking-widest">Expériences</p>
            </div>
            {profile.experiences.map((exp: any, i: number) => {
              const isVerified = profile.verifications?.some(
                (v: any) => v.organisationId === exp.organisationId && v.status === 'CONFIRMEE'
              )
              const isLast = i === profile.experiences.length - 1
              return (
                <div key={exp.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ background: `rgba(${rgb},0.2)`, border: `1px solid rgba(${rgb},0.3)`, color }}>
                      {initials(exp.company ?? '')}
                    </div>
                    {!isLast && <div className="w-px flex-1 mt-2 mb-2 min-h-[12px]" style={{ background: 'rgba(255,255,255,0.08)' }} />}
                  </div>
                  <div className={`flex-1 min-w-0 ${isLast ? '' : 'pb-5'}`}>
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="text-sm font-bold text-white leading-snug">{exp.title}</p>
                      {isVerified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: 'rgba(5,150,105,0.2)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)' }}>
                          <IconShieldCheck size={9} /> Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {exp.company}{exp.city ? ` · ${exp.city}` : ''}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {fmtDate(exp.startDate)} – {exp.isCurrent ? 'Présent' : (fmtDate(exp.endDate) ?? 'Présent')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Educations */}
        {(profile.educations?.length ?? 0) > 0 && (
          <div className="rounded-[20px] px-5 py-5"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 mb-5">
              <IconSchool size={14} style={{ color }} />
              <p className="text-xs font-black text-white uppercase tracking-widest">Formations</p>
            </div>
            {profile.educations.map((edu: any, i: number) => {
              const orgName = edu.organisation?.name ?? edu.school ?? ''
              const isLast  = i === profile.educations.length - 1
              return (
                <div key={edu.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>
                      {initials(orgName)}
                    </div>
                    {!isLast && <div className="w-px flex-1 mt-2 mb-2 min-h-[12px]" style={{ background: 'rgba(255,255,255,0.08)' }} />}
                  </div>
                  <div className={`flex-1 min-w-0 ${isLast ? '' : 'pb-5'}`}>
                    <p className="text-sm font-bold text-white leading-snug">{edu.degree}</p>
                    {edu.field && <p className="text-xs font-semibold mt-0.5" style={{ color }}>{edu.field}</p>}
                    <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{orgName}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {edu.startYear} – {edu.isCurrent ? 'Présent' : (edu.endYear ?? 'Présent')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {!hasContent && !hasContact && (
          <div className="rounded-[20px] px-5 py-10 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3"
              style={{ background: `rgba(${rgb},0.15)` }}>
              <IconStar size={20} style={{ color }} />
            </div>
            <p className="text-sm font-bold text-white/60">Profil en construction</p>
            <p className="text-xs text-white/30 mt-1">Bientôt disponible.</p>
          </div>
        )}

        {/* Footer CTA */}
        <div className="pt-3 pb-2 flex flex-col items-center gap-3">
          <Link href="/register"
            className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full transition-all"
            style={{ background: `rgba(${rgb},0.15)`, border: `1px solid rgba(${rgb},0.3)`, color }}>
            Créer ma bcarte gratuite <IconArrowUpRight size={13} />
          </Link>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Propulsé par <Link href="/" className="font-bold hover:underline" style={{ color: `rgba(${rgb},0.7)` }}>bcarte.io</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
