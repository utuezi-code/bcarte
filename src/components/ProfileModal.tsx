'use client'

import { useEffect, useState } from 'react'
import {
  IconX, IconMapPin, IconPhone, IconBrandLinkedin, IconMail,
  IconBriefcase, IconSchool, IconCode, IconDownload, IconLoader2,
  IconCalendar, IconCircleCheck, IconShieldCheck,
} from '@tabler/icons-react'

const AVATAR_COLORS = ['#6C47FF', '#059669', '#C9A84C', '#2563EB', '#DC2626', '#7C3AED', '#0891B2', '#D97706']
function avatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

function buildCV(profile: any, lang = 'fr') {
  const isEn = lang === 'en'
  return `${profile.fullName ?? ''}
${[profile.title, profile.city, profile.country].filter(Boolean).join(' · ')}
${[profile.phone, profile.linkedin, profile.emailPro].filter(Boolean).join(' · ')}

${isEn ? 'PROFILE' : 'PROFIL'}
${profile.bio ?? (isEn ? 'Professional with solid experience.' : 'Professionnel avec une solide expérience.')}

${isEn ? 'EXPERIENCE' : 'EXPÉRIENCES'}
${(profile.experiences ?? []).length === 0
  ? (isEn ? '— No experience' : '— Aucune expérience')
  : profile.experiences.map((e: any) =>
      `${e.title} — ${e.company}${e.city ? ', ' + e.city : ''}${e.isCurrent ? (isEn ? ' (Current)' : ' (En cours)') : ''}`
    ).join('\n')}

${isEn ? 'EDUCATION' : 'FORMATIONS'}
${(profile.educations ?? []).length === 0
  ? (isEn ? '— No education' : '— Aucune formation')
  : profile.educations.map((e: any) =>
      `${e.degree}${e.field ? ' · ' + e.field : ''} — ${e.organisation?.name ?? ''} ${e.startYear ?? ''} – ${e.isCurrent ? (isEn ? 'Present' : 'Présent') : e.endYear ?? ''}`
    ).join('\n')}

${(profile.skills ?? []).length > 0 ? `${isEn ? 'SKILLS' : 'COMPÉTENCES'}\n${profile.skills.join(' · ')}` : ''}`
}

