'use client'

import Link from 'next/link'
import {
  IconCircleCheck, IconMapPin, IconWorld, IconUsers,
  IconBriefcase, IconStack2, IconCalendar,
  IconLock, IconArrowUpRight, IconBrandWhatsapp, IconMail,
  IconSchool, IconClock,
} from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import { CURRENT_USER } from '@/lib/mock-data'

const EMPLOYER = {
  slug: 'orange-digital-center',
  name: 'Orange Digital Center',
  initials: 'OD',
  tagline: 'Programme d\'inclusion numérique et d\'entrepreneuriat d\'Orange',
  description: 'Orange Digital Center (ODC) est un espace d\'innovation et de formation aux métiers du numérique. Présent dans 17 pays en Afrique et Moyen-Orient, l\'ODC forme et accompagne les talents tech de demain.',
  city: 'Dakar',
  country: 'Sénégal',
  website: 'orangedigitalcenters.com',
  websiteUrl: 'https://orangedigitalcenters.com',
  email: 'odc.dakar@orange.com',
  verified: true,
  sector: 'Technologie & Formation',
  size: '200–1000 employés',
  founded: '2020',
}

const COLLEAGUES = [
  { id: 'c1', initials: 'KF', name: 'Khadija Fall', title: 'UX Designer', city: 'Dakar', verified: true, slug: 'khadija-fall' },
  { id: 'c2', initials: 'MD', name: 'Moussa Dieng', title: 'DevOps Engineer', city: 'Dakar', verified: true, slug: 'moussa-dieng' },
  { id: 'c3', initials: 'AS', name: 'Aïssatou Sarr', title: 'Product Manager', city: 'Dakar', verified: false, slug: 'aissatou-sarr' },
  { id: 'c4', initials: 'IS', name: 'Ibrahima Sow', title: 'CTO', city: 'Dakar', verified: true, slug: 'ibrahima-sow' },
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

// Établissements de formation liés aux diplômes du profil
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
    // lié à ed1 du CURRENT_USER
    myDegree: 'Master en Génie Informatique',
    myPeriod: '2015 — 2017',
    verificationStatus: 'en_attente' as const,
    alumni: [
      { id: 'a1', initials: 'OD', name: 'Oumar Diallo', title: 'Data Engineer', city: 'Dakar', verified: true, slug: 'oumar-diallo' },
      { id: 'a2', initials: 'FS', name: 'Fatou Sy', title: 'Backend Developer', city: 'Paris', verified: true, slug: 'fatou-sy' },
      { id: 'a3', initials: 'BN', name: 'Boubacar Ndiaye', title: 'Ingénieur Réseau', city: 'Thiès', verified: false, slug: 'boubacar-ndiaye' },
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
    // lié à ed2 du CURRENT_USER
    myDegree: 'Licence en Informatique',
    myPeriod: '2012 — 2015',
    verificationStatus: 'confirmée' as const,
    alumni: [
      { id: 'a4', initials: 'MC', name: 'Mamadou Camara', title: 'Développeur Mobile', city: 'Dakar', verified: true, slug: 'mamadou-camara' },
      { id: 'a5', initials: 'AB', name: 'Aminata Ba', title: 'Data Scientist', city: 'Abidjan', verified: true, slug: 'aminata-ba' },
    ],
  },
]

const VERIF_STATUS = {
  confirmée:    { label: 'Diplôme vérifié', cls: 'text-success bg-success-light border-[#A7F3D0]', icon: IconCircleCheck },
  en_attente:   { label: 'Vérification en attente', cls: 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A]', icon: IconClock },
  rejetée:      { label: 'Vérification rejetée', cls: 'text-danger bg-red-50 border-red-200', icon: IconCircleCheck },
  non_demandée: { label: 'Non vérifié', cls: 'text-text-tertiary bg-[#F3F4F6] border-[#E5E7EB]', icon: IconCircleCheck },
}

