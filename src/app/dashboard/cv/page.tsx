'use client'

import { useState } from 'react'
import { IconFileText, IconDownload, IconCopy, IconCheck, IconChevronRight, IconChevronLeft, IconSparkles } from '@tabler/icons-react'
import { CURRENT_USER } from '@/lib/mock-data'

const STEPS = ['Offre d\'emploi', 'Options', 'Résultat']

const FAKE_CV = `**Amadou Diallo**
Ingénieur Logiciel Senior | Dakar, Sénégal
+221 77 123 4567 · amadou.diallo@email.com · bcarte.io/amadou-diallo

---

**PROFIL**
Ingénieur logiciel avec 7 ans d'expérience en développement full-stack, spécialisé dans les architectures React/Node.js et les systèmes distribués à haute disponibilité. Passionné par l'innovation technologique en Afrique de l'Ouest, avec une solide expertise en PostgreSQL et Docker pour des environnements de production robustes.

**COMPÉTENCES CLÉS**
• React.js / Next.js — développement d'interfaces complexes et performantes
• Node.js / Express — API RESTful et microservices
• TypeScript — développement robuste et maintainable
• PostgreSQL — modélisation et optimisation des bases de données
• Docker / CI-CD — déploiement et infrastructure

**EXPÉRIENCES**

Ingénieur Logiciel Senior — Orange Digital Center, Dakar  ✓ Vérifié
Mars 2022 – Aujourd'hui
• Conception et développement d'une plateforme e-commerce desservant 50 000+ utilisateurs
• Réduction de 40% des temps de réponse par l'optimisation des requêtes PostgreSQL
• Encadrement d'une équipe de 4 développeurs juniors

Développeur Full Stack — Teranga Tech, Dakar  ✓ Vérifié
Juin 2019 – Février 2022
• Développement de solutions SaaS pour 12 PME sénégalaises
• Intégration d'API Orange Money et Wave pour les paiements mobiles
• Migration d'une architecture monolithique vers des microservices

**FORMATION**

Master en Génie Informatique — École Polytechnique de Thiès  (vérification en cours)
2015 – 2017

Licence en Informatique — Université Cheikh Anta Diop  ✓ Vérifié
2012 – 2015

**LANGUES**
Français (natif) · Anglais (professionnel) · Wolof (natif)`

export default function CVPage() {
  const [step, setStep] = useState(0)
  const [jobOffer, setJobOffer] = useState('')
  const [language, setLanguage] = useState<'fr' | 'en' | 'both'>('fr')
  const [format, setFormat] = useState<'1page' | '2pages' | 'short'>('1page')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setStep(2)
    }, 2000)
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Générer mon CV par IA</h1>
        <p className="text-text-secondary text-sm mt-1">Votre CV adapté à l&apos;offre d&apos;emploi en quelques secondes</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < step ? 'bg-success text-white' :
              i === step ? 'bg-primary text-white' :
              'bg-[#F3F4F6] text-text-tertiary'
            }`}>
              {i < step ? <IconCheck size={14} /> : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-text-primary' : 'text-text-tertiary'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 ${i < step ? 'bg-success' : 'bg-[#E5E7EB]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Job offer */}
      {step === 0 && (
        <div className="card space-y-4">
          <h2 className="section-title flex items-center gap-2">
            <IconFileText size={20} className="text-primary" />
            Offre d&apos;emploi
          </h2>
          <p className="text-sm text-text-secondary">
            Collez le texte complet de l&apos;offre d&apos;emploi. Notre IA adaptera votre profil pour maximiser vos chances.
          </p>
          <div>
            <label htmlFor="jobOffer" className="label">Offre d&apos;emploi</label>
            <textarea
              id="jobOffer"
              className="input resize-none"
              rows={10}
              placeholder={`Exemple :

Nous recherchons un Développeur Full Stack Senior pour rejoindre notre équipe à Dakar.

Missions :
• Développer et maintenir nos applications web
• Collaborer avec l'équipe produit
• Participer aux revues de code...

Profil recherché :
• 5+ ans d'expérience en développement web
• Maîtrise de React et Node.js
• Expérience avec PostgreSQL...`}
              value={jobOffer}
              onChange={(e) => setJobOffer(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="btn-primary"
              onClick={() => setStep(1)}
              disabled={!jobOffer.trim()}
            >
              Suivant
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Options */}
      {step === 1 && (
        <div className="card space-y-6">
          <h2 className="section-title flex items-center gap-2">
            <IconSparkles size={20} className="text-primary" />
            Options de génération
          </h2>

          <div>
            <p className="label">Langue du CV</p>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'fr', label: 'Français' },
                { value: 'en', label: 'Anglais' },
                { value: 'both', label: 'Les deux' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLanguage(opt.value)}
                  className={`py-3 rounded-card border-2 text-sm font-medium transition-all ${
                    language === opt.value
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-[#E5E7EB] text-text-secondary hover:border-primary-border'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="label">Format</p>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: '1page', label: '1 page', desc: 'Synthétique' },
                { value: '2pages', label: '2 pages', desc: 'Détaillé' },
                { value: 'short', label: 'Court', desc: 'Résumé exécutif' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormat(opt.value)}
                  className={`py-3 px-2 rounded-card border-2 text-sm transition-all ${
                    format === opt.value
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-[#E5E7EB] text-text-secondary hover:border-primary-border'
                  }`}
                >
                  <p className="font-medium">{opt.label}</p>
                  <p className="text-xs mt-0.5 opacity-70">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(0)}>
              <IconChevronLeft size={16} />
              Retour
            </button>
            <button className="btn-primary" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <IconSparkles size={16} />
                  Générer mon CV
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Result */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-success flex items-center gap-1.5">
              <IconCheck size={16} />
              Votre CV adapté est prêt. Téléchargez-le ou copiez-le.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary">
              <IconDownload size={16} />
              Télécharger PDF
            </button>
            <button className="btn-secondary" onClick={handleCopy}>
              {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
            <button className="btn-ghost" onClick={() => setStep(0)}>
              Recommencer
            </button>
          </div>

          {/* CV preview */}
          <div className="card font-mono text-sm leading-relaxed whitespace-pre-wrap text-text-primary bg-white">
            {FAKE_CV}
          </div>
        </div>
      )}
    </div>
  )
}
