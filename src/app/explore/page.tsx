'use client'

import { useState } from 'react'
import { IconSearch, IconFilter, IconX } from '@tabler/icons-react'
import ProfileCard from '@/components/profile/ProfileCard'
import { MOCK_PROFILES, SECTORS } from '@/lib/mock-data'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'Toutes disponibilités' },
  { value: 'disponible', label: 'Disponible' },
  { value: 'en_veille', label: 'En veille' },
]

export default function ExplorePage() {
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')
  const [availability, setAvailability] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [verified, setVerified] = useState(false)

  const filtered = MOCK_PROFILES.filter((p) => {
    const matchSearch = !search ||
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.skills.some(s => s.label.toLowerCase().includes(search.toLowerCase()))
    const matchSector = !sector || p.sector === sector
    const matchAvail = !availability || p.availabilityStatus === availability
    const matchVerified = !verified || p.verified
    return matchSearch && matchSector && matchAvail && matchVerified
  })

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Explorer les profils</h1>
            <p className="text-text-secondary text-sm mt-1">
              Découvrez des professionnels vérifiés d&apos;Afrique et du monde
            </p>
          </div>

          {/* Search + Filters */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                <input
                  className="input pl-9 bg-white"
                  placeholder="Rechercher par nom, titre, compétence, ville..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-secondary gap-2 ${showFilters ? 'border-primary text-primary bg-primary-light' : ''}`}
              >
                <IconFilter size={16} />
                <span className="hidden sm:block">Filtres</span>
              </button>
            </div>

            {showFilters && (
              <div className="card grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Secteur</label>
                  <select className="input" value={sector} onChange={(e) => setSector(e.target.value)}>
                    <option value="">Tous les secteurs</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Disponibilité</label>
                  <select className="input" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                    {AVAILABILITY_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Profils vérifiés</label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <div
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${verified ? 'bg-primary' : 'bg-[#E5E7EB]'}`}
                      onClick={() => setVerified(!verified)}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${verified ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                    <span className="text-sm text-text-secondary">Uniquement vérifiés</span>
                  </label>
                </div>
              </div>
            )}

            {/* Active filters */}
            {(search || sector || availability || verified) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-text-secondary">Filtres actifs :</span>
                {search && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-badge">
                    &quot;{search}&quot;
                    <button onClick={() => setSearch('')}><IconX size={10} /></button>
                  </span>
                )}
                {sector && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-badge">
                    {sector}
                    <button onClick={() => setSector('')}><IconX size={10} /></button>
                  </span>
                )}
                {availability && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-badge">
                    {availability}
                    <button onClick={() => setAvailability('')}><IconX size={10} /></button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results count */}
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">{filtered.length}</span> profil{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">Aucun profil trouvé</p>
              <p className="text-text-tertiary text-sm mt-1">Essayez de modifier vos filtres de recherche</p>
              <button
                className="btn-secondary mt-4"
                onClick={() => { setSearch(''); setSector(''); setAvailability(''); setVerified(false) }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
