'use client'

import { useState } from 'react'
import { IconSearch, IconFilter, IconX, IconUser, IconBuilding } from '@tabler/icons-react'
import ProfileCard from '@/components/profile/ProfileCard'
import OrgCard, { OrgCardData } from '@/components/profile/OrgCard'
import { MOCK_PROFILES, SECTORS } from '@/lib/mock-data'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'Toutes disponibilités' },
  { value: 'disponible', label: 'Disponible' },
  { value: 'en_veille', label: 'En veille' },
]

const MOCK_ORGS: OrgCardData[] = [
  {
    slug: 'talent-africa-group',
    name: 'Talent Africa Group',
    initials: 'TA',
    type: 'Entreprise',
    sector: 'Recrutement & RH',
    city: 'Dakar', country: 'Sénégal',
    verified: true,
    membersOnBcarte: 8,
    activeOffers: 3,
    logoColor: '#0C0A18',
  },
  {
    slug: 'orange-digital-center',
    name: 'Orange Digital Center',
    initials: 'OD',
    type: 'Entreprise',
    sector: 'Technologie & Formation',
    city: 'Dakar', country: 'Sénégal',
    verified: true,
    membersOnBcarte: 24,
    activeOffers: 2,
    logoColor: '#FF6600',
  },
  {
    slug: 'ecole-polytechnique-thies',
    name: 'École Polytechnique de Thiès',
    initials: 'EP',
    type: 'École',
    sector: 'Enseignement supérieur',
    city: 'Thiès', country: 'Sénégal',
    verified: true,
    membersOnBcarte: 41,
    activeOffers: 0,
    logoColor: '#2563EB',
  },
  {
    slug: 'universite-cheikh-anta-diop',
    name: 'Université Cheikh Anta Diop',
    initials: 'UC',
    type: 'Université',
    sector: 'Enseignement supérieur',
    city: 'Dakar', country: 'Sénégal',
    verified: true,
    membersOnBcarte: 134,
    activeOffers: 0,
    logoColor: '#059669',
  },
  {
    slug: 'teranga-tech',
    name: 'Teranga Tech',
    initials: 'TT',
    type: 'Entreprise',
    sector: 'Technologie',
    city: 'Dakar', country: 'Sénégal',
    verified: true,
    membersOnBcarte: 12,
    activeOffers: 4,
    logoColor: '#7C5CBF',
  },
  {
    slug: 'banque-atlantique-ci',
    name: 'Banque Atlantique CI',
    initials: 'BA',
    type: 'Entreprise',
    sector: 'Finance & Banque',
    city: 'Abidjan', country: 'Côte d\'Ivoire',
    verified: true,
    membersOnBcarte: 19,
    activeOffers: 1,
    logoColor: '#0891B2',
  },
  {
    slug: 'universite-felix-houphouet-boigny',
    name: 'Université Félix Houphouët-Boigny',
    initials: 'UF',
    type: 'Université',
    sector: 'Enseignement supérieur',
    city: 'Abidjan', country: 'Côte d\'Ivoire',
    verified: false,
    membersOnBcarte: 67,
    activeOffers: 0,
    logoColor: '#D97706',
  },
  {
    slug: 'mtn-africa',
    name: 'MTN Africa',
    initials: 'MT',
    type: 'Entreprise',
    sector: 'Télécommunications',
    city: 'Accra', country: 'Ghana',
    verified: true,
    membersOnBcarte: 55,
    activeOffers: 6,
    logoColor: '#CA8A04',
  },
  {
    slug: 'africapital-partners',
    name: 'AfriCapital Partners',
    initials: 'AC',
    type: 'Entreprise',
    sector: 'Finance & Investissement',
    city: 'Paris', country: 'France',
    verified: true,
    membersOnBcarte: 7,
    activeOffers: 1,
    logoColor: '#374151',
  },
  {
    slug: 'esp-dakar',
    name: 'École Supérieure Polytechnique',
    initials: 'ES',
    type: 'École',
    sector: 'Enseignement supérieur',
    city: 'Dakar', country: 'Sénégal',
    verified: true,
    membersOnBcarte: 88,
    activeOffers: 0,
    logoColor: '#DC2626',
  },
]

const ORG_SECTORS = [...new Set(MOCK_ORGS.map(o => o.sector))].sort()
const ORG_TYPES = ['Entreprise', 'Université', 'École', 'ONG', 'Institution']

