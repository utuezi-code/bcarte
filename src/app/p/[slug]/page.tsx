'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { IconShieldCheck, IconMapPin, IconBriefcase, IconBrandLinkedin, IconLoader2, IconLink } from '@tabler/icons-react'

export default function PublicProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied]   = useState(false)

  useEffect(() => {
    fetch(`/api/profiles/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setProfile(d); setLoading(false) })
  }, [slug])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const verifiedCount = profile?.verifications?.filter((v: any) => v.status === 'CONFIRMEE').length ?? 0

  if (loading) return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center">
      <IconLoader2 size={28} className="animate-spin text-primary" />
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center">
      <div className="text-center">
        <p className="font-semibold text-text-primary text-lg">Profil introuvable</p>
        <p className="text-sm text-text-secondary mt-1">Ce profil n&apos;existe pas ou a été supprimé.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg-light">
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-5">

        <div className="card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                {profile.fullName?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-text-primary">{profile.fullName}</h1>
                  {verifiedCount > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                      <IconShieldCheck size={11} /> Vérifié
                    </span>
                  )}
                </div>
                {profile.title && <p className="text-sm text-text-secondary mt-0.5">{profile.title}</p>}
                {(profile.city || profile.country) && (
                  <p className="text-xs text-text-tertiary flex items-center gap-1 mt-1">
                    <IconMapPin size={11} /> {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>
            <button onClick={copyLink}
              className="flex items-center gap-1.5 text-xs font-medium text-text-secondary border border-[#E5E7EB] rounded-lg px-3 py-2 hover:border-primary hover:text-primary transition-colors flex-shrink-0">
              <IconLink size={13} />
              {copied ? 'Copié !' : 'Copier le lien'}
            </button>
          </div>
          {profile.bio && <p className="text-sm text-text-secondary mt-4 leading-relaxed">{profile.bio}</p>}
          {profile.linkedin && (
            <div className="mt-4">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline w-fit">
                <IconBrandLinkedin size={14} /> LinkedIn
              </a>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Expériences', value: profile.experiences?.length ?? 0 },
            { label: 'Vérifiées',   value: verifiedCount },
            { label: 'Formations',  value: profile.educations?.length ?? 0 },
          ].map(s => (
            <div key={s.label} className="card text-center py-4">
              <p className="text-2xl font-black text-primary">{s.value}</p>
              <p className="text-xs text-text-secondary mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {profile.skills?.length > 0 && (
          <div className="card space-y-3">
            <h2 className="font-semibold text-text-primary">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s: string) => (
                <span key={s} className="text-xs bg-[#F3F4F6] text-text-secondary px-3 py-1.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}

        {profile.experiences?.length > 0 && (
          <div className="card space-y-4">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <IconBriefcase size={16} className="text-text-tertiary" /> Expériences
            </h2>
            {profile.experiences.map((exp: any) => {
              const verified = profile.verifications?.find(
                (v: any) => v.organisationId === exp.organisationId && v.status === 'CONFIRMEE'
              )
              return (
                <div key={exp.id} className="flex gap-3 pb-4 border-b border-[#F3F4F6] last:border-0 last:pb-0">
                  <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0 text-xs font-bold text-text-secondary">
                    {exp.company?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-text-primary">{exp.title}</p>
                      {verified && (
                        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-primary bg-primary-light px-1.5 py-0.5 rounded-full">
                          <IconShieldCheck size={9} /> Vérifié
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary">{exp.company}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{exp.startDate} – {exp.endDate ?? 'présent'}</p>
                    {exp.description && <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{exp.description}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {profile.educations?.length > 0 && (
          <div className="card space-y-4">
            <h2 className="font-semibold text-text-primary">Formations</h2>
            {profile.educations.map((edu: any) => (
              <div key={edu.id} className="flex gap-3 pb-4 border-b border-[#F3F4F6] last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0 text-xs font-bold text-text-secondary">
                  {(edu.organisation?.name ?? edu.school)?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{edu.degree}</p>
                  <p className="text-xs text-text-secondary">{edu.organisation?.name ?? edu.school}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{edu.startYear} – {edu.endYear ?? 'présent'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-text-tertiary pb-4">
          Profil bcarte · <a href="/" className="text-primary hover:underline">bcarte.io</a>
        </p>
      </div>
    </div>
  )
}
