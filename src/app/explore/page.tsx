'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IconSearch, IconX, IconLoader2, IconMapPin,
  IconShieldCheck, IconUsers, IconBriefcase,
  IconArrowUpRight, IconUserCircle, IconBuilding,
} from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import { COUNTRIES } from '@/lib/constants'

type View = 'profils' | 'organisations'

const AVATAR_COLORS = [
  '#6C47FF', '#059669', '#C9A84C', '#2563EB',
  '#DC2626', '#7C3AED', '#0891B2', '#D97706',
]
function avatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

export default function ExplorePage() {
  const [view,     setView]     = useState<View>('profils')
  const [profiles, setProfiles] = useState<any[]>([])
  const [orgs,     setOrgs]     = useState<any[]>([])
  const [loading,  setLoading]  = useState(false)
  const [search,   setSearch]   = useState('')
  const [country,  setCountry]  = useState('')

  /* debounced fetch */
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      const params = new URLSearchParams()
      if (search)  params.set('search', search)
      if (country) params.set('country', country)

      const url = view === 'profils'
        ? `/api/profiles?${params}`
        : `/api/orgs?${params}`

      fetch(url)
        .then(r => r.json())
        .then(d => {
          if (view === 'profils') setProfiles(d ?? [])
          else setOrgs(d ?? [])
          setLoading(false)
        })
    }, search ? 350 : 0)
    return () => clearTimeout(t)
  }, [view, search, country])

  const results = view === 'profils' ? profiles : orgs

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-[220px] pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 py-7 lg:px-8 lg:py-9 space-y-6">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div>
            <h1 className="page-title">Explorer</h1>
            <p className="page-subtitle">Découvrez des professionnels et organisations vérifiés</p>
          </div>

          {/* ── Controls ───────────────────────────────────────────────────── */}
          <div className="card p-4 space-y-3">
            {/* View toggle */}
            <div className="flex gap-1 p-1 bg-border-subtle rounded-xl w-fit">
              {(['profils', 'organisations'] as View[]).map(v => (
                <button key={v} onClick={() => { setView(v); setSearch(''); setCountry('') }}
                  className={`px-5 py-2 rounded-[10px] text-sm font-semibold capitalize transition-all ${
                    view === v
                      ? 'bg-white text-text-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}>
                  {v}
                </button>
              ))}
            </div>

            {/* Search + filter row */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <IconSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                <input
                  className="input pl-9 pr-9"
                  placeholder={view === 'profils' ? 'Nom, titre, compétence…' : 'Nom, secteur…'}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors">
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

          {/* ── Results ────────────────────────────────────────────────────── */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <IconLoader2 size={28} className="animate-spin text-primary" />
            </div>
          ) : results.length === 0 ? (
            <div className="card text-center py-20 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-border-subtle flex items-center justify-center mx-auto">
                {view === 'profils'
                  ? <IconUserCircle size={26} className="text-text-tertiary" />
                  : <IconBuilding   size={26} className="text-text-tertiary" />}
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">
                  {search
                    ? `Aucun résultat pour « ${search} »`
                    : `Aucun${view === 'profils' ? ' profil' : 'e organisation'} trouvé${view === 'organisations' ? 'e' : ''}`}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {search ? 'Essayez d\'autres mots-clés' : 'Revenez bientôt !'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="section-title">{results.length} résultat{results.length > 1 ? 's' : ''}</p>

              {/* ── Profile cards ─────────────────────────────────────────── */}
              {view === 'profils' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profiles.map((p: any) => {
                    const color = avatarColor(p.fullName ?? '')
                    const skills: string[] = p.skills ?? []
                    const href = p.slug ? `/p/${p.slug}` : '#'
                    return (
                      <Link key={p.id} href={href}
                        className="card hover:shadow-card-hover hover:border-primary/20 transition-all group block space-y-3">
                        {/* Identity */}
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{ backgroundColor: color }}>
                            {initials(p.fullName ?? '')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-text-primary text-sm truncate group-hover:text-primary transition-colors">
                              {p.fullName}
                            </p>
                            <p className="text-xs text-text-secondary mt-0.5 truncate">{p.title || '—'}</p>
                            <p className="text-xs text-text-tertiary mt-0.5 flex items-center gap-1">
                              <IconMapPin size={10} />
                              {[p.city, p.country].filter(Boolean).join(', ') || '—'}
                            </p>
                          </div>
                          <IconArrowUpRight size={13}
                            className="text-text-tertiary group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                        </div>

                        {/* Skills */}
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {skills.slice(0, 3).map(s => (
                              <span key={s}
                                className="text-[11px] bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium">
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
                      </Link>
                    )
                  })}
                </div>
              )}

              {/* ── Org cards ─────────────────────────────────────────────── */}
              {view === 'organisations' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orgs.map((o: any) => (
                    <Link key={o.id} href={`/org/${o.slug}`}
                      className="card hover:shadow-card-hover hover:border-primary/20 transition-all group block">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: o.logoColor ?? '#6C47FF' }}>
                          {initials(o.name ?? '')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-text-primary text-sm group-hover:text-primary transition-colors leading-tight truncate">
                              {o.name}
                            </p>
                            {o.verified && (
                              <span className="badge-verified flex-shrink-0">
                                <IconShieldCheck size={9} /> Vérifié
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {o.type && (
                              <span className="text-[11px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                                {o.type}
                              </span>
                            )}
                            {o.sector && (
                              <span className="text-xs text-text-tertiary truncate">{o.sector}</span>
                            )}
                          </div>
                          <p className="text-xs text-text-tertiary flex items-center gap-1 mt-1">
                            <IconMapPin size={10} />
                            {[o.city, o.country].filter(Boolean).join(', ') || '—'}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                        <span className="text-xs text-text-tertiary flex items-center gap-1">
                          <IconBriefcase size={11} />
                          {o.type ?? 'Organisation'}
                        </span>
                        <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-border-subtle group-hover:bg-primary-light transition-colors">
                          <IconArrowUpRight size={13} className="text-text-tertiary group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
