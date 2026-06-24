'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  IconCircleCheck, IconBrandWhatsapp, IconMail,
  IconMapPin, IconExternalLink, IconArrowUpRight,
  IconBriefcase, IconCheck, IconUsers,
} from '@tabler/icons-react'

const ORG = {
  slug: 'talent-africa-group',
  name: 'Talent Africa Group',
  tagline: 'Cabinet de recrutement spécialisé en Afrique de l\'Ouest',
  description: 'Nous connectons les meilleurs talents tech, finance et management aux entreprises qui façonnent l\'avenir de l\'Afrique. Fondé en 2019 à Dakar, Talent Africa Group opère dans 8 pays.',
  city: 'Dakar',
  country: 'Sénégal',
  website: 'https://talentagricagroup.com',
  email: 'contact@talentagricagroup.com',
  whatsapp: '+221 33 123 4567',
  verified: true,
  sector: 'Recrutement & RH',
  size: '10–50 employés',
  founded: '2019',
  placements: 340,
  activeOffers: 3,
  offers: [
    {
      id: 'o1',
      title: 'Développeur Full Stack React / Node.js',
      location: 'Dakar, Sénégal',
      type: 'CDI',
      sector: 'Technologie',
      posted: 'Il y a 4 jours',
      description: 'Rejoignez une startup en forte croissance pour développer des solutions SaaS à destination des PME africaines. Stack : React, Node.js, PostgreSQL.',
    },
    {
      id: 'o2',
      title: 'Responsable Marketing Digital',
      location: 'Abidjan, Côte d\'Ivoire',
      type: 'CDI',
      sector: 'Marketing',
      posted: 'Il y a 9 jours',
      description: 'Pilotez la stratégie digitale d\'un groupe bancaire panafricain. Expérience de 5 ans minimum en marketing digital B2B.',
    },
    {
      id: 'o3',
      title: 'Analyste Financier Senior',
      location: 'Paris, France · Remote possible',
      type: 'CDI',
      sector: 'Finance',
      posted: 'Il y a 12 jours',
      description: 'Pour un fonds d\'investissement focalisé sur l\'Afrique sub-saharienne. CFA ou équivalent requis.',
    },
  ],
}

