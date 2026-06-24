'use client'

import Link from 'next/link'
import {
  IconCircleCheck, IconMapPin, IconWorld, IconUsers,
  IconBriefcase, IconStack2, IconCalendar,
  IconArrowUpRight, IconBrandWhatsapp, IconMail,
  IconSchool, IconClock, IconExternalLink,
} from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import { CURRENT_USER } from '@/lib/mock-data'

const EMPLOYER = {
  slug: 'orange-digital-center',
  name: 'Orange Digital Center',
  initials: 'OD',
  tagline: 'Programme d\'inclusion numérique et d\'entrepreneuriat d\'Orange',
  city: 'Dakar',
  country: 'Sénégal',
  website: 'orangedigitalcenters.com',
  websiteUrl: 'https://orangedigitalcenters.com',
  email: 'odc.dakar@orange.com',
  verified: true,
  sector: 'Technologie & Formation',
  size: '200–1000 employés',
}

const COLLEAGUES = [
  { id: 'c1', initials: 'KF', name: 'Khadija Fall',    title: 'UX Designer',      city: 'Dakar', verified: true,  slug: 'khadija-fall'  },
  { id: 'c2', initials: 'MD', name: 'Moussa Dieng',    title: 'DevOps Engineer',   city: 'Dakar', verified: true,  slug: 'moussa-dieng'  },
  { id: 'c3', initials: 'AS', name: 'Aïssatou Sarr',   title: 'Product Manager',   city: 'Dakar', verified: false, slug: 'aissatou-sarr' },
  { id: 'c4', initials: 'IS', name: 'Ibrahima Sow',    title: 'CTO',               city: 'Dakar', verified: true,  slug: 'ibrahima-sow'  },
]

const EMPLOYER_OFFERS = [
  {
    id: 'o1',
    title: 'Formateur / Facilitateur Tech',
    location: 'Dakar, Sénégal',
    type: 'CDD',
    posted: 'Il y a 3 jours',
    description: 'Animer des formations en développement web et mobile auprès de jeunes talents africains.',
  },
  {
    id: 'o2',
    title: 'Responsable Communication Digitale',
    location: 'Dakar, Sénégal',
    type: 'CDI',
    posted: 'Il y a 8 jours',
    description: 'Développer la présence en ligne de l\'ODC Dakar sur les réseaux sociaux et plateformes numériques.',
  },
]

const SCHOOLS = [
  {
    id: 'sch1',
    slug: 'ecole-polytechnique-thies',
    name: 'École Polytechnique de Thiès',
    initials: 'EP',
    type: 'Grande école d\'ingénieurs',
    city: 'Thiès',
    country: 'Sénégal',
    website: 'ept.sn',
    websiteUrl: 'https://www.ept.sn',
    verified: true,
    founded: '1973',
    myDegree: 'Master en Génie Informatique',
    myPeriod: '2015 — 2017',
    verificationStatus: 'en_attente' as const,
    alumni: [
      { id: 'a1', initials: 'OD', name: 'Oumar Diallo',    title: 'Data Engineer',    city: 'Dakar',  verified: true,  slug: 'oumar-diallo'   },
      { id: 'a2', initials: 'FS', name: 'Fatou Sy',        title: 'Backend Developer',city: 'Paris',  verified: true,  slug: 'fatou-sy'       },
      { id: 'a3', initials: 'BN', name: 'Boubacar Ndiaye', title: 'Ingénieur Réseau', city: 'Thiès',  verified: false, slug: 'boubacar-ndiaye'},
    ],
  },
  {
    id: 'sch2',
    slug: 'universite-cheikh-anta-diop',
    name: 'Université Cheikh Anta Diop',
    initials: 'UC',
    type: 'Université publique',
    city: 'Dakar',
    country: 'Sénégal',
    website: 'ucad.edu.sn',
    websiteUrl: 'https://www.ucad.edu.sn',
    verified: true,
    founded: '1957',
    myDegree: 'Licence en Informatique',
    myPeriod: '2012 — 2015',
    verificationStatus: 'confirmée' as const,
    alumni: [
      { id: 'a4', initials: 'MC', name: 'Mamadou Camara', title: 'Développeur Mobile', city: 'Dakar',   verified: true, slug: 'mamadou-camara' },
      { id: 'a5', initials: 'AB', name: 'Aminata Ba',     title: 'Data Scientist',     city: 'Abidjan', verified: true, slug: 'aminata-ba'     },
    ],
  },
]

