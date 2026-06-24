'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  IconCircleCheck, IconMapPin, IconWorld, IconUsers,
  IconBriefcase, IconCalendar, IconArrowUpRight,
  IconBrandWhatsapp, IconMail, IconSchool, IconClock,
  IconBuilding, IconChevronRight, IconSearch,
} from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import { CURRENT_USER } from '@/lib/mock-data'

const EMPLOYER = {
  slug: 'orange-digital-center',
  name: 'Orange Digital Center',
  initials: 'OD',
  tagline: 'Inclusion numérique & entrepreneuriat · Orange',
  city: 'Dakar', country: 'Sénégal',
  website: 'orangedigitalcenters.com',
  websiteUrl: 'https://orangedigitalcenters.com',
  email: 'odc.dakar@orange.com',
  verified: true,
  sector: 'Tech & Formation',
  size: '200–1000 employés',
}

const COLLEAGUES = [
  { id: 'c1', initials: 'KF', name: 'Khadija Fall',  title: 'UX Designer',    city: 'Dakar', verified: true,  slug: 'khadija-fall'  },
  { id: 'c2', initials: 'MD', name: 'Moussa Dieng',  title: 'DevOps Engineer', city: 'Dakar', verified: true,  slug: 'moussa-dieng'  },
  { id: 'c3', initials: 'AS', name: 'Aïssatou Sarr', title: 'Product Manager', city: 'Dakar', verified: false, slug: 'aissatou-sarr' },
  { id: 'c4', initials: 'IS', name: 'Ibrahima Sow',  title: 'CTO',             city: 'Dakar', verified: true,  slug: 'ibrahima-sow'  },
]

const EMPLOYER_OFFERS = [
  {
    id: 'o1', title: 'Formateur / Facilitateur Tech',
    location: 'Dakar, Sénégal', type: 'CDD', posted: 'Il y a 3 jours',
    description: 'Animer des formations en développement web et mobile auprès de jeunes talents africains.',
  },
  {
    id: 'o2', title: 'Responsable Communication Digitale',
    location: 'Dakar, Sénégal', type: 'CDI', posted: 'Il y a 8 jours',
    description: 'Développer la présence en ligne de l\'ODC Dakar sur les réseaux sociaux.',
  },
]

const SCHOOLS = [
  {
    id: 'sch1', slug: 'ecole-polytechnique-thies',
    name: 'École Polytechnique de Thiès', initials: 'EP',
    type: 'Grande école d\'ingénieurs',
    city: 'Thiès', country: 'Sénégal',
    website: 'ept.sn', websiteUrl: 'https://www.ept.sn',
    verified: true, founded: '1973',
    myDegree: 'Master en Génie Informatique',
    myPeriod: '2015 — 2017',
    verificationStatus: 'en_attente' as const,
    alumni: [
      { id: 'a1', initials: 'OD', name: 'Oumar Diallo',    title: 'Data Engineer',    city: 'Dakar',  verified: true,  slug: 'oumar-diallo'    },
      { id: 'a2', initials: 'FS', name: 'Fatou Sy',        title: 'Backend Dev',      city: 'Paris',  verified: true,  slug: 'fatou-sy'        },
      { id: 'a3', initials: 'BN', name: 'Boubacar Ndiaye', title: 'Ingénieur Réseau', city: 'Thiès',  verified: false, slug: 'boubacar-ndiaye' },
    ],
  },
  {
    id: 'sch2', slug: 'universite-cheikh-anta-diop',
    name: 'Université Cheikh Anta Diop', initials: 'UC',
    type: 'Université publique',
    city: 'Dakar', country: 'Sénégal',
    website: 'ucad.edu.sn', websiteUrl: 'https://www.ucad.edu.sn',
    verified: true, founded: '1957',
    myDegree: 'Licence en Informatique',
    myPeriod: '2012 — 2015',
    verificationStatus: 'confirmée' as const,
    alumni: [
      { id: 'a4', initials: 'MC', name: 'Mamadou Camara', title: 'Dev Mobile',    city: 'Dakar',   verified: true, slug: 'mamadou-camara' },
      { id: 'a5', initials: 'AB', name: 'Aminata Ba',     title: 'Data Scientist', city: 'Abidjan', verified: true, slug: 'aminata-ba'     },
    ],
  },
]

