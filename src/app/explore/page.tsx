'use client'

import { useEffect, useState } from 'react'
import { IconSearch, IconX, IconLoader2 } from '@tabler/icons-react'
import ProfileCard from '@/components/profile/ProfileCard'
import OrgCard from '@/components/profile/OrgCard'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import { COUNTRIES } from '@/lib/constants'

type View = 'profils' | 'organisations'

export default function ExplorePage() {
  const [view, setView]           = useState<View>('profils')
  const [profiles, setProfiles]   = useState<any[]>([])
  const [orgs, setOrgs]           = useState<any[]>([])
  const [loading, setLoading]     = useState(false)
  const [search, setSearch]       = useState('')
  const [country, setCountry]     = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (country) params.set('country', country)

    if (view === 'profils') {
      fetch(`/api/profiles?${params}`).then(r => r.json()).then(d => { setProfiles(d); setLoading(false) })
    } else {
      fetch(`/api/orgs?${params}`).then(r => r.json()).then(d => { setOrgs(d); setLoading(false) })
    }
  }, [view, search, country])

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl lg:text-[28px] font-bold text-text-primary">Explorer</h1>
            <p className="text-sm text-text-secondary mt-1">Découvrez des professionnels et organisations vérifiés</p>
          </div>

          {/* Toggle vue */}
          <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-xl w-fit">
            {(['profils', 'organisations'] as View[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${view === v ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
                {v}
              </button>
            ))}
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                className="input pl-9"
                placeholder={view === 'profils' ? 'Nom, titre…' : 'Nom, secteur…'}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                  <IconX size={14} />
                </button>
              )}
            </div>
            <select className="input w-auto" value={country} onChange={e => setCountry(e.target.value)}>
              <option value="">Tous les pays</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Résultats */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <IconLoader2 size={28} className="animate-spin text-primary" />
            </div>
          ) : view === 'profils' ? (
            profiles.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-medium text-text-primary">Aucun profil trouvé</p>
                <p className="text-sm text-text-secondary mt-1">Essayez d&apos;autres critères de recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((p: any) => (
                  <div key={p.id} className="card hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                        {p.fullName?.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary truncate">{p.fullName}</p>
                        <p className="text-xs text-text-secondary truncate">{p.title}</p>
                        <p className="text-xs text-text-tertiary">{p.city}, {p.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            orgs.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-medium text-text-primary">Aucune organisation trouvée</p>
                <p className="text-sm text-text-secondary mt-1">Essayez d&apos;autres critères de recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {orgs.map((o: any) => (
                  <div key={o.id} className="card hover:shadow-sm transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: o.logoColor ?? '#6C47FF' }}>
                        {o.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary truncate">{o.name}</p>
                        <p className="text-xs text-text-secondary">{o.type} · {o.sector}</p>
                        <p className="text-xs text-text-tertiary">{o.city}, {o.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