export default function ExplorePage() {
  const [view, setView] = useState<'profils' | 'organisations'>('profils')

  // Profils filters
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')
  const [availability, setAvailability] = useState('')
  const [verified, setVerified] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Orgs filters
  const [orgSearch, setOrgSearch] = useState('')
  const [orgSector, setOrgSector] = useState('')
  const [orgType, setOrgType] = useState('')
  const [orgVerified, setOrgVerified] = useState(false)
  const [showOrgFilters, setShowOrgFilters] = useState(false)

  const filteredProfiles = MOCK_PROFILES.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      p.fullName.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.skills.some(s => s.label.toLowerCase().includes(q))
    const matchSector = !sector || p.sector === sector
    const matchAvail = !availability || p.availabilityStatus === availability
    const matchVerified = !verified || p.verified
    return matchSearch && matchSector && matchAvail && matchVerified
  })

  const filteredOrgs = MOCK_ORGS.filter((o) => {
    const q = orgSearch.toLowerCase()
    const matchSearch = !orgSearch ||
      o.name.toLowerCase().includes(q) ||
      o.sector.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q) ||
      o.country.toLowerCase().includes(q)
    const matchSector = !orgSector || o.sector === orgSector
    const matchType = !orgType || o.type === orgType
    const matchVerified = !orgVerified || o.verified
    return matchSearch && matchSector && matchType && matchVerified
  })

  const resetProfileFilters = () => { setSearch(''); setSector(''); setAvailability(''); setVerified(false) }
  const resetOrgFilters = () => { setOrgSearch(''); setOrgSector(''); setOrgType(''); setOrgVerified(false) }

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Explorer</h1>
            <p className="text-text-secondary text-sm mt-1">
              Découvrez des professionnels et organisations vérifiés d&apos;Afrique et du monde
            </p>
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-xl w-fit">
            <button
              onClick={() => setView('profils')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                view === 'profils'
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <IconUser size={15} />
              Profils
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-badge ${view === 'profils' ? 'bg-primary-light text-primary' : 'bg-[#E5E7EB] text-text-tertiary'}`}>
                {filteredProfiles.length}
              </span>
            </button>
            <button
              onClick={() => setView('organisations')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                view === 'organisations'
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <IconBuilding size={15} />
              Organisations
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-badge ${view === 'organisations' ? 'bg-primary-light text-primary' : 'bg-[#E5E7EB] text-text-tertiary'}`}>
                {filteredOrgs.length}
              </span>
            </button>
          </div>

          {/* ── PROFILS ── */}
          {view === 'profils' && (
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                    <input
                      className="input pl-9 bg-white"
                      placeholder="Nom, titre, compétence, ville..."
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

                {(search || sector || availability || verified) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-text-secondary">Filtres actifs :</span>
                    {search && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-badge">
                        &quot;{search}&quot; <button onClick={() => setSearch('')}><IconX size={10} /></button>
                      </span>
                    )}
                    {sector && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-badge">
                        {sector} <button onClick={() => setSector('')}><IconX size={10} /></button>
                      </span>
                    )}
                    {availability && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-badge">
                        {availability} <button onClick={() => setAvailability('')}><IconX size={10} /></button>
                      </span>
                    )}
                    {verified && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-badge">
                        Vérifiés <button onClick={() => setVerified(false)}><IconX size={10} /></button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {filteredProfiles.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProfiles.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-text-secondary font-medium">Aucun profil trouvé</p>
                  <p className="text-text-tertiary text-sm mt-1">Essayez de modifier vos filtres</p>
                  <button className="btn-secondary mt-4" onClick={resetProfileFilters}>Réinitialiser</button>
                </div>
              )}
            </div>
          )}

          {/* ── ORGANISATIONS ── */}
          {view === 'organisations' && (
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                    <input
                      className="input pl-9 bg-white"
                      placeholder="Nom, secteur, pays, ville..."
                      value={orgSearch}
                      onChange={(e) => setOrgSearch(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setShowOrgFilters(!showOrgFilters)}
                    className={`btn-secondary gap-2 ${showOrgFilters ? 'border-primary text-primary bg-primary-light' : ''}`}
                  >
                    <IconFilter size={16} />
                    <span className="hidden sm:block">Filtres</span>
                  </button>
                </div>

                {showOrgFilters && (
                  <div className="card grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="label">Secteur</label>
                      <select className="input" value={orgSector} onChange={(e) => setOrgSector(e.target.value)}>
                        <option value="">Tous les secteurs</option>
                        {ORG_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Type</label>
                      <select className="input" value={orgType} onChange={(e) => setOrgType(e.target.value)}>
                        <option value="">Tous les types</option>
                        {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Vérifiées uniquement</label>
                      <label className="flex items-center gap-2 cursor-pointer mt-2">
                        <div
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${orgVerified ? 'bg-primary' : 'bg-[#E5E7EB]'}`}
                          onClick={() => setOrgVerified(!orgVerified)}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${orgVerified ? 'translate-x-6' : 'translate-x-1'}`} />
                        </div>
                        <span className="text-sm text-text-secondary">Vérifiées</span>
                      </label>
                    </div>
                  </div>
                )}

                {(orgSearch || orgSector || orgType || orgVerified) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-text-secondary">Filtres actifs :</span>
                    {orgSearch && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-badge">
                        &quot;{orgSearch}&quot; <button onClick={() => setOrgSearch('')}><IconX size={10} /></button>
                      </span>
                    )}
                    {orgSector && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-badge">
                        {orgSector} <button onClick={() => setOrgSector('')}><IconX size={10} /></button>
                      </span>
                    )}
                    {orgType && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-badge">
                        {orgType} <button onClick={() => setOrgType('')}><IconX size={10} /></button>
                      </span>
                    )}
                    {orgVerified && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary-light text-primary px-2 py-1 rounded-badge">
                        Vérifiées <button onClick={() => setOrgVerified(false)}><IconX size={10} /></button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {filteredOrgs.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrgs.map((org) => (
                    <OrgCard key={org.slug} org={org} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-text-secondary font-medium">Aucune organisation trouvée</p>
                  <p className="text-text-tertiary text-sm mt-1">Essayez de modifier vos filtres</p>
                  <button className="btn-secondary mt-4" onClick={resetOrgFilters}>Réinitialiser</button>
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