const VERIF = {
  confirmée:    { label: 'Diplôme vérifié',         icon: IconCircleCheck, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  en_attente:   { label: 'Vérification en attente', icon: IconClock,       color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  rejetée:      { label: 'Vérification rejetée',    icon: IconCircleCheck, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  non_demandée: { label: 'Non vérifié',              icon: IconCircleCheck, color: '#9CA3AF', bg: '#F9FAFB', border: '#E5E7EB' },
}

export default function DashboardOrgPage() {
  const [tab, setTab] = useState<'entreprise' | 'formation'>('entreprise')
  const [selectedSchool, setSelectedSchool] = useState(SCHOOLS[0].id)
  const [colleagueSearch, setColleagueSearch] = useState('')
  const [alumniSearch, setAlumniSearch] = useState('')
  const myRole = CURRENT_USER.experiences.find(e => e.current)
  const school = SCHOOLS.find(s => s.id === selectedSchool)!
  const v = VERIF[school.verificationStatus]
  const VIcon = v.icon

  const filteredColleagues = COLLEAGUES.filter(c =>
    !colleagueSearch ||
    c.name.toLowerCase().includes(colleagueSearch.toLowerCase()) ||
    c.title.toLowerCase().includes(colleagueSearch.toLowerCase()) ||
    c.city.toLowerCase().includes(colleagueSearch.toLowerCase())
  )

  const filteredAlumni = school.alumni.filter(a =>
    !alumniSearch ||
    a.name.toLowerCase().includes(alumniSearch.toLowerCase()) ||
    a.title.toLowerCase().includes(alumniSearch.toLowerCase()) ||
    a.city.toLowerCase().includes(alumniSearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-2xl mx-auto px-5 py-6 lg:px-8 lg:py-8">

          {/* ── PAGE HEADER ── */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-text-primary">Mes organisations</h1>
            <p className="text-sm text-text-secondary mt-1">Entreprise et établissements de formation</p>
          </div>

          {/* ── TABS ── */}
          <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-xl mb-7">
            <button
              onClick={() => setTab('entreprise')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === 'entreprise'
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <IconBuilding size={15} />
              Entreprise
            </button>
            <button
              onClick={() => setTab('formation')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === 'formation'
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <IconSchool size={15} />
              Formation
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-badge ${tab === 'formation' ? 'bg-primary-light text-primary' : 'bg-[#E5E7EB] text-text-tertiary'}`}>
                {SCHOOLS.length}
              </span>
            </button>
          </div>

          {/* ══════════════════════════
              TAB ENTREPRISE
          ══════════════════════════ */}
          {tab === 'entreprise' && (
            <div className="space-y-5">

              {/* Org card */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB]">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-[52px] h-[52px] rounded-2xl bg-[#0C0A18] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-extrabold text-white tracking-tight">{EMPLOYER.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base font-bold text-text-primary">{EMPLOYER.name}</h2>
                            {EMPLOYER.verified && <IconCircleCheck size={15} className="text-success flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5">{EMPLOYER.tagline}</p>
                        </div>
                        <Link
                          href={`/org/${EMPLOYER.slug}`}
                          target="_blank"
                          className="text-xs font-medium text-text-tertiary hover:text-primary flex items-center gap-1 flex-shrink-0 transition-colors"
                        >
                          Page publique <IconChevronRight size={12} />
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="text-xs text-text-tertiary flex items-center gap-1"><IconMapPin size={11} />{EMPLOYER.city}, {EMPLOYER.country}</span>
                        <span className="text-xs text-text-tertiary flex items-center gap-1"><IconUsers size={11} />{EMPLOYER.size}</span>
                        <a href={EMPLOYER.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">
                          <IconWorld size={11} />{EMPLOYER.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mon poste */}
                {myRole && (
                  <div className="mx-5 mb-5 px-4 py-3 bg-primary-light rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconBriefcase size={15} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-primary">{myRole.title}</p>
                      <p className="text-xs text-primary/60 mt-0.5">Poste actuel · depuis 2022</p>
                    </div>
                    {myRole.verificationStatus === 'confirmée' && (
                      <span className="text-[10px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-2 py-0.5 rounded-badge flex items-center gap-1 flex-shrink-0">
                        <IconCircleCheck size={10} /> Vérifié
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Collègues */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB]">
                <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary">Collègues sur bcarte</h3>
                  <span className="text-xs text-text-tertiary">
                    {filteredColleagues.length}/{COLLEAGUES.length}
                  </span>
                </div>
                <div className="px-5 pb-3">
                  <div className="relative mb-3">
                    <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                      className="w-full pl-8 pr-3 py-2 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-primary focus:bg-white transition-colors placeholder:text-text-tertiary"
                      placeholder="Nom, poste, ville..."
                      value={colleagueSearch}
                      onChange={e => setColleagueSearch(e.target.value)}
                    />
                  </div>
                  {filteredColleagues.length === 0 ? (
                    <p className="text-sm text-text-tertiary text-center py-4">Aucun collègue trouvé</p>
                  ) : (
                    filteredColleagues.map(c => (
                      <div key={c.id} className="flex items-center gap-3 py-3 border-b border-[#F3F4F6] last:border-0">
                        <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {c.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-text-primary">{c.name}</span>
                            {c.verified && <IconCircleCheck size={12} className="text-success flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-text-tertiary">{c.title}</p>
                        </div>
                        <Link
                          href={`/p/${c.slug}`}
                          className="text-xs font-medium text-text-tertiary hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          Voir <IconArrowUpRight size={13} />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Offres */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB]">
                <div className="px-5 pt-5 pb-1 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary">Offres d&apos;emploi</h3>
                  <span className="text-xs text-text-tertiary">{EMPLOYER_OFFERS.length} actives</span>
                </div>
                <div className="px-5 pb-4">
                  {EMPLOYER_OFFERS.map((offer, i) => (
                    <div key={offer.id} className={`py-4 ${i < EMPLOYER_OFFERS.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-text-primary leading-snug">{offer.title}</p>
                        <span className="text-[11px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-badge flex-shrink-0">{offer.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-tertiary mb-2">
                        <span className="flex items-center gap-1"><IconMapPin size={11} />{offer.location}</span>
                        <span>{offer.posted}</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed mb-3">{offer.description}</p>
                      <div className="flex gap-2">
                        <a
                          href={`mailto:${EMPLOYER.email}?subject=Candidature — ${offer.title}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary bg-[#F3F4F6] hover:bg-primary-light hover:text-primary px-3 py-2 rounded-lg transition-colors"
                        >
                          <IconMail size={12} /> Partager par email
                        </a>
                        <a
                          href={`https://wa.me/?text=Offre : ${offer.title} — ${EMPLOYER.name}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-whatsapp bg-[#ECFDF5] hover:bg-[#D1FAE5] px-3 py-2 rounded-lg transition-colors"
                        >
                          <IconBrandWhatsapp size={12} /> WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════
              TAB FORMATION
          ══════════════════════════ */}
          {tab === 'formation' && (
            <div className="space-y-5">

              {/* School selector */}
              <div className="flex gap-2">
                {SCHOOLS.map(s => {
                  const sv = VERIF[s.verificationStatus]
                  return (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedSchool(s.id); setAlumniSearch('') }}
                      className={`flex-1 p-3.5 rounded-xl border text-left transition-all ${
                        selectedSchool === s.id
                          ? 'border-primary bg-white shadow-sm'
                          : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedSchool === s.id ? 'bg-primary-light' : 'bg-[#F3F4F6]'}`}>
                          <span className={`text-xs font-extrabold ${selectedSchool === s.id ? 'text-primary' : 'text-text-secondary'}`}>{s.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-text-primary leading-tight truncate">{s.name}</p>
                        </div>
                      </div>
                      <p className={`text-[10px] font-semibold px-2 py-0.5 rounded-badge inline-flex items-center gap-1`} style={{ color: sv.color, backgroundColor: sv.bg, border: `1px solid ${sv.border}` }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4" /></svg>
                        {sv.label}
                      </p>
                    </button>
                  )
                })}
              </div>

              {/* School detail */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB]">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-[52px] h-[52px] rounded-2xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-extrabold text-text-secondary tracking-tight">{school.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base font-bold text-text-primary">{school.name}</h2>
                            {school.verified && <IconCircleCheck size={15} className="text-success flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5">{school.type}</p>
                        </div>
                        <Link
                          href={`/org/${school.slug}`}
                          target="_blank"
                          className="text-xs font-medium text-text-tertiary hover:text-primary flex items-center gap-1 flex-shrink-0 transition-colors"
                        >
                          Page publique <IconChevronRight size={12} />
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="text-xs text-text-tertiary flex items-center gap-1"><IconMapPin size={11} />{school.city}, {school.country}</span>
                        <span className="text-xs text-text-tertiary flex items-center gap-1"><IconCalendar size={11} />Fondée en {school.founded}</span>
                        <a href={school.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">
                          <IconWorld size={11} />{school.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mon diplôme */}
                <div
                  className="mx-5 mb-5 px-4 py-3 rounded-xl flex items-center gap-3"
                  style={{ backgroundColor: v.bg, border: `1px solid ${v.border}` }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${v.color}18` }}>
                    <IconSchool size={15} style={{ color: v.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: v.color }}>{school.myDegree}</p>
                    <p className="text-xs mt-0.5 opacity-70" style={{ color: v.color }}>{school.myPeriod}</p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-1 rounded-badge flex items-center gap-1 flex-shrink-0"
                    style={{ color: v.color, backgroundColor: `${v.color}18`, border: `1px solid ${v.border}` }}
                  >
                    <VIcon size={10} />{v.label}
                  </span>
                </div>
              </div>

              {/* Alumni */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB]">
                <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary">Anciens étudiants sur bcarte</h3>
                  <span className="text-xs text-text-tertiary">
                    {filteredAlumni.length}/{school.alumni.length}
                  </span>
                </div>
                <div className="px-5 pb-3">
                  <div className="relative mb-3">
                    <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                      className="w-full pl-8 pr-3 py-2 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-primary focus:bg-white transition-colors placeholder:text-text-tertiary"
                      placeholder="Nom, poste, ville..."
                      value={alumniSearch}
                      onChange={e => setAlumniSearch(e.target.value)}
                    />
                  </div>
                  {filteredAlumni.length === 0 ? (
                    <p className="text-sm text-text-tertiary text-center py-4">Aucun résultat trouvé</p>
                  ) : (
                    filteredAlumni.map(a => (
                      <div key={a.id} className="flex items-center gap-3 py-3 border-b border-[#F3F4F6] last:border-0">
                        <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-text-secondary font-bold text-sm flex-shrink-0">
                          {a.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-text-primary">{a.name}</span>
                            {a.verified && <IconCircleCheck size={12} className="text-success flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-text-tertiary">{a.title} · {a.city}</p>
                        </div>
                        <Link
                          href={`/p/${a.slug}`}
                          className="text-xs font-medium text-text-tertiary hover:text-primary flex items-center gap-1 transition-colors"
                        >
                          Voir <IconArrowUpRight size={13} />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
      <BottomNav />
    </div>
  )
}
