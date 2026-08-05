'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  IconShieldCheck, IconMapPin, IconBriefcase, IconBrandLinkedin,
  IconLoader2, IconCheck, IconSchool, IconPhone, IconShare,
  IconDownload, IconArrowUpRight,
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

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <IconLoader2 size={24} className="animate-spin text-gray-300" />
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="font-semibold text-gray-900">Profil introuvable</p>
      <p className="text-sm text-gray-400">Ce profil n&apos;existe pas ou a été supprimé.</p>
      <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">← Retour</Link>
    </div>
  )

  const hasContact = profile.phone || profile.linkedin
  const expList    = profile.experiences ?? []
  const eduList    = profile.educations  ?? []

  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-100">
        <div className="max-w-[480px] mx-auto px-5 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-[6px] flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${color} 0%, #9B6DFF 100%)` }}>
              <span className="text-white text-[10px] font-black">b</span>
            </div>
            <span className="text-sm font-black text-gray-900 tracking-tight">bcarte</span>
          </Link>
          <Link href="/register" className="text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors">
            Créer mon profil →
          </Link>
        </div>
      </header>

      <main className="max-w-[480px] mx-auto px-5">

        {/* ── Photo hero ───────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center pt-10 pb-6">

          {/* Avatar — large and centred */}
          <div className="w-[148px] h-[148px] rounded-full overflow-hidden shadow-xl ring-4 ring-white mb-5 flex-shrink-0 flex items-center justify-center text-white font-black text-4xl"
            style={{ backgroundColor: color }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt={profile.fullName} className="object-cover w-full h-full block" />
              : initials(profile.fullName ?? '')}
          </div>

          {/* Identity */}
          <h1 className="text-[26px] font-black text-gray-900 text-center leading-tight tracking-tight">
            {profile.fullName}
          </h1>

          {profile.title && (
            <p className="text-base font-semibold text-center mt-1" style={{ color }}>
              {profile.title}
            </p>
          )}

          {(profile.city || profile.country) && (
            <p className="flex items-center gap-1 text-xs text-gray-400 mt-2">
              <IconMapPin size={11} />
              {[profile.city, profile.country].filter(Boolean).join(', ')}
            </p>
          )}

          {verifiedCount > 0 && (
            <span className="mt-3 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full"
              style={{ background: `${color}12`, color }}>
              <IconShieldCheck size={12} /> {verifiedCount} vérification{verifiedCount > 1 ? 's' : ''}
            </span>
          )}

          {profile.bio && (
            <p className="text-sm text-gray-500 text-center mt-4 leading-relaxed max-w-[340px]">
              {profile.bio}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2.5 mt-6 w-full">
            <button onClick={() => downloadVCard(profile)}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-full text-sm font-bold text-white transition-all active:scale-[0.97]"
              style={{ backgroundColor: color }}>
              <IconDownload size={15} /> Enregistrer
            </button>
            <button onClick={handleShare}
              className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors active:scale-[0.97]">
              {copied
                ? <><IconCheck size={14} style={{ color }} /> Copié !</>
                : <><IconShare size={14} /> Partager</>}
            </button>
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div className="border-t border-gray-100" />

        {/* ── Contact ──────────────────────────────────────────────────────── */}
        {hasContact && (
          <div className="py-5 space-y-1">
            {profile.phone && (
              <a href={`tel:${profile.phone}`}
                className="flex items-center gap-4 py-3 px-3 -mx-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
                  <IconPhone size={16} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Téléphone</p>
                  <p className="text-sm font-semibold text-gray-900">{profile.phone}</p>
                </div>
                <IconArrowUpRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 py-3 px-3 -mx-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[#E8F0FE]">
                  <IconBrandLinkedin size={16} className="text-[#0A66C2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">LinkedIn</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')}
                  </p>
                </div>
                <IconArrowUpRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </a>
            )}
          </div>
        )}

        {hasContact && (expList.length > 0 || eduList.length > 0 || (profile.skills?.length ?? 0) > 0) && (
          <div className="border-t border-gray-100" />
        )}

        {/* ── Skills ───────────────────────────────────────────────────────── */}
        {(profile.skills?.length ?? 0) > 0 && (
          <div className="py-5">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Compétences</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: string) => (
                <span key={s} className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-gray-100 text-gray-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {(profile.skills?.length ?? 0) > 0 && (expList.length > 0 || eduList.length > 0) && (
          <div className="border-t border-gray-100" />
        )}

        {/* ── Experiences ──────────────────────────────────────────────────── */}
        {expList.length > 0 && (
          <div className="py-5">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Expériences</p>
            <div className="space-y-4">
              {expList.map((exp: any) => {
                const isVerified = profile.verifications?.some(
                  (v: any) => v.organisationId === exp.organisationId && v.status === 'CONFIRMEE'
                )
                return (
                  <div key={exp.id} className="flex gap-3.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: color }}>
                      {initials(exp.company ?? '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-gray-900">{exp.title}</p>
                        {isVerified && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <IconShieldCheck size={9} /> Vérifié
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">
                        {exp.company}{exp.city ? ` · ${exp.city}` : ''}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {fmtDate(exp.startDate)} – {exp.isCurrent ? 'Présent' : (fmtDate(exp.endDate) ?? 'Présent')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {expList.length > 0 && eduList.length > 0 && (
          <div className="border-t border-gray-100" />
        )}

        {/* ── Educations ───────────────────────────────────────────────────── */}
        {eduList.length > 0 && (
          <div className="py-5">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Formations</p>
            <div className="space-y-4">
              {eduList.map((edu: any) => {
                const orgName = edu.organisation?.name ?? edu.school ?? ''
                return (
                  <div key={edu.id} className="flex gap-3.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 bg-gray-100 text-gray-500">
                      {initials(orgName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{edu.degree}</p>
                      {edu.field && <p className="text-xs font-semibold mt-0.5" style={{ color }}>{edu.field}</p>}
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">{orgName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {edu.startYear} – {edu.isCurrent ? 'Présent' : (edu.endYear ?? 'Présent')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div className="border-t border-gray-100 py-8 flex flex-col items-center gap-2">
          <Link href="/register"
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900 transition-colors">
            Créer ma bcarte gratuite <IconArrowUpRight size={11} />
          </Link>
          <p className="text-[10px] text-gray-300">
            Propulsé par <Link href="/" className="font-semibold hover:text-gray-500 transition-colors">bcarte.io</Link>
          </p>
        </div>

      </main>
    </div>
  )
}
