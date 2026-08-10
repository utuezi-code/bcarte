'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  IconCircleCheck, IconBrandWhatsapp, IconMail,
  IconMapPin, IconExternalLink, IconArrowUpRight,
  IconBriefcase, IconCheck, IconUsers, IconWorld,
  IconStack2, IconLoader2, IconBuilding,
} from '@tabler/icons-react'

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

export default function OrgPage() {
  const { slug } = useParams<{ slug: string }>()
  const [org, setOrg]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/orgs/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setOrg(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  const copy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <IconLoader2 size={28} className="animate-spin text-primary" />
    </div>
  )

  if (!org) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-center p-6">
      <IconBuilding size={40} className="text-text-tertiary" />
      <p className="font-bold text-text-primary text-lg">Organisation introuvable</p>
      <p className="text-sm text-text-secondary">Ce profil n&apos;existe pas ou a été supprimé.</p>
      <Link href="/" className="btn-primary mt-2">Retour à l&apos;accueil</Link>
    </div>
  )

  const logoColor = org.logoColor ?? '#6C47FF'
  const activeOffers = org.offers ?? []
  const members = org.members ?? []

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#F3F4F6]">
        <Link href="/" className="text-lg font-extrabold text-primary">bcarte</Link>
        <Link href="/register" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">
          Créer mon profil →
        </Link>
      </header>

      <main className="max-w-[660px] mx-auto px-6 py-12 space-y-10">

        {/* ── IDENTITY ── */}
        <div className="flex items-start gap-5">
          {/* Logo */}
          <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            style={{ backgroundColor: org.logoUrl ? '#F3F4F6' : logoColor }}>
            {org.logoUrl
              ? <img src={org.logoUrl} alt={org.name} className="w-full h-full object-contain" />
              : initials(org.name ?? '')}
          </div>

          <div className="flex-1 pt-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-text-primary">{org.name}</h1>
              {org.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-2 py-0.5 rounded-badge">
                  <IconCircleCheck size={11} />
                  Vérifiée
                </span>
              )}
            </div>
            {org.description && (
              <p className="text-text-secondary mt-1 text-[15px]">{org.description}</p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
              {(org.city || org.country) && (
                <span className="text-text-tertiary text-sm flex items-center gap-1.5">
                  <IconMapPin size={13} />
                  {[org.city, org.country].filter(Boolean).join(', ')}
                </span>
              )}
              {org.sector && (
                <span className="text-text-tertiary text-sm flex items-center gap-1.5">
                  <IconStack2 size={13} />
                  {org.sector}
                </span>
              )}
              {members.length > 0 && (
                <span className="text-text-tertiary text-sm flex items-center gap-1.5">
                  <IconUsers size={13} />
                  {members.length} membre{members.length > 1 ? 's' : ''}
                </span>
              )}
              {org.website && (
                <a href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-primary text-sm flex items-center gap-1.5 hover:underline">
                  <IconWorld size={13} />
                  {org.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── ABOUT ── */}
        {org.description && (
          <section>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] mb-3">À propos</p>
            <p className="text-text-secondary text-[15px] leading-relaxed">{org.description}</p>

            {activeOffers.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-[#F8F7FF] border border-primary-border rounded-xl p-4">
                  <p className="text-2xl font-extrabold text-primary">{members.length}</p>
                  <p className="text-xs text-text-secondary mt-0.5 font-medium">Membres vérifiés</p>
                </div>
                <div className="bg-[#F0FDF4] border border-[#A7F3D0] rounded-xl p-4">
                  <p className="text-2xl font-extrabold text-success">{activeOffers.length}</p>
                  <p className="text-xs text-text-secondary mt-0.5 font-medium">Offres actives</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── TEAM ── */}
        {members.length > 0 && (
          <section>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] mb-4">Équipe</p>
            <div className="space-y-3">
              {members.map((m: any) => {
                const pro = m.profile
                if (!pro) return null
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-primary-light text-primary font-bold text-sm flex-shrink-0">
                      {pro.avatarUrl
                        ? <img src={pro.avatarUrl} alt={pro.fullName} className="w-full h-full object-cover object-top" />
                        : initials(pro.fullName ?? '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      {pro.slug
                        ? <Link href={`/p/${pro.slug}`} className="text-sm font-semibold text-text-primary hover:text-primary transition-colors">{pro.fullName}</Link>
                        : <p className="text-sm font-semibold text-text-primary">{pro.fullName}</p>}
                      <p className="text-xs text-text-tertiary">{pro.title}</p>
                    </div>
                    <IconCircleCheck size={15} className="text-success ml-auto flex-shrink-0" />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── OFFERS ── */}
        {activeOffers.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em]">Offres d&apos;emploi</p>
              <span className="text-xs text-text-tertiary">{activeOffers.length} active{activeOffers.length > 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-3">
              {activeOffers.map((offer: any) => (
                <div key={offer.id} className="border border-[#F3F4F6] hover:border-[#E5E7EB] rounded-xl p-5 transition-colors group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary text-[15px] group-hover:text-primary transition-colors">
                        {offer.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {offer.location && (
                          <span className="text-xs text-text-tertiary flex items-center gap-1">
                            <IconMapPin size={12} /> {offer.location}
                          </span>
                        )}
                        {offer.type && (
                          <>
                            <span className="text-[#E5E7EB]">·</span>
                            <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-badge">
                              {offer.type}
                            </span>
                          </>
                        )}
                        <span className="text-[#E5E7EB]">·</span>
                        <span className="text-xs text-text-tertiary">
                          {new Date(offer.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      {offer.description && (
                        <p className="text-text-secondary text-sm mt-2 leading-relaxed line-clamp-2">{offer.description}</p>
                      )}
                    </div>
                    <IconArrowUpRight size={16} className="text-text-tertiary group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                  </div>
                  {org.website && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-[#F3F4F6]">
                      <a href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-text-primary bg-[#F3F4F6] hover:bg-primary-light hover:text-primary px-3 py-2 rounded-lg transition-colors">
                        <IconBriefcase size={13} /> Postuler
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SHARE ── */}
        <div className="flex items-center justify-between py-5 border-t border-[#F3F4F6]">
          <p className="text-xs text-text-tertiary font-mono">bcarte.io/org/{org.slug}</p>
          <button onClick={copy}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
              copied ? 'bg-success-light text-success' : 'bg-[#F3F4F6] text-text-secondary hover:text-text-primary'
            }`}>
            {copied && <IconCheck size={13} />}
            {copied ? 'Copié' : 'Copier le lien'}
          </button>
        </div>

        <div className="text-center pb-4">
          <p className="text-xs text-text-tertiary">
            Propulsé par{' '}
            <Link href="/" className="font-bold text-primary">bcarte</Link>
          </p>
        </div>

      </main>
    </div>
  )
}
