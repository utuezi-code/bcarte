'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  IconShieldCheck, IconMapPin, IconBrandLinkedin, IconMail,
  IconLoader2, IconCheck, IconPhone, IconShare,
  IconDownload, IconArrowUpRight, IconChevronDown, IconChevronUp,
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
    profile.title    ? `TITLE:${profile.title}`            : '',
    profile.emailPro ? `EMAIL;type=WORK:${profile.emailPro}` : '',
    profile.phone    ? `TEL:${profile.phone}`              : '',
    profile.linkedin ? `URL;type=LinkedIn:${profile.linkedin}` : '',
    `URL:${window.location.href}`,
    'END:VCARD',
  ].filter(Boolean).join('\n')
  const blob = new Blob([lines], { type: 'text/vcard' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: `${(profile.fullName ?? 'contact').replace(/\s+/g, '_')}.vcf` })
  a.click(); URL.revokeObjectURL(url)
}

const BIO_LIMIT = 160

export default function PublicProfilePage() {
  const { slug }       = useParams<{ slug: string }>()
  const [profile,      setProfile]    = useState<any>(null)
  const [loading,      setLoading]    = useState(true)
  const [copied,       setCopied]     = useState(false)
  const [bioExpanded,  setBioExpanded]= useState(false)

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

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <IconLoader2 size={22} className="animate-spin text-gray-200" />
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3 px-5 text-center">
      <p className="font-bold text-gray-900">Profil introuvable</p>
      <p className="text-sm text-gray-400">Ce profil n&apos;existe pas ou a été supprimé.</p>
      <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors mt-1">← Retour</Link>
    </div>
  )

  const hasContact   = profile.phone || profile.linkedin || profile.emailPro
  const expList      = profile.experiences ?? []
  const eduList      = profile.educations  ?? []
  const bio          = profile.bio ?? ''
  const bioTruncated = bio.length > BIO_LIMIT

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[480px] mx-auto relative">

        {/* ── Hero photo ───────────────────────────────────────────────────── */}
        <div className="relative w-full overflow-hidden" style={{ height: 'min(78vw, 430px)' }}>

          {/* Photo or initials */}
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-white font-black select-none"
              style={{ background: `linear-gradient(160deg, ${color} 0%, rgba(${rgb},0.7) 100%)`, fontSize: 'clamp(56px, 18vw, 100px)' }}>
              {initials(profile.fullName ?? '')}
            </div>
          )}

          {/* Subtle dark gradient at top — keeps "Créer mon profil" readable */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />

          {/* Gradient fade at bottom — blends into white wave */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{ height: 110, background: `linear-gradient(to top, white 20%, rgba(255,255,255,0.85) 50%, transparent 100%)` }}
          />

          {/* Wave SVG on top of gradient */}
          <svg
            className="absolute bottom-0 left-0 w-full pointer-events-none"
            viewBox="0 0 480 44"
            preserveAspectRatio="none"
            style={{ height: 44 }}>
            <path d="M0,22 Q120,44 240,28 Q360,12 480,30 L480,44 L0,44 Z" fill="white" />
          </svg>

          {/* bcarte badge — bottom right */}
          <div
            className="absolute right-5 z-10"
            style={{ bottom: 18 }}>
            <div
              className="w-[54px] h-[54px] rounded-full bg-white flex flex-col items-center justify-center gap-0.5"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.16), 0 0 0 2px rgba(255,255,255,0.9)' }}>
              <div
                className="w-[20px] h-[20px] rounded-[5px] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${color} 0%, #9B6DFF 100%)` }}>
                <span className="text-white font-black leading-none" style={{ fontSize: 9 }}>b</span>
              </div>
              <span className="font-black text-gray-900 tracking-tight leading-none" style={{ fontSize: 8 }}>carte</span>
            </div>
          </div>

          {/* Créer mon profil — top right overlay */}
          <Link
            href="/register"
            className="absolute top-3.5 right-4 z-10 text-[11px] font-semibold text-white/90 px-3 py-1 rounded-full transition-colors"
            style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(6px)' }}>
            Créer mon profil →
          </Link>
        </div>

        {/* ── Identity ─────────────────────────────────────────────────────── */}
        <div className="px-6 pt-1 pb-6">

          <h1 className="text-[26px] font-black text-gray-900 leading-tight tracking-tight">
            {profile.fullName}
          </h1>

          {profile.title && (
            <p className="text-[15px] font-semibold mt-1 leading-snug" style={{ color }}>
              {profile.title}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5">
            {(profile.city || profile.country) && (
              <span className="flex items-center gap-1 text-[12px] text-gray-400 font-medium">
                <IconMapPin size={12} />
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </span>
            )}
            {verifiedCount > 0 && (
              <span
                className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-[3px] rounded-full"
                style={{ background: `rgba(${rgb}, 0.1)`, color }}>
                <IconShieldCheck size={11} />
                {verifiedCount} vérifié{verifiedCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* ── Action buttons ── */}
          <div className="flex gap-2.5 mt-5">
            <button
              onClick={() => downloadVCard(profile)}
              className="flex-1 flex items-center justify-center gap-2 h-[50px] rounded-2xl text-[13px] font-bold text-white transition-all active:scale-[0.97]"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, rgba(${rgb}, 0.75) 100%)`,
                boxShadow: `0 4px 20px rgba(${rgb}, 0.35)`,
              }}>
              <IconDownload size={15} strokeWidth={2.5} />
              Enregistrer le contact
            </button>
            <button
              onClick={handleShare}
              className="w-[50px] h-[50px] flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-150 transition-colors active:scale-[0.97] flex-shrink-0"
              style={{ background: '#F3F4F6' }}>
              {copied
                ? <IconCheck size={17} style={{ color }} strokeWidth={2.5} />
                : <IconShare size={17} className="text-gray-500" strokeWidth={2} />}
            </button>
          </div>

          {/* ── Bio ── */}
          {bio && (
            <div className="mt-5">
              <p className="text-[13.5px] text-gray-500 leading-[1.65]">
                {bioExpanded || !bioTruncated ? bio : `${bio.slice(0, BIO_LIMIT)}…`}
              </p>
              {bioTruncated && (
                <button
                  onClick={() => setBioExpanded(v => !v)}
                  className="mt-1.5 flex items-center gap-0.5 text-[12px] font-semibold"
                  style={{ color }}>
                  {bioExpanded
                    ? <><IconChevronUp size={13} /> Réduire</>
                    : <><IconChevronDown size={13} /> Lire la suite</>}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Contact ──────────────────────────────────────────────────────── */}
        {hasContact && (
          <>
            <div className="mx-6 border-t border-gray-100" />
            <div className="px-6 py-4 space-y-1">
              {profile.emailPro && (
                <a href={`mailto:${profile.emailPro}`}
                  className="flex items-center gap-3.5 py-3 px-3 -mx-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `rgba(${rgb}, 0.1)` }}>
                    <IconMail size={16} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                    <p className="text-[13px] font-semibold text-gray-900 mt-0.5 truncate">{profile.emailPro}</p>
                  </div>
                  <IconArrowUpRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                </a>
              )}
              {profile.phone && (
                <a href={`tel:${profile.phone}`}
                  className="flex items-center gap-3.5 py-3 px-3 -mx-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `rgba(${rgb}, 0.1)` }}>
                    <IconPhone size={16} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Téléphone</p>
                    <p className="text-[13px] font-semibold text-gray-900 mt-0.5">{profile.phone}</p>
                  </div>
                  <IconArrowUpRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3.5 py-3 px-3 -mx-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#EBF3FB]">
                    <IconBrandLinkedin size={18} className="text-[#0A66C2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LinkedIn</p>
                    <p className="text-[13px] font-semibold text-gray-900 mt-0.5 truncate">
                      {profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')}
                    </p>
                  </div>
                  <IconArrowUpRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                </a>
              )}
            </div>
          </>
        )}

        {/* ── Skills ───────────────────────────────────────────────────────── */}
        {(profile.skills?.length ?? 0) > 0 && (
          <>
            <div className="mx-6 border-t border-gray-100" />
            <div className="px-6 py-5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Compétences</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s: string) => (
                  <span key={s}
                    className="text-[12px] font-semibold px-3.5 py-1.5 rounded-full"
                    style={{ background: `rgba(${rgb}, 0.08)`, color }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Experiences ──────────────────────────────────────────────────── */}
        {expList.length > 0 && (
          <>
            <div className="mx-6 border-t border-gray-100" />
            <div className="px-6 py-5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Expériences</p>
              <div className="space-y-5">
                {expList.map((exp: any) => {
                  const isVerified = profile.verifications?.some(
                    (v: any) => v.organisationId === exp.organisationId && v.status === 'CONFIRMEE'
                  )
                  return (
                    <div key={exp.id} className="flex gap-3.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 mt-0.5"
                        style={{ background: `linear-gradient(135deg, ${color} 0%, rgba(${rgb}, 0.65) 100%)` }}>
                        {initials(exp.company ?? '')}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[13px] font-bold text-gray-900 leading-snug">{exp.title}</p>
                          {isVerified && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <IconShieldCheck size={9} /> Vérifié
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-gray-500 mt-0.5 font-medium">
                          {exp.company}{exp.city ? ` · ${exp.city}` : ''}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {fmtDate(exp.startDate)} – {exp.isCurrent ? 'Présent' : (fmtDate(exp.endDate) ?? 'Présent')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* ── Educations ───────────────────────────────────────────────────── */}
        {eduList.length > 0 && (
          <>
            <div className="mx-6 border-t border-gray-100" />
            <div className="px-6 py-5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Formations</p>
              <div className="space-y-5">
                {eduList.map((edu: any) => {
                  const orgName = edu.organisation?.name ?? edu.school ?? ''
                  return (
                    <div key={edu.id} className="flex gap-3.5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5 bg-gray-100 text-gray-400">
                        {initials(orgName)}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[13px] font-bold text-gray-900 leading-snug">{edu.degree}</p>
                        {edu.field && <p className="text-[12px] font-semibold mt-0.5" style={{ color }}>{edu.field}</p>}
                        <p className="text-[12px] text-gray-500 mt-0.5 font-medium">{orgName}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {edu.startYear} – {edu.isCurrent ? 'Présent' : (edu.endYear ?? 'Présent')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="mx-6 border-t border-gray-100" />
        <div className="px-6 py-8 flex flex-col items-center gap-2">
          <Link href="/register"
            className="flex items-center gap-1.5 text-[12px] font-bold px-5 py-2.5 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-colors">
            Créer ma bcarte gratuite <IconArrowUpRight size={11} />
          </Link>
          <p className="text-[10px] text-gray-300 mt-1">
            Propulsé par <Link href="/" className="font-semibold hover:text-gray-500 transition-colors">bcarte.io</Link>
          </p>
        </div>

      </div>
    </div>
  )
}
