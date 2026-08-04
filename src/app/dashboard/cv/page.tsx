'use client'

import { useEffect, useState } from 'react'
import { IconFileText, IconDownload, IconCopy, IconCheck, IconChevronRight, IconChevronLeft, IconLoader2 } from '@tabler/icons-react'

const STEPS = ["Offre d'emploi", 'Options', 'Résultat']

export default function CVPage() {
  const [step, setStep]         = useState(0)
  const [jobOffer, setJobOffer] = useState('')
  const [lang, setLang]         = useState('fr')
  const [copied, setCopied]     = useState(false)
  const [profile, setProfile]   = useState<any>(null)

  useEffect(() => {
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
  }, [])

  const cvText = profile ? `${profile.fullName ?? ''}
${[profile.title, profile.city, profile.country].filter(Boolean).join(' · ')}
${[profile.phone, profile.linkedin].filter(Boolean).join(' · ')}

PROFIL
${profile.bio ?? 'Professionnel avec une solide expérience dans son domaine.'}

EXPÉRIENCES
${(profile.experiences ?? []).length === 0
  ? '— Aucune expérience enregistrée'
  : profile.experiences.map((e: any) => `${e.title} — ${e.company}${e.isCurrent ? ' (En cours)' : ''}`).join('\n')}

FORMATIONS
${(profile.educations ?? []).length === 0
  ? '— Aucune formation enregistrée'
  : profile.educations.map((e: any) => `${e.degree} — ${e.organisation?.name ?? ''} ${e.startYear ?? ''} – ${e.endYear ?? 'Présent'}`).join('\n')}
` : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(cvText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="max-w-2xl space-y-5">

      {/* En-tête */}
      <div>
        <h1 className="page-title">Générer mon CV</h1>
        <p className="page-subtitle">CV structuré à partir de votre profil bcarte</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step  ? 'bg-primary text-white' :
                i === step ? 'bg-primary text-white ring-4 ring-primary/15' :
                'bg-border-subtle text-text-tertiary'
              }`}>
                {i < step ? <IconCheck size={12} /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === step ? 'text-text-primary' : 'text-text-tertiary'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-3 h-px w-8 ${i < step ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Étape 1 — Offre */}
      {step === 0 && (
        <div className="card space-y-4">
          <div>
            <h2 className="font-semibold text-text-primary">Collez l&apos;offre d&apos;emploi</h2>
            <p className="text-xs text-text-tertiary mt-0.5">Le CV sera optimisé en fonction de cette offre</p>
          </div>
          <textarea
            className="input min-h-[200px] resize-none text-sm leading-relaxed"
            placeholder="Collez le texte de l'offre d'emploi ici…"
            value={jobOffer}
            onChange={e => setJobOffer(e.target.value)}
          />
          <button onClick={() => setStep(1)} className="btn-primary w-full justify-center py-2.5">
            Continuer <IconChevronRight size={15} />
          </button>
        </div>
      )}

      {/* Étape 2 — Options */}
      {step === 1 && (
        <div className="card space-y-5">
          <div>
            <h2 className="font-semibold text-text-primary">Options du CV</h2>
            <p className="text-xs text-text-tertiary mt-0.5">Personnalisez la langue et le format</p>
          </div>
          <div>
            <label className="label">Langue du CV</label>
            <select className="input" value={lang} onChange={e => setLang(e.target.value)}>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary flex-1 justify-center gap-2">
              <IconChevronLeft size={15} /> Retour
            </button>
            <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center gap-2">
              <IconFileText size={15} /> Générer
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 — Résultat */}
      {step === 2 && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-text-primary">Votre CV</h2>
              <p className="text-xs text-text-tertiary mt-0.5">Langue : {lang === 'fr' ? 'Français' : 'Anglais'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-secondary gap-1.5 px-3 py-2">
                {copied ? <IconCheck size={14} className="text-success" /> : <IconCopy size={14} />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
              <button className="btn-primary gap-1.5 px-3 py-2">
                <IconDownload size={14} /> PDF
              </button>
            </div>
          </div>

          {!profile ? (
            <div className="flex justify-center py-10">
              <IconLoader2 size={22} className="animate-spin text-primary" />
            </div>
          ) : (
            <pre className="bg-bg-light rounded-xl p-5 text-xs text-text-secondary font-mono whitespace-pre-wrap leading-relaxed border border-border overflow-x-auto">
              {cvText}
            </pre>
          )}

          <button onClick={() => setStep(0)} className="text-sm text-primary font-medium hover:underline">
            ← Recommencer
          </button>
        </div>
      )}

    </div>
  )
}