const VERIF_BADGE = {
  confirmée:    { label: 'Diplôme vérifié',        bg: 'bg-success-light',  text: 'text-success',     border: 'border-[#A7F3D0]', icon: IconCircleCheck },
  en_attente:   { label: 'Vérification en attente',bg: 'bg-[#FFFBEB]',      text: 'text-[#D97706]',   border: 'border-[#FDE68A]', icon: IconClock       },
  rejetée:      { label: 'Vérification rejetée',   bg: 'bg-red-50',         text: 'text-danger',      border: 'border-red-200',   icon: IconCircleCheck },
  non_demandée: { label: 'Non vérifié',             bg: 'bg-[#F3F4F6]',      text: 'text-text-tertiary',border: 'border-[#E5E7EB]',icon: IconCircleCheck },
}

function PersonRow({ initials, name, title, city, verified, slug, avatarBg = 'bg-primary-light', avatarText = 'text-primary' }: {
  initials: string; name: string; title: string; city: string
  verified: boolean; slug: string; avatarBg?: string; avatarText?: string
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#F3F4F6] last:border-0">
      <div className={`w-9 h-9 rounded-xl ${avatarBg} flex items-center justify-center ${avatarText} font-bold text-sm flex-shrink-0`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-text-primary leading-tight">{name}</p>
          {verified && <IconCircleCheck size={13} className="text-success flex-shrink-0" />}
        </div>
        <p className="text-xs text-text-tertiary mt-0.5">{title} · {city}</p>
      </div>
      <Link
        href={`/p/${slug}`}
        className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-primary-light flex items-center justify-center text-text-tertiary hover:text-primary transition-colors flex-shrink-0"
        aria-label={`Voir le profil de ${name}`}
      >
        <IconArrowUpRight size={14} />
      </Link>
    </div>
  )
}

export default function DashboardOrgPage() {
  const myRole = CURRENT_USER.experiences.find(e => e.current)

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-2xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-8">

          {/* ── PAGE HEADER ── */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Mes organisations</h1>
            <p className="text-sm text-text-secondary mt-1">Entreprise et établissements de formation</p>
          </div>

          {/* ══════════════════════════════
              EMPLOYEUR ACTUEL
          ══════════════════════════════ */}
          <section>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] mb-4">
              Employeur actuel
            </p>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">

              {/* Org header */}
              <div className="p-5 border-b border-[#F3F4F6]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0C0A18] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-extrabold text-white tracking-tight">{EMPLOYER.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-text-primary">{EMPLOYER.name}</h2>
                      {EMPLOYER.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-1.5 py-0.5 rounded-badge">
                          <IconCircleCheck size={10} /> Vérifiée
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{EMPLOYER.tagline}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                      <span className="text-xs text-text-tertiary flex items-center gap-1"><IconMapPin size={11} />{EMPLOYER.city}, {EMPLOYER.country}</span>
                      <span className="text-xs text-text-tertiary flex items-center gap-1"><IconStack2 size={11} />{EMPLOYER.sector}</span>
                      <span className="text-xs text-text-tertiary flex items-center gap-1"><IconUsers size={11} />{EMPLOYER.size}</span>
                      <a href={EMPLOYER.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">
                        <IconWorld size={11} />{EMPLOYER.website}
                      </a>
                    </div>
                  </div>
                  <Link href={`/org/${EMPLOYER.slug}`} target="_blank" className="flex-shrink-0 text-text-tertiary hover:text-primary transition-colors" aria-label="Voir la page publique">
                    <IconExternalLink size={15} />
                  </Link>
                </div>
              </div>

              {/* My role */}
              {myRole && (
                <div className="px-5 py-3.5 bg-primary-light/60 border-b border-[#E8E4FF] flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconBriefcase size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary leading-tight">{myRole.title}</p>
                    <p className="text-xs text-primary/60 mt-0.5">
                      Poste actuel · {myRole.verificationStatus === 'confirmée' ? 'Expérience vérifiée' : 'En attente de vérification'}
                    </p>
                  </div>
                  {myRole.verificationStatus === 'confirmée' && (
                    <IconCircleCheck size={16} className="text-success flex-shrink-0" />
                  )}
                </div>
              )}

              {/* Colleagues */}
              <div className="px-5 pt-4 pb-1">
                <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.08em] mb-1">
                  Collègues sur bcarte · {COLLEAGUES.length}
                </p>
                {COLLEAGUES.map(c => (
                  <PersonRow key={c.id} {...c} avatarBg="bg-primary-light" avatarText="text-primary" />
                ))}
              </div>

              {/* Offers */}
              {EMPLOYER_OFFERS.length > 0 && (
                <div className="px-5 pt-4 pb-5 border-t border-[#F3F4F6] mt-2">
                  <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.08em] mb-3">
                    Offres publiées · {EMPLOYER_OFFERS.length}
                  </p>
                  <div className="space-y-3">
                    {EMPLOYER_OFFERS.map(offer => (
                      <div key={offer.id} className="rounded-xl border border-[#F3F4F6] hover:border-[#E5E7EB] p-4 transition-colors">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary leading-tight">{offer.title}</p>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="text-xs text-text-tertiary flex items-center gap-1"><IconMapPin size={11} />{offer.location}</span>
                              <span className="text-[#E5E7EB]">·</span>
                              <span className="text-[11px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-badge">{offer.type}</span>
                              <span className="text-[#E5E7EB]">·</span>
                              <span className="text-xs text-text-tertiary">{offer.posted}</span>
                            </div>
                            <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{offer.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F3F4F6]">
                          <span className="text-[11px] text-text-tertiary mr-1">Partager :</span>
                          <a href={`mailto:${EMPLOYER.email}?subject=Candidature — ${offer.title}`} className="flex items-center gap-1 text-xs font-semibold text-text-secondary bg-[#F3F4F6] hover:bg-primary-light hover:text-primary px-2.5 py-1.5 rounded-lg transition-colors">
                            <IconMail size={12} /> Email
                          </a>
                          <a href={`https://wa.me/?text=Offre : ${offer.title} — ${EMPLOYER.name}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-semibold text-whatsapp bg-[#ECFDF5] hover:bg-[#D1FAE5] px-2.5 py-1.5 rounded-lg transition-colors">
                            <IconBrandWhatsapp size={12} /> WhatsApp
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ══════════════════════════════
              ÉTABLISSEMENTS DE FORMATION
          ══════════════════════════════ */}
          <section>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] mb-4">
              Établissements de formation
            </p>

            <div className="space-y-4">
              {SCHOOLS.map(school => {
                const v = VERIF_BADGE[school.verificationStatus]
                const VIcon = v.icon
                return (
                  <div key={school.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">

                    {/* School header */}
                    <div className="p-5 border-b border-[#F3F4F6]">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-extrabold text-text-secondary tracking-tight">{school.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base font-bold text-text-primary">{school.name}</h2>
                            {school.verified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-1.5 py-0.5 rounded-badge">
                                <IconCircleCheck size={10} /> Vérifiée
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary mt-0.5">{school.type}</p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                            <span className="text-xs text-text-tertiary flex items-center gap-1"><IconMapPin size={11} />{school.city}, {school.country}</span>
                            <span className="text-xs text-text-tertiary flex items-center gap-1"><IconCalendar size={11} />Fondée en {school.founded}</span>
                            <a href={school.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">
                              <IconWorld size={11} />{school.website}
                            </a>
                          </div>
                        </div>
                        <Link href={`/org/${school.slug}`} target="_blank" className="flex-shrink-0 text-text-tertiary hover:text-primary transition-colors" aria-label="Voir la page publique">
                          <IconExternalLink size={15} />
                        </Link>
                      </div>
                    </div>

                    {/* My diploma */}
                    <div className={`px-5 py-3.5 border-b border-[#F3F4F6] flex items-center gap-3 ${v.bg}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${v.bg} border ${v.border}`}>
                        <IconSchool size={14} className={v.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${v.text} leading-tight`}>{school.myDegree}</p>
                        <p className={`text-xs mt-0.5 opacity-70 ${v.text}`}>{school.myPeriod}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-badge border flex-shrink-0 ${v.bg} ${v.text} ${v.border}`}>
                        <VIcon size={10} />{v.label}
                      </span>
                    </div>

                    {/* Alumni */}
                    <div className="px-5 pt-4 pb-1">
                      <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.08em] mb-1">
                        Anciens étudiants sur bcarte · {school.alumni.length}
                      </p>
                      {school.alumni.map(a => (
                        <PersonRow key={a.id} {...a} avatarBg="bg-[#F3F4F6]" avatarText="text-text-secondary" />
                      ))}
                    </div>

                    {/* Padding bottom */}
                    <div className="pb-3" />
                  </div>
                )
              })}
            </div>
          </section>

        </div>
      </main>
      <BottomNav />
    </div>
  )
}
