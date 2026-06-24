'use client'

import { useEffect, useState } from 'react'
import { IconCreditCard, IconCheck, IconChevronRight, IconChevronLeft } from '@tabler/icons-react'

const STEPS = ['Aperçu', 'Design', 'Commander']
type Design = 'violet' | 'or'

export default function NFCPage() {
  const [step, setStep]     = useState(0)
  const [design, setDesign] = useState<Design>('violet')
  const [ordered, setOrdered] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
  }, [])

  const name  = profile?.fullName ?? '—'
  const title = profile?.title    ?? '—'
  const phone = profile?.phone    ?? '—'

  if (ordered) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto">
          <IconCheck size={32} className="text-success" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Commande confirmée !</h2>
        <p className="text-text-secondary text-sm">
          Votre carte NFC est en cours de fabrication. Livraison sous <strong>7–10 jours</strong>.
        </p>
        <div className="card text-left text-sm space-y-2 mt-4">
          <div className="flex justify-between"><span className="text-text-secondary">Nom</span><span className="font-medium">{name}</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Design</span><span className="font-medium capitalize">{design}</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Prix</span><span className="font-medium">29 000 FCFA</span></div>
        </div>
        <button onClick={() => { setOrdered(false); setStep(0) }} className="btn-secondary w-full justify-center mt-2">
          Nouvelle commande
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Carte NFC</h1>
        <p className="text-sm text-text-secondary mt-1">Commandez votre carte de visite connectée</p>
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

      {/* Aperçu */}
      {step === 0 && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 text-white ${design === 'or' ? 'bg-gradient-to-br from-[#B7881C] to-[#F5C842]' : 'bg-gradient-to-br from-primary to-[#4F35C2]'}`}>
            <div className="flex items-center gap-2 mb-8">
              <IconCreditCard size={20} />
              <span className="font-extrabold text-lg">bcarte</span>
            </div>
            <p className="font-bold text-xl">{name}</p>
            <p className="text-white/80 text-sm mt-1">{title}</p>
            <p className="text-white/60 text-xs mt-4">{phone}</p>
          </div>
          <button onClick={() => setStep(1)} className="btn-primary w-full justify-center py-3 flex items-center gap-2">
            Choisir le design <IconChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Design */}
      {step === 1 && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-text-primary">Choisissez votre design</h2>
          <div className="grid grid-cols-2 gap-4">
            {(['violet', 'or'] as Design[]).map(d => (
              <button key={d} onClick={() => setDesign(d)}
                className={`rounded-xl p-4 border-2 transition-all ${design === d ? 'border-primary' : 'border-[#E5E7EB]'}`}>
                <div className={`h-14 rounded-lg mb-2 ${d === 'or' ? 'bg-gradient-to-br from-[#B7881C] to-[#F5C842]' : 'bg-gradient-to-br from-primary to-[#4F35C2]'}`} />
                <p className="text-sm font-medium capitalize">{d}</p>
                <p className="text-xs text-text-secondary">29 000 FCFA</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary flex-1 justify-center py-3 flex items-center gap-2"><IconChevronLeft size={16} /> Retour</button>
            <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center py-3 flex items-center gap-2">Commander <IconChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Commander */}
      {step === 2 && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-text-primary">Récapitulatif</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-text-secondary">Nom</span><span className="font-medium">{name}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Design</span><span className="font-medium capitalize">{design}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Prix</span><span className="font-semibold text-primary">29 000 FCFA</span></div>
          </div>
          <div>
            <label className="label">Adresse de livraison</label>
            <input className="input" placeholder="Ex: Sacré-Cœur 3, Villa 25, Dakar" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3 flex items-center gap-2"><IconChevronLeft size={16} /> Retour</button>
            <button onClick={() => setOrdered(true)} className="btn-primary flex-1 justify-center py-3">Confirmer la commande</button>
          </div>
        </div>
      )}
    </div>
  )
}
