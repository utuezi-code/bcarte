'use client'

import Link from 'next/link'
import {
  IconCircleCheck, IconMapPin, IconWorld, IconUsers,
  IconBriefcase, IconStack2, IconCalendar, IconExternalLink,
  IconLock, IconArrowUpRight, IconBrandWhatsapp, IconMail,
} from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import { CURRENT_USER } from '@/lib/mock-data'

// Organisation liée au professionnel connecté (déduite de son expérience actuelle)
const MY_ORG = {
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

// Collègues ayant un profil bcarte dans la même organisation
const COLLEAGUES = [
  { id: 'c1', initials: 'KF', name: 'Khadija Fall', title: 'UX Designer', city: 'Dakar', verified: true, slug: 'khadija-fall' },
  { id: 'c2', initials: 'MD', name: 'Moussa Dieng', title: 'DevOps Engineer', city: 'Dakar', verified: true, slug: 'moussa-dieng' },
  { id: 'c3', initials: 'AS', name: 'Aïssatou Sarr', title: 'Product Manager', city: 'Dakar', verified: false, slug: 'aissatou-sarr' },
  { id: 'c4', initials: 'IS', name: 'Ibrahima Sow', title: 'CTO', city: 'Dakar', verified: true, slug: 'ibrahima-sow' },
]

// Offres actives publiées par l'organisation
const ORG_OFFERS = [
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

export default function DashboardOrgPage() {
  const myRole = CURRENT_USER.experiences.find(e => e.current)

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-2xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Mon organisation</h1>
            <p className="text-text-secondary text-sm mt-1">
              Votre entreprise actuelle sur bcarte
            </p>
          </div>

          {/* Org identity card */}
          <div className="card space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0C0A18] flex items-center justify-center flex-shrink-0">
                <span className="text-base font-extrabold text-white">{MY_ORG.initials}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-text-primary">{MY_ORG.name}</h2>
                  {MY_ORG.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-2 py-0.5 rounded-badge">
                      <IconCircleCheck size={11} /> Vérifiée
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mt-1">{MY_ORG.tagline}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                  <span className="text-xs text-text-tertiary flex items-center gap-1.5">
                    <IconMapPin size={12} />{MY_ORG.city}, {MY_ORG.country}
                  </span>
                  <span className="text-xs text-text-tertiary flex items-center gap-1.5">
                    <IconStack2 size={12} />{MY_ORG.sector}
                  </span>
                  <span className="text-xs text-text-tertiary flex items-center gap-1.5">
                    <IconUsers size={12} />{MY_ORG.size}
                  </span>
                  <span className="text-xs text-text-tertiary flex items-center gap-1.5">
                    <IconCalendar size={12} />Fondée en {MY_ORG.founded}
                  </span>
                  <a href={MY_ORG.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1.5 hover:underline">
                    <IconWorld size={12} />{MY_ORG.website}
                  </a>
                </div>
              </div>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">{MY_ORG.description}</p>

            {/* My role in the org */}
            {myRole && (
              <div className="flex items-center gap-3 px-4 py-3 bg-primary-light rounded-xl">
                <IconCircleCheck size={16} className="text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-primary">{myRole.title}</p>
                  <p className="text-xs text-primary/70">Votre poste actuel · {myRole.verificationStatus === 'confirmée' ? 'Expérience vérifiée' : 'Vérification non demandée'}</p>
                </div>
              </div>
            )}

            {/* Read-only notice */}
            <div className="flex items-start gap-2 text-xs text-text-tertiary">
              <IconLock size={13} className="flex-shrink-0 mt-0.5" />
              <p>
                Vous consultez ce profil en lecture seule. Seuls les administrateurs de l&apos;organisation peuvent le modifier.{' '}
                <Link href={`/org/${MY_ORG.slug}`} className="text-primary hover:underline font-medium">
                  Voir la page publique →
                </Link>
              </p>
            </div>
          </div>

          {/* Colleagues */}
          <section>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] mb-4">
              Collègues sur bcarte
            </p>
            <div className="card space-y-1">
              {COLLEAGUES.map(colleague => (
                <div key={colleague.id} className="flex items-center gap-3 py-3 border-b border-[#F3F4F6] last:border-0">
                  <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {colleague.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-text-primary">{colleague.name}</p>
                      {colleague.verified && <IconCircleCheck size={13} className="text-success flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-text-tertiary">{colleague.title} · {colleague.city}</p>
                  </div>
                  <Link href={`/p/${colleague.slug}`} className="w-8 h-8 rounded-lg bg-[#F3F4F6] hover:bg-primary-light flex items-center justify-center text-text-tertiary hover:text-primary transition-colors flex-shrink-0" aria-label="Voir le profil">
                    <IconArrowUpRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Active offers */}
          {ORG_OFFERS.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em]">Offres publiées par l&apos;organisation</p>
                <span className="text-xs text-text-tertiary">{ORG_OFFERS.length} actives</span>
              </div>
              <div className="space-y-3">
                {ORG_OFFERS.map(offer => (
                  <div key={offer.id} className="card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary text-sm">{offer.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs text-text-tertiary flex items-center gap-1"><IconMapPin size={11} />{offer.location}</span>
                          <span className="text-[#E5E7EB]">·</span>
                          <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-badge">{offer.type}</span>
                          <span className="text-[#E5E7EB]">·</span>
                          <span className="text-xs text-text-tertiary">{offer.posted}</span>
                        </div>
                        <p className="text-xs text-text-secondary mt-2 leading-relaxed">{offer.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#F3F4F6]">
                      <span className="text-xs text-text-tertiary">Partager à un contact :</span>
                      <a href={`mailto:${MY_ORG.email}?subject=Candidature — ${offer.title}`} className="flex items-center gap-1 text-xs font-semibold text-text-secondary bg-[#F3F4F6] hover:bg-primary-light hover:text-primary px-2.5 py-1.5 rounded-lg transition-colors">
                        <IconMail size={12} /> Email
                      </a>
                      <a href={`https://wa.me/?text=Offre : ${offer.title} — ${MY_ORG.name}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-semibold text-whatsapp bg-[#ECFDF5] hover:bg-[#D1FAE5] px-2.5 py-1.5 rounded-lg transition-colors">
                        <IconBrandWhatsapp size={12} /> WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <BottomNav />
    </div>
  )
}