export default function DashboardOrgPage() {
  const myRole = CURRENT_USER.experiences.find(e => e.current)

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-2xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-10">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Mes organisations</h1>
            <p className="text-text-secondary text-sm mt-1">Votre entreprise et vos établissements de formation</p>
          </div>

          {/* ── EMPLOYEUR ACTUEL ── */}
          <section className="space-y-4">
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em]">Employeur actuel</p>

            <div className="card space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0C0A18] flex items-center justify-center flex-shrink-0">
                  <span className="text-base font-extrabold text-white">{EMPLOYER.initials}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[15px] font-bold text-text-primary">{EMPLOYER.name}</h2>
                    {EMPLOYER.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-2 py-0.5 rounded-badge">
                        <IconCircleCheck size={11} /> Vérifiée
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{EMPLOYER.tagline}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                    <span className="text-xs text-text-tertiary flex items-center gap-1.5"><IconMapPin size={12} />{EMPLOYER.city}, {EMPLOYER.country}</span>
                    <span className="text-xs text-text-tertiary flex items-center gap-1.5"><IconStack2 size={12} />{EMPLOYER.sector}</span>
                    <span className="text-xs text-text-tertiary flex items-center gap-1.5"><IconUsers size={12} />{EMPLOYER.size}</span>
                    <a href={EMPLOYER.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1.5 hover:underline">
                      <IconWorld size={12} />{EMPLOYER.website}
                    </a>
                  </div>
                </div>
              </div>

              {myRole && (
                <div className="flex items-center gap-3 px-4 py-3 bg-primary-light rounded-xl">
                  <IconBriefcase size={15} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-primary">{myRole.title}</p>
                    <p className="text-xs text-primary/70">
                      Poste actuel · {myRole.verificationStatus === 'confirmée' ? 'Expérience vérifiée' : 'Vérification non demandée'}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-text-tertiary">
                <IconLock size={13} className="flex-shrink-0 mt-0.5" />
                <p>
                  Profil en lecture seule.{' '}
                  <Link href={`/org/${EMPLOYER.slug}`} className="text-primary hover:underline font-medium">Voir la page publique →</Link>
                </p>
              </div>
            </div>

            {/* Colleagues */}
            <div className="card space-y-1">
              <p className="text-xs font-semibold text-text-secondary mb-3 flex items-center gap-2">
                <IconUsers size={14} className="text-primary" />
                Collègues sur bcarte
              </p>
              {COLLEAGUES.map(c => (
                <div key={c.id} className="flex items-center gap-3 py-2.5 border-b border-[#F3F4F6] last:border-0">
                  <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">{c.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-text-primary">{c.name}</p>
                      {c.verified && <IconCircleCheck size={13} className="text-success flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-text-tertiary">{c.title} · {c.city}</p>
                  </div>
                  <Link href={`/p/${c.slug}`} className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-primary-light flex items-center justify-center text-text-tertiary hover:text-primary transition-colors flex-shrink-0">
                    <IconArrowUpRight size={14} />
                  </Link>
                </div>
              ))}
            </div>

            {/* Offers */}
            {EMPLOYER_OFFERS.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-text-secondary flex items-center gap-2">
                  <IconBriefcase size={14} className="text-primary" />
                  Offres de l&apos;organisation
                </p>
                {EMPLOYER_OFFERS.map(offer => (
                  <div key={offer.id} className="card">
                    <p className="font-semibold text-text-primary text-sm">{offer.title}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs text-text-tertiary flex items-center gap-1"><IconMapPin size={11} />{offer.location}</span>
                      <span className="text-[#E5E7EB]">·</span>
                      <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-badge">{offer.type}</span>
                      <span className="text-[#E5E7EB]">·</span>
                      <span className="text-xs text-text-tertiary">{offer.posted}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">{offer.description}</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F3F4F6]">
                      <span className="text-xs text-text-tertiary">Partager :</span>
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
            )}
          </section>

          {/* ── ÉTABLISSEMENTS DE FORMATION ── */}
          <section className="space-y-5">
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em]">Établissements de formation</p>

            {SCHOOLS.map(school => {
              const verif = VERIF_STATUS[school.verificationStatus]
              const VerifIcon = verif.icon
              return (
                <div key={school.id} className="space-y-3">
                  <div className="card space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                        <span className="text-base font-extrabold text-text-secondary">{school.initials}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-[15px] font-bold text-text-primary">{school.name}</h2>
                          {school.verified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-2 py-0.5 rounded-badge">
                              <IconCircleCheck size={11} /> Vérifiée
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mt-0.5">{school.type}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                          <span className="text-xs text-text-tertiary flex items-center gap-1.5"><IconMapPin size={12} />{school.city}, {school.country}</span>
                          <span className="text-xs text-text-tertiary flex items-center gap-1.5"><IconCalendar size={12} />Fondée en {school.founded}</span>
                          <a href={school.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1.5 hover:underline">
                            <IconWorld size={12} />{school.website}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* My diploma */}
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${verif.cls}`}>
                      <IconSchool size={15} className="flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{school.myDegree}</p>
                        <p className="text-xs opacity-80 mt-0.5">{school.myPeriod}</p>
                      </div>
                      <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-badge border ${verif.cls}`}>
                        <VerifIcon size={11} />{verif.label}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-text-tertiary">
                      <IconLock size={13} className="flex-shrink-0 mt-0.5" />
                      <p>
                        Profil en lecture seule.{' '}
                        <Link href={`/org/${school.slug}`} className="text-primary hover:underline font-medium">Voir la page publique →</Link>
                      </p>
                    </div>
                  </div>

                  {/* Alumni */}
                  <div className="card space-y-1">
                    <p className="text-xs font-semibold text-text-secondary mb-3 flex items-center gap-2">
                      <IconUsers size={14} className="text-primary" />
                      Anciens étudiants sur bcarte
                    </p>
                    {school.alumni.map(a => (
                      <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-[#F3F4F6] last:border-0">
                        <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-text-secondary font-bold text-sm flex-shrink-0">{a.initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-text-primary">{a.name}</p>
                            {a.verified && <IconCircleCheck size={13} className="text-success flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-text-tertiary">{a.title} · {a.city}</p>
                        </div>
                        <Link href={`/p/${a.slug}`} className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-primary-light flex items-center justify-center text-text-tertiary hover:text-primary transition-colors flex-shrink-0">
                          <IconArrowUpRight size={14} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </section>

        </div>
      </main>
      <BottomNav />
    </div>
  )
}
