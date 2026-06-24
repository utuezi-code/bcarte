'use client'

import { useState } from 'react'
import {
  IconPlus, IconTrash, IconEdit, IconCircleCheck, IconClock,
  IconX, IconBrandWhatsapp, IconMail, IconLink, IconCheck
} from '@tabler/icons-react'
import { CURRENT_USER, SECTORS, COUNTRIES, LANGUAGES } from '@/lib/mock-data'
import { AvailabilityStatus, VerificationStatus } from '@/lib/types'

const STATUS_LABELS: Record<VerificationStatus, { label: string; color: string }> = {
  non_demandée: { label: 'Non demandée', color: 'text-text-tertiary bg-[#F3F4F6]' },
  en_attente: { label: 'En attente', color: 'text-[#D97706] bg-[#FFFBEB]' },
  confirmée: { label: 'Confirmée', color: 'text-success bg-success-light' },
  rejetée: { label: 'Rejetée', color: 'text-danger bg-red-50' },
}

export default function ProfilePage() {
  const [saved, setSaved] = useState(false)
  const [availability, setAvailability] = useState<AvailabilityStatus>(CURRENT_USER.availabilityStatus)
  const [skills, setSkills] = useState(CURRENT_USER.skills.map(s => s.label))
  const [newSkill, setNewSkill] = useState('')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addSkill = () => {
    if (newSkill.trim() && skills.length < 5) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Mon profil</h1>
        <p className="text-text-secondary text-sm mt-1">Gérez vos informations professionnelles</p>
      </div>

      {/* 1. Identité */}
      <section className="card space-y-4">
        <h2 className="section-title">Identité</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="label">Nom complet</label>
            <input id="fullName" className="input" defaultValue={CURRENT_USER.fullName} />
          </div>
          <div>
            <label htmlFor="title" className="label">Titre professionnel</label>
            <input id="title" className="input" defaultValue={CURRENT_USER.title} />
          </div>
          <div>
            <label htmlFor="city" className="label">Ville</label>
            <input id="city" className="input" defaultValue={CURRENT_USER.city} />
          </div>
          <div>
            <label htmlFor="country" className="label">Pays</label>
            <select id="country" className="input" defaultValue={CURRENT_USER.country}>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sector" className="label">Secteur</label>
            <select id="sector" className="input" defaultValue={CURRENT_USER.sector}>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Langues</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const selected = CURRENT_USER.languages.includes(lang)
                return (
                  <button
                    key={lang}
                    type="button"
                    className={`text-xs px-3 py-1.5 rounded-badge border font-medium transition-colors ${
                      selected
                        ? 'bg-primary-light border-primary-border text-primary'
                        : 'bg-white border-border text-text-secondary hover:border-primary-border'
                    }`}
                  >
                    {lang}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Compétences */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Compétences</h2>
          <span className="text-xs text-text-tertiary">{skills.length}/5 maximum</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-sm font-medium px-3 py-1.5 rounded-badge border border-primary-border">
              {skill}
              <button onClick={() => removeSkill(i)} aria-label={`Supprimer ${skill}`}>
                <IconX size={12} />
              </button>
            </span>
          ))}
        </div>
        {skills.length < 5 && (
          <div className="flex gap-2">
            <input
              className="input flex-1"
              placeholder="Ajouter une compétence..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <button onClick={addSkill} className="btn-primary px-3">
              <IconPlus size={16} />
            </button>
          </div>
        )}
      </section>

      {/* 3. Expériences */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Expériences</h2>
          <button className="btn-secondary text-xs py-1.5 px-3">
            <IconPlus size={14} />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {CURRENT_USER.experiences.map((exp) => {
            const status = STATUS_LABELS[exp.verificationStatus]
            return (
              <div key={exp.id} className="border border-[#E5E7EB] rounded-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary text-sm">{exp.title}</p>
                    <p className="text-text-secondary text-sm">{exp.organization}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {exp.startDate} — {exp.current ? "Aujourd'hui" : exp.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="btn-ghost py-1 px-2" aria-label="Modifier">
                      <IconEdit size={14} />
                    </button>
                    <button className="btn-ghost py-1 px-2 hover:text-danger hover:bg-red-50" aria-label="Supprimer">
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-badge ${status.color}`}>
                    {exp.verificationStatus === 'confirmée' && <IconCircleCheck size={12} className="inline mr-1" />}
                    {exp.verificationStatus === 'en_attente' && <IconClock size={12} className="inline mr-1" />}
                    {status.label}
                  </span>
                  {exp.verificationStatus === 'non_demandée' && (
                    <button className="text-xs text-primary hover:text-primary-hover font-medium flex items-center gap-1 underline underline-offset-2">
                      Demander la vérification
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. Formation */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Formation</h2>
          <button className="btn-secondary text-xs py-1.5 px-3">
            <IconPlus size={14} />
            Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {CURRENT_USER.education.map((edu) => {
            const status = STATUS_LABELS[edu.verificationStatus]
            return (
              <div key={edu.id} className="border border-[#E5E7EB] rounded-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary text-sm">{edu.degree}</p>
                    <p className="text-text-secondary text-sm">{edu.institution}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {edu.startDate} — {edu.current ? "Aujourd'hui" : edu.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="btn-ghost py-1 px-2" aria-label="Modifier">
                      <IconEdit size={14} />
                    </button>
                    <button className="btn-ghost py-1 px-2 hover:text-danger hover:bg-red-50" aria-label="Supprimer">
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-badge ${status.color}`}>
                    {edu.verificationStatus === 'confirmée' && <IconCircleCheck size={12} className="inline mr-1" />}
                    {edu.verificationStatus === 'en_attente' && <IconClock size={12} className="inline mr-1" />}
                    {status.label}
                  </span>
                  {edu.verificationStatus === 'non_demandée' && (
                    <button className="text-xs text-primary hover:text-primary-hover font-medium underline underline-offset-2">
                      Demander la vérification
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. Publications */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Thèse & Publications</h2>
          <button className="btn-secondary text-xs py-1.5 px-3">
            <IconPlus size={14} />
            Ajouter
          </button>
        </div>
        {CURRENT_USER.publications.map((pub) => (
          <div key={pub.id} className="border border-[#E5E7EB] rounded-card p-4 flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-medium text-secondary bg-secondary-light px-2 py-0.5 rounded-badge capitalize">
                {pub.type}
              </span>
              <p className="text-sm font-medium text-text-primary mt-1.5">{pub.title}</p>
              <a href={pub.link} className="text-xs text-primary hover:underline mt-0.5 block">{pub.link}</a>
            </div>
            <button className="btn-ghost py-1 px-2 hover:text-danger hover:bg-red-50 flex-shrink-0" aria-label="Supprimer">
              <IconTrash size={14} />
            </button>
          </div>
        ))}
      </section>

      {/* 6. Disponibilité */}
      <section className="card space-y-4">
        <h2 className="section-title">Disponibilité</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {([
            { value: 'disponible', label: 'Disponible', desc: 'En recherche active', dot: 'bg-success' },
            { value: 'en_veille', label: 'En veille', desc: 'Ouvert aux opportunités', dot: 'bg-[#F59E0B]' },
            { value: 'indisponible', label: 'Indisponible', desc: 'Non disponible', dot: 'bg-text-tertiary' },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAvailability(opt.value)}
              className={`flex items-start gap-3 p-4 rounded-card border-2 text-left transition-all ${
                availability === opt.value
                  ? 'border-primary bg-primary-light'
                  : 'border-[#E5E7EB] hover:border-primary-border'
              }`}
            >
              <span className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 ${opt.dot}`} />
              <div>
                <p className={`text-sm font-semibold ${availability === opt.value ? 'text-primary' : 'text-text-primary'}`}>
                  {opt.label}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 7. Contact */}
      <section className="card space-y-4">
        <h2 className="section-title">Contact</h2>
        <div className="space-y-3">
          <div>
            <label htmlFor="whatsapp" className="label">WhatsApp</label>
            <div className="relative">
              <IconBrandWhatsapp className="absolute left-3 top-1/2 -translate-y-1/2 text-whatsapp" size={16} />
              <input id="whatsapp" className="input pl-9" defaultValue={CURRENT_USER.whatsapp} placeholder="+221 77 000 0000" />
            </div>
          </div>
          <div>
            <label htmlFor="contactEmail" className="label">Email de contact</label>
            <div className="relative">
              <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
              <input id="contactEmail" type="email" className="input pl-9" defaultValue={CURRENT_USER.contactEmail} />
            </div>
          </div>
          <div>
            <label htmlFor="externalLink" className="label">Lien externe (portfolio, GitHub, etc.)</label>
            <div className="relative">
              <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
              <input id="externalLink" type="url" className="input pl-9" defaultValue={CURRENT_USER.externalLink} placeholder="https://" />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-60 bg-white border-t border-[#E5E7EB] px-5 py-3 flex items-center justify-between z-20">
        <p className="text-xs text-text-secondary">Dernière modification : 24 juin 2026</p>
        <button onClick={handleSave} className="btn-primary py-2">
          {saved ? (
            <>
              <IconCheck size={16} />
              Enregistré
            </>
          ) : (
            'Enregistrer les modifications'
          )}
        </button>
      </div>
    </div>
  )
}
