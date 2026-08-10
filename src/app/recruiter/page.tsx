'use client'

import { useEffect, useState } from 'react'
import {
  IconSearch, IconLoader2, IconUsers, IconBriefcase,
  IconMapPin, IconX, IconArrowUpRight, IconShieldCheck,
} from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import ProfileModal from '@/components/ProfileModal'
import { COUNTRIES } from '@/lib/constants'

const TABS = ['Recherche', 'Offres']

const AVATAR_COLORS = ['#6C47FF', '#059669', '#C9A84C', '#2563EB', '#DC2626', '#7C3AED', '#0891B2', '#D97706']
function avatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

export default function RecruiterPage() {
  const [tab,        setTab]        = useState(0)
  const [profiles,   setProfiles]   = useState<any[]>([])
  const [offers,     setOffers]     = useState<any[]>([])
  const [loading,    setLoading]    = useState(false)
  const [search,     setSearch]     = useState('')
  const [country,    setCountry]    = useState('')
  const [modalSlug,  setModalSlug]  = useState<string | null>(null)

  /* fetch profiles with debounce */
  useEffect(() => {
    if (tab !== 0) return
    setLoading(true)
    const t = setTimeout(() => {
      const params = new URLSearchParams()
      if (search)  params.set('search', search)
      if (country) params.set('country', country)
      fetch(`/api/profiles?${params}`)
        .then(r => r.ok ? r.json() : [])
        .then(d => { setProfiles(Array.isArray(d) ? d : []); setLoading(false) })
        .catch(() => setLoading(false))
    }, search ? 350 : 0)
    return () => clearTimeout(t)
  }, [tab, search, country])

  /* fetch offers */
  useEffect(() => {
    if (tab !== 1) return
    fetch('/api/org/offers')
      .then(r => r.ok ? r.json() : [])
      .then(d => setOffers(Array.isArray(d) ? d : []))
  }, [tab])

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-[220px] pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 py-7 lg:px-8 lg:py-9 space-y-6">

          {/* Header */}
          <div>
            <h1 className="page-title">Espace recruteur</h1>
            <p className="page-subtitle">Trouvez et contactez les meilleurs talents vérifiés</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-border-subtle rounded-xl w-fit">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                className={`px-5 py-2 rounded-[10px] text-sm font-semibold transition-all ${
                  tab === i ? 'bg-white text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-secondary'
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* ── Recherche ── */}
          {tab === 0 && (
            <div className="space-y-5">
              {/* Search bar */}
              <div className="card p-4">
                <div className="flex flex-wrap gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <IconSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                    <input className="input pl-9 pr-9" placeholder="Nom, titre, compétence…"
                      value={search} onChange={e => setSearch(e.target.value)} />
                    {search && (
                      <button onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary">
                        <IconX size={14} />
                      </button>
                    )}
                  </div>
                  <select className="input w-auto min-w-[150px]" value={country}
                    onChange={e => setCountry(e.target.value)}>
                    <option value="">Tous les pays</option>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Results */}
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <IconLoader2 size={28} className="animate-spin text-primary" />
                </div>
              ) : profiles.length === 0 ? (
                <div className="card text-center py-20 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-border-subtle flex items-center justify-center mx-auto">
                    <IconUsers size={26} className="text-text-tertiary" />
                  </div>
                  <p className="font-semibold text-text-primary text-sm">Aucun profil trouvé</p>
                  <p className="text-xs text-text-secondary">Modifiez vos critères de recherche</p>
                </div>
              ) : (
                <>
                  <p className="section-title">{profiles.length} profil{profiles.length > 1 ? 's' : ''}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profiles.map((p: any) => {
                      const color  = avatarColor(p.fullName ?? '')
                      const skills: string[] = p.skills ?? []

                      return (
                        <button key={p.id}
                          onClick={() => p.slug && setModalSlug(p.slug)}
                          className="card hover:shadow-card-hover hover:border-primary/20 transition-all group text-left w-full space-y-3">

                          {/* Avatar + identity */}
                          <div className="flex items-start gap-3">
                            <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                              style={{ backgroundColor: color }}>
                              {p.avatarUrl
                                ? <img src={p.avatarUrl} alt={p.fullName} className="w-full h-full object-cover object-top" />
                                : initials(p.fullName ?? '')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-text-primary text-sm truncate group-hover:text-primary transition-colors">
                                  {p.fullName}
                                </p>
                              </div>
                              <p className="text-xs text-text-secondary mt-0.5 truncate">{p.title || '—'}</p>
                              <p className="text-xs text-text-tertiary mt-0.5 flex items-center gap-1">
                                <IconMapPin size={10} />
                                {[p.city, p.country].filter(Boolean).join(', ') || '—'}
                              </p>
                            </div>
                            <IconArrowUpRight size={13} className="text-text-tertiary group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                          </div>

                          {/* Skills */}
                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {skills.slice(0, 3).map(s => (
                                <span key={s} className="text-[11px] bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium">
                                  {s}
                                </span>
                              ))}
                              {skills.length > 3 && (
                                <span className="text-[11px] bg-border-subtle text-text-tertiary px-2 py-0.5 rounded-full font-medium">
                                  +{skills.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Verified badge */}
                          {(p.verifiedCount ?? 0) > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                              <IconShieldCheck size={10} />
                              {p.verifiedCount} vérifié{p.verifiedCount > 1 ? 's' : ''}
                            </span>
                          )}

                          {/* CTA */}
                          <div className="pt-1 border-t border-border-subtle">
                            <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
                              <IconArrowUpRight size={11} /> Voir le profil & CV
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Offres ── */}
          {tab === 1 && (
            <div className="space-y-3">
              {offers.length === 0 ? (
                <div className="card text-center py-20 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-border-subtle flex items-center justify-center mx-auto">
                    <IconBriefcase size={26} className="text-text-tertiary" />
                  </div>
                  <p className="font-semibold text-text-primary text-sm">Aucune offre publiée</p>
                  <p className="text-xs text-text-secondary">Gérez vos offres depuis le tableau de bord organisation</p>
                </div>
              ) : offers.map((o: any) => (
                <div key={o.id} className="card">
                  <p className="font-semibold text-text-primary">{o.title}</p>
                  <p className="text-sm text-text-secondary mt-0.5">{o.location} · {o.type}</p>
                  {o.description && (
                    <p className="text-xs text-text-tertiary mt-2 line-clamp-2">{o.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
      <BottomNav />

      {modalSlug && (
        <ProfileModal slug={modalSlug} onClose={() => setModalSlug(null)} />
      )}
    </div>
  )
}
