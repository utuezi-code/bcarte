'use client'

import { useEffect, useState } from 'react'
import { IconFileText, IconDownload, IconCopy, IconCheck, IconChevronRight, IconChevronLeft, IconSparkles, IconLoader2 } from '@tabler/icons-react'

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

  const cvText = profile ? `**${profile.fullName}**
${profile.title ?? ''} | ${profile.city ?? ''}, ${profile.country ?? ''}
${profile.phone ?? ''} · ${profile.linkedin ?? ''}

---

**PROFIL**
${profile.bio ?? 'Professionnel avec une solide expérience dans son domaine.'}

**EXPÉRIENCES**
${(profile.experiences ?? []).length === 0 ? '— Aucune expérience enregistrée' :
  profile.experiences.map((e: any) => `${e.title} — ${e.company}\n${e.isCurrent ? "En cours" : ""}`).join('\n\n')}

**FORMATIONS**
${(profile.educations ?? []).length === 0 ? '— Aucune formation enregistrée' :
  profile.educations.map((e: any) => `${e.degree} — ${e.organisation?.name ?? ''}\n${e.startYear ?? ''} – ${e.endYear ?? 'Présent'}`).join('\n\n')}
` : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(cvText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Générer mon CV</h1>
        <p className="text-sm text-text-secondary mt-1">CV optimisé à partir de votre profil bcarte</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? 'bg-primary text-white' : 'bg-[#F3F4F6] text-text-tertiary'}`}>{i + 1}</div>
            <span className={`text-sm font-medium ${i === step ? 'text-text-primary' : 'text-text-tertiary'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-[#E5E7EB]" />}
          </div>
        ))}
      </div>

      {/* Étape 1 */}
      {step === 0 && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-text-primary">Collez l&apos;offre d&apos;emploi</h2>
          <textarea
            className="input min-h-[200px] resize-none text-sm"
            placeholder="Collez le texte de l'offre d'emploi ici…"
            value={jobOffer}
            onChange={e => setJobOffer(e.target.value)}
          />
          <button onClick={() => setStep(1)} className="btn-primary w-full justify-center py-3">
            Continuer <IconChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Étape 2 */}
      {step === 1 && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-text-primary">Options</h2>
          <div>
            <label className="label">Langue du CV</label>
            <select className="input" value={lang} onChange={e => setLang(e.target.value)}>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary flex-1 justify-center py-3 flex items-center gap-2">
              <IconChevronLeft size={16} /> Retour
            </button>
            <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center py-3 flex items-center gap-2">
              <IconSparkles size={16} /> Générer
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 */}
      {step === 2 && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-text-primary">Votre CV</h2>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
                {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
              <button className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                <IconDownload size={15} /> PDF
              </button>
            </div>
          </div>
          {!profile ? (
            <div className="flex items-center justify-center py-10">
              <IconLoader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <pre className="bg-[#F9FAFB] rounded-xl p-5 text-xs text-text-secondary font-mono whitespace-pre-wrap leading-relaxed">
              {cvText}
            </pre>
          )}
          <button onClick={() => setStep(0)} className="text-sm text-primary font-medium">
            ← Recommencer
          </button>
        </div>
      )}
    </div>
  )
}