export default function OrgPage() {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#F3F4F6]">
        <Link href="/" className="text-lg font-extrabold text-primary">bcarte</Link>
        <Link href="/register" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">
          Créer mon profil →
        </Link>
      </header>

      <main className="max-w-[660px] mx-auto px-6 py-12 space-y-10">

        {/* ── IDENTITY ── */}
        <div className="flex items-start gap-5">
          {/* Logo placeholder */}
          <div className="w-[72px] h-[72px] rounded-2xl bg-primary-light border border-primary-border flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-extrabold text-primary">T</span>
          </div>

          <div className="flex-1 pt-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-text-primary">{ORG.name}</h1>
              {ORG.verified && (
                <IconCircleCheck size={18} className="text-success flex-shrink-0" />
              )}
            </div>
            <p className="text-text-secondary mt-1 text-[15px]">{ORG.tagline}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-text-tertiary text-sm flex items-center gap-1">
                <IconMapPin size={13} />
                {ORG.city}, {ORG.country}
              </span>
              <a
                href={ORG.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-primary text-sm flex items-center gap-1 transition-colors"
              >
                <IconExternalLink size={13} />
                Site web
              </a>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <span className="text-xs font-medium text-secondary bg-secondary-light border border-secondary-border px-2.5 py-1 rounded-badge">
                {ORG.sector}
              </span>
              <span className="text-[#E5E7EB] mx-0.5">·</span>
              <span className="text-xs text-text-tertiary">{ORG.size}</span>
              <span className="text-[#E5E7EB] mx-0.5">·</span>
              <span className="text-xs text-text-tertiary">Fondé en {ORG.founded}</span>
            </div>
          </div>
        </div>

        {/* ── CONTACT ── */}
        <div className="flex gap-3">
          {ORG.whatsapp && (
            <a
              href={`https://wa.me/${ORG.whatsapp.replace(/[\s+]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-whatsapp text-white font-semibold text-sm py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              <IconBrandWhatsapp size={17} />
              WhatsApp
            </a>
          )}
          <a
            href={`mailto:${ORG.email}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#F3F4F6] hover:bg-primary-light text-text-primary hover:text-primary font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            <IconMail size={17} />
            Email
          </a>
        </div>

        {/* ── ABOUT ── */}
        <section>
          <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] mb-3">À propos</p>
          <p className="text-text-secondary text-[15px] leading-relaxed">{ORG.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-[#F8F7FF] border border-primary-border rounded-xl p-4">
              <p className="text-2xl font-extrabold text-primary">{ORG.placements}+</p>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">Placements réalisés</p>
            </div>
            <div className="bg-[#F0FDF4] border border-[#A7F3D0] rounded-xl p-4">
              <p className="text-2xl font-extrabold text-success">{ORG.activeOffers}</p>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">Offres actives</p>
            </div>
          </div>
        </section>

        {/* ── OFFERS ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em]">
              Offres d&apos;emploi
            </p>
            <span className="text-xs text-text-tertiary">{ORG.offers.length} actives</span>
          </div>
          <div className="space-y-3">
            {ORG.offers.map(offer => (
              <div
                key={offer.id}
                className="border border-[#F3F4F6] hover:border-primary-border rounded-xl p-5 transition-colors group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-[15px] group-hover:text-primary transition-colors">
                      {offer.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs text-text-tertiary flex items-center gap-1">
                        <IconMapPin size={12} />
                        {offer.location}
                      </span>
                      <span className="text-[#E5E7EB]">·</span>
                      <span className="text-xs font-medium text-primary bg-primary-light px-2 py-0.5 rounded-badge">
                        {offer.type}
                      </span>
                      <span className="text-[#E5E7EB]">·</span>
                      <span className="text-xs text-text-tertiary">{offer.posted}</span>
                    </div>
                    <p className="text-text-secondary text-sm mt-2 leading-relaxed line-clamp-2">
                      {offer.description}
                    </p>
                  </div>
                  <IconArrowUpRight size={16} className="text-text-tertiary group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                </div>

                {/* Apply CTA */}
                <div className="flex gap-2 mt-4">
                  <a
                    href={`mailto:${ORG.email}?subject=Candidature — ${offer.title}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary-light hover:bg-[#EDE9FE] px-3 py-2 rounded-lg transition-colors"
                  >
                    <IconBriefcase size={13} />
                    Postuler par email
                  </a>
                  <a
                    href={`https://wa.me/${ORG.whatsapp.replace(/[\s+]/g, '')}?text=Bonjour, je suis intéressé(e) par le poste : ${offer.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-whatsapp bg-[#ECFDF5] hover:bg-[#D1FAE5] px-3 py-2 rounded-lg transition-colors"
                  >
                    <IconBrandWhatsapp size={13} />
                    Via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SHARE ── */}
        <div className="flex items-center justify-between py-5 border-t border-[#F3F4F6]">
          <p className="text-xs text-text-tertiary font-mono">bcarte.io/org/{ORG.slug}</p>
          <button
            onClick={copy}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
              copied ? 'bg-success-light text-success' : 'bg-[#F3F4F6] text-text-secondary hover:text-text-primary'
            }`}
          >
            {copied && <IconCheck size={13} />}
            {copied ? 'Copié' : 'Copier le lien'}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pb-4">
          <p className="text-xs text-text-tertiary">
            Propulsé par{' '}
            <Link href="/" className="font-bold text-primary">bcarte</Link>
            {' '}· Organisations professionnelles vérifiées
          </p>
        </div>

      </main>
    </div>
  )
}