function downloadCV(profile: any) {
  const text = buildCV(profile)
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `CV_${(profile.fullName ?? 'profil').replace(/\s+/g, '_')}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

interface Props {
  slug: string | null
  onClose: () => void
}

export default function ProfileModal({ slug, onClose }: Props) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetch(`/api/profiles/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setProfile(d); setLoading(false) })
  }, [slug])

  /* close on backdrop click or Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const color = profile?.fullName ? avatarColor(profile.fullName) : '#6C47FF'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white w-full sm:max-w-xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">

        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors">
          <IconX size={15} className="text-white" />
        </button>

        {loading || !profile ? (
          <div className="flex items-center justify-center py-24">
            <IconLoader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <div className="flex-shrink-0 px-6 pt-7 pb-5 flex items-start gap-4"
              style={{ background: 'linear-gradient(145deg, #1A0E4E 0%, #3B1FA0 55%, #6C47FF 100%)' }}>
              <div className="w-[72px] h-[72px] rounded-2xl flex-shrink-0 overflow-hidden border-2 border-white/25">
                {profile.avatarUrl
                  ? <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover object-top" />
                  : <div className="w-full h-full flex items-center justify-center text-white text-xl font-black"
                      style={{ background: color }}>
                      {initials(profile.fullName ?? '')}
                    </div>
                }
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-white font-bold text-lg leading-tight truncate">{profile.fullName}</p>
                {profile.title && (
                  <p className="text-white/75 text-sm mt-0.5 truncate">{profile.title}</p>
                )}
                {(profile.city || profile.country) && (
                  <p className="text-white/45 text-xs mt-1.5 flex items-center gap-1">
                    <IconMapPin size={10} />
                    {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </p>
                )}
                {/* verified badges */}
                {profile.verifications?.some((v: any) => v.status === 'CONFIRMEE') && (
                  <div className="flex items-center gap-1 mt-2">
                    <IconCircleCheck size={12} className="text-green-300" />
                    <span className="text-green-300 text-[11px] font-medium">Profil vérifié</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Scrollable body ───────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">

              {/* Bio */}
              {profile.bio && (
                <div className="px-6 py-4">
                  <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-2">Profil</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Skills */}
              {(profile.skills ?? []).length > 0 && (
                <div className="px-6 py-4">
                  <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <IconCode size={12} /> Compétences
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s: string) => (
                      <span key={s} className="text-[12px] bg-primary/8 text-primary px-3 py-1 rounded-full font-medium border border-primary/15">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experiences */}
              {(profile.experiences ?? []).length > 0 && (
                <div className="px-6 py-4">
                  <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <IconBriefcase size={12} /> Expériences
                  </p>
                  <div className="space-y-3">
                    {profile.experiences.map((e: any) => {
                      const verifExp = profile.verifications?.find(
                        (v: any) => v.refId === e.id && v.status === 'CONFIRMEE'
                      )
                      return (
                        <div key={e.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F0EDFF] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <IconBriefcase size={13} style={{ color: '#6C47FF' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-text-primary leading-tight">{e.title}</p>
                              {verifExp && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
                                  <IconShieldCheck size={9} />
                                  {verifExp.organisation?.name ? `Vérifié par ${verifExp.organisation.name}` : 'Vérifié'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary mt-0.5">{e.company}{e.city ? ` · ${e.city}` : ''}</p>
                            {(e.startDate || e.endDate || e.isCurrent) && (
                              <p className="text-xs text-text-tertiary mt-0.5 flex items-center gap-1">
                                <IconCalendar size={10} />
                                {e.startDate?.slice(0, 7) ?? ''}
                                {' — '}
                                {e.isCurrent ? 'Présent' : (e.endDate?.slice(0, 7) ?? '')}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Educations */}
              {(profile.educations ?? []).length > 0 && (
                <div className="px-6 py-4">
                  <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <IconSchool size={12} /> Formations
                  </p>
                  <div className="space-y-3">
                    {profile.educations.map((e: any) => {
                      const verifEdu = profile.verifications?.find(
                        (v: any) => v.refId === e.id && v.status === 'CONFIRMEE'
                      )
                      return (
                        <div key={e.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <IconSchool size={13} style={{ color: '#059669' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-text-primary leading-tight">{e.degree}{e.field ? ` · ${e.field}` : ''}</p>
                              {verifEdu && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
                                  <IconShieldCheck size={9} />
                                  {verifEdu.organisation?.name ? `Vérifié par ${verifEdu.organisation.name}` : 'Vérifié'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary mt-0.5">{e.organisation?.name ?? ''}</p>
                            {(e.startYear || e.endYear || e.isCurrent) && (
                              <p className="text-xs text-text-tertiary mt-0.5 flex items-center gap-1">
                                <IconCalendar size={10} />
                                {e.startYear ?? ''} – {e.isCurrent ? 'Présent' : (e.endYear ?? '')}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Contact */}
              {(profile.phone || profile.linkedin || profile.emailPro) && (
                <div className="px-6 py-4">
                  <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-3">Contact</p>
                  <div className="space-y-2">
                    {profile.emailPro && (
                      <a href={`mailto:${profile.emailPro}`}
                        className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-primary transition-colors">
                        <IconMail size={14} className="text-text-tertiary flex-shrink-0" />
                        {profile.emailPro}
                      </a>
                    )}
                    {profile.phone && (
                      <a href={`tel:${profile.phone}`}
                        className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-primary transition-colors">
                        <IconPhone size={14} className="text-text-tertiary flex-shrink-0" />
                        {profile.phone}
                      </a>
                    )}
                    {profile.linkedin && (
                      <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-primary transition-colors">
                        <IconBrandLinkedin size={14} className="text-text-tertiary flex-shrink-0" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer: download CV ───────────────────────────────────────── */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => downloadCV(profile)}
                className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #9B6DFF 100%)', boxShadow: '0 4px 16px rgba(108,71,255,0.3)' }}>
                <IconDownload size={16} />
                Télécharger le CV
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
