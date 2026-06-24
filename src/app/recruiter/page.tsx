'use client'

import { useState } from 'react'
import { IconSearch, IconHeart, IconBuilding, IconBriefcase, IconPlus, IconBrandWhatsapp, IconMail, IconCircleCheck, IconMapPin } from '@tabler/icons-react'
import { MOCK_PROFILES, MOCK_JOB_OFFERS, SECTORS } from '@/lib/mock-data'
import ProfileCard from '@/components/profile/ProfileCard'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

const TABS = ['Recherche', 'Favoris', 'Mon organisation', 'Offres']

const FAVORITES = MOCK_PROFILES.filter(p => p.verified).slice(0, 4)

export default function RecruiterPage() {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')

  const filtered = MOCK_PROFILES.filter((p) => {
    const matchSearch = !search || p.fullName.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase())
    const matchSector = !sector || p.sector === sector
    return matchSearch && matchSector
  })

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Espace Recruteur</h1>
            <p className="text-text-secondary text-sm mt-1">Trouvez et contactez les meilleurs talents vérifiés</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
            {TABS.map((t, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  tab === i ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Recherche tab */}
          {tab === 0 && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                  <input className="input pl-9 bg-white" placeholder="Nom, titre, compétence..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select className="input bg-white w-auto" value={sector} onChange={(e) => setSector(e.target.value)}>
                  <option value="">Tous les secteurs</option>
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <p className="text-sm text-text-secondary"><span className="font-semibold text-text-primary">{filtered.length}</span> profils</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(p => <ProfileCard key={p.id} profile={p} />)}
              </div>
            </div>
          )}

          {/* Favoris tab */}
          {tab === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">{FAVORITES.length} profils sauvegardés</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FAVORITES.map(p => (
                  <div key={p.id} className="relative">
                    <button className="absolute top-3 right-3 z-10 w-7 h-7 bg-red-50 rounded-btn flex items-center justify-center hover:bg-red-100" aria-label="Retirer des favoris">
                      <IconHeart size={14} className="text-danger fill-danger" />
                    </button>
                    <ProfileCard profile={p} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organisation tab */}
          {tab === 2 && (
            <div className="max-w-lg space-y-4">
              <div className="card space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-light rounded-card-lg flex items-center justify-center">
                    <IconBuilding size={28} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">Talent Africa Group</p>
                    <p className="text-sm text-text-secondary">Organisation vérifiée</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="label">Nom de l&apos;organisation</label>
                    <input className="input" defaultValue="Talent Africa Group" />
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea className="input resize-none" rows={3} defaultValue="Cabinet de recrutement spécialisé dans les talents tech et finance en Afrique de l'Ouest." />
                  </div>
                  <div>
                    <label className="label">Site web</label>
                    <input className="input" type="url" defaultValue="https://talentagrica.com" />
                  </div>
                </div>
                <button className="btn-primary">Enregistrer</button>
              </div>
            </div>
          )}

          {/* Offres tab */}
          {tab === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary">{MOCK_JOB_OFFERS.length} offres actives</p>
                <button className="btn-primary">
                  <IconPlus size={16} />
                  Publier une offre
                </button>
              </div>
              <div className="space-y-3">
                {MOCK_JOB_OFFERS.map((offer) => (
                  <div key={offer.id} className="card">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-text-primary">{offer.title}</p>
                        <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                          <IconMapPin size={14} />
                          {offer.location}
                        </p>
                        <p className="text-sm text-text-secondary mt-2">{offer.description}</p>
                      </div>
                      <span className="text-xs text-text-tertiary flex-shrink-0">{offer.createdAt}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="btn-secondary text-xs py-1.5 px-3">Modifier</button>
                      <button className="btn-ghost text-xs py-1.5 px-3 hover:text-danger">Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
