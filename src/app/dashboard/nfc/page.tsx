'use client'

import { useEffect, useState } from 'react'
import { IconCreditCard, IconCheck, IconChevronRight, IconChevronLeft, IconMapPin } from '@tabler/icons-react'

const STEPS = ['Aperçu', 'Design', 'Commander']
type Design = 'violet' | 'or'

const DESIGNS: Record<Design, { label: string; gradient: string; price: string }> = {
  violet: { label: 'Violet',  gradient: 'from-[#6C47FF] to-[#4F35C2]',       price: '29 000 FCFA' },
  or:     { label: 'Doré',    gradient: 'from-[#B7881C] to-[#F5C842]',       price: '29 000 FCFA' },
}

export default function NFCPage() {
  const [step, setStep]         = useState(0)
  const [design, setDesign]     = useState<Design>('violet')
  const [address, setAddress]   = useState('')
  const [ordered, setOrdered]   = useState(false)
  const [profile, setProfile]   = useState<any>(null)

  useEffect(() => {
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
  }, [])

  const name  = profile?.fullName ?? '—'
  const title = profile?.title    ?? '—'
  const phone = profile?.phone    ?? '—'

  const CardPreview = ({ size = 'lg' }: { size?: 'lg' | 'sm' }) => (
    <div className={`rounded-2xl text-white bg-gradient-to-br ${DESIGNS[design].gradient} ${size === 'lg' ? 'p-6' : 'p-3'}`}>
      <div className={`flex items-center gap-2 ${size === 'lg' ? 'mb-8' : 'mb-3'}`}>
        <IconCreditCard size={size === 'lg' ? 18 : 13} />
        <span className={`font-extrabold ${size === 'lg' ? 'text-base' : 'text-xs'}`}>bcarte</span>
      </div>
      <p className={`font-bold ${size === 'lg' ? 'text-xl' : 'text-sm'}`}>{name}</p>
      <p className={`text-white/80 ${size === 'lg' ? 'text-sm mt-1' : 'text-xs mt-0.5'}`}>{title}</p>
      <p className={`text-white/50 ${size === 'lg' ? 'text-xs mt-4' : 'text-[10px] mt-2'}`}>{phone}</p>
    </div>
  )

  if (ordered) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-5">
        <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto">
          <IconCheck size={28} className="text-success" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">Commande confirmée !</h2>
          <p className="text-sm text-text-secondary mt-1">
            Votre carte NFC est en fabrication. Livraison sous <strong>7–10 jours</strong>.
          </p>
        </div>
        <div className="card text-left space-y-3">
          {[
            { label: 'Nom',     value: name },
            { label: 'Design',  value: DESIGNS[design].label },
            { label: 'Prix',    value: DESIGNS[design].price },
            { label: 'Adresse', value: address || '—' },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-text-secondary">{row.label}</span>
              <span className="font-medium text-text-primary">{row.value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setOrdered(false); setStep(0) }} className="btn-secondary w-full justify-center">
          Nouvelle commande
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5">

      {/* En-tête */}
      <div>
        <h1 className="page-title">Carte NFC</h1>
        <p className="page-subtitle">Commandez votre carte de visite connectée</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center">
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

      {/* Étape 1 — Aperçu */}
      {step === 0 && (
        <div className="space-y-4">
          <CardPreview size="lg" />
          <div className="card">
            <p className="text-xs text-text-tertiary mb-3">Vos informations affichées sur la carte</p>
            <div className="space-y-2">
              {[
                { label: 'Nom',     value: name  },
                { label: 'Titre',   value: title },
                { label: 'Téléphone', value: phone },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{row.label}</span>
                  <span className="font-medium text-text-primary">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setStep(1)} className="btn-primary w-full justify-center gap-2 py-2.5">
            Choisir le design <IconChevronRight size={15} />
          </button>
        </div>
      )}

      {/* Étape 2 — Design */}
      {step === 1 && (
        <div className="card space-y-5">
          <div>
            <h2 className="font-semibold text-text-primary">Choisissez votre design</h2>
            <p className="text-xs text-text-tertiary mt-0.5">Les deux designs ont le même tarif</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(Object.entries(DESIGNS) as [Design, typeof DESIGNS[Design]][]).map(([key, d]) => (
              <button key={key} onClick={() => setDesign(key)}
                className={`rounded-xl p-4 border-2 transition-all text-left ${design === key ? 'border-primary bg-primary-light' : 'border-border hover:border-primary-border'}`}>
                <div className={`h-14 rounded-xl mb-3 bg-gradient-to-br ${d.gradient}`} />
                <p className="text-sm font-semibold text-text-primary">{d.label}</p>
                <p className="text-xs text-text-secondary mt-0.5">{d.price}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary flex-1 justify-center gap-2">
              <IconChevronLeft size={15} /> Retour
            </button>
            <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center gap-2">
              Commander <IconChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 — Commander */}
      {step === 2 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text-primary">Récapitulatif</h2>
          <div className="flex gap-4 items-center">
            <div className="w-24 flex-shrink-0">
              <CardPreview size="sm" />
            </div>
            <div className="space-y-1.5 text-sm flex-1">
              {[
                { label: 'Nom',     value: name },
                { label: 'Design',  value: DESIGNS[design].label },
                { label: 'Prix',    value: DESIGNS[design].price },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-text-secondary">{row.label}</span>
                  <span className="font-semibold text-text-primary">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Adresse de livraison</label>
            <div className="relative">
              <IconMapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
              <input
                className="input pl-9"
                placeholder="Ex: Sacré-Cœur 3, Villa 25, Dakar"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center gap-2">
              <IconChevronLeft size={15} /> Retour
            </button>
            <button onClick={() => setOrdered(true)} className="btn-primary flex-1 justify-center gap-2 py-2.5">
              <IconCheck size={15} /> Confirmer
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
