'use client'

import { useEffect, useState } from 'react'
import { IconSearch, IconLoader2, IconUsers, IconBriefcase } from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import { COUNTRIES } from '@/lib/constants'

const TABS = ['Recherche', 'Favoris', 'Offres']

export default function RecruiterPage() {
  const [tab, setTab]         = useState(0)
  const [profiles, setProfiles] = useState<any[]>([])
  const [offers, setOffers]   = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch]   = useState('')
  const [country, setCountry] = useState('')

  useEffect(() => {
    if (tab !== 0) return
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (country) params.set('country', country)
    fetch(`/api/profiles?${params}`).then(r => r.json()).then(d => { setProfiles(d); setLoading(false) })
  }, [tab, search, country])

  useEffect(() => {
    if (tab !== 2) return
    fetch('/api/org/offers').then(r => r.ok ? r.json() : []).then(setOffers)
  }, [tab])

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Espace recruteur</h1>
            <p className="text-sm text-text-secondary mt-1">Trouvez et contactez les meilleurs talents vérifiés</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-xl w-fit">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === i ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Recherche */}
          {tab === 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input className="input pl-9" placeholder="Nom, titre, compétence…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="input w-auto" value={country} onChange={e => setCountry(e.target.value)}>
                  <option value="">Tous les pays</option>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20"><IconLoader2 size={28} className="animate-spin text-primary" /></div>
              ) : profiles.length === 0 ? (
                <div className="card text-center py-16">
                  <IconUsers size={32} className="text-text-tertiary mx-auto mb-3" />
                  <p className="font-medium text-text-primary">Aucun profil trouvé</p>
                  <p className="text-sm text-text-secondary mt-1">Modifiez vos critères de recherche</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profiles.map((p: any) => (
                    <div key={p.id} className="card hover:shadow-sm transition-shadow">
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
              )}
            </div>
          )}

          {/* Favoris */}
          {tab === 1 && (
            <div className="card text-center py-16">
              <p className="font-medium text-text-primary">Aucun favori</p>
              <p className="text-sm text-text-secondary mt-1">Sauvegardez des profils depuis la recherche</p>
            </div>
          )}

          {/* Offres */}
          {tab === 2 && (
            <div className="space-y-3">
              {offers.length === 0 ? (
                <div className="card text-center py-16">
                  <IconBriefcase size={32} className="text-text-tertiary mx-auto mb-3" />
                  <p className="font-medium text-text-primary">Aucune offre publiée</p>
                  <p className="text-sm text-text-secondary mt-1">Gérez vos offres depuis le tableau de bord organisation</p>
                </div>
              ) : offers.map((o: any) => (
                <div key={o.id} className="card">
                  <p className="font-semibold text-text-primary">{o.title}</p>
                  <p className="text-sm text-text-secondary">{o.location} · {o.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
