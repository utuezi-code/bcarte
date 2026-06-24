'use client'

import { useState } from 'react'
import { IconCreditCard, IconCheck, IconChevronRight, IconChevronLeft, IconBrandWhatsapp, IconMail, IconLink } from '@tabler/icons-react'
import { CURRENT_USER } from '@/lib/mock-data'

const STEPS = ['Aperçu', 'Design', 'Informations', 'Commander']

type Design = 'violet' | 'or'

export default function NFCPage() {
  const [step, setStep] = useState(0)
  const [design, setDesign] = useState<Design>('violet')
  const [ordered, setOrdered] = useState(false)

  const handleOrder = () => {
    setOrdered(true)
  }

  if (ordered) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto">
          <IconCheck size={32} className="text-success" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Commande confirmée !</h2>
        <p className="text-text-secondary">
          Votre carte NFC est en cours de fabrication. Livraison sous <strong>7–10 jours</strong> à l&apos;adresse indiquée.
        </p>
        <div className="card text-left text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-text-secondary">Référence</span>
            <span className="font-medium text-text-primary">#NFC-2026-0847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Design</span>
            <span className="font-medium text-text-primary capitalize">{design === 'violet' ? 'Violet Premium' : 'Or Premium'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Statut</span>
            <span className="text-[#D97706] font-medium">En fabrication</span>
          </div>
        </div>
        <button onClick={() => { setOrdered(false); setStep(0) }} className="btn-secondary">
          Retour
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Carte NFC physique</h1>
        <p className="text-text-secondary text-sm mt-1">Commandez votre carte de visite connectée à votre profil bcarte</p>
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
              <div className={`w-6 h-0.5 ${i < step ? 'bg-success' : 'bg-[#E5E7EB]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Preview */}
      {step === 0 && (
        <div className="card space-y-6">
          <h2 className="section-title">Aperçu de votre carte</h2>
          <div className="flex justify-center">
            <div className={`w-80 h-48 rounded-2xl shadow-xl flex flex-col justify-between p-6 relative overflow-hidden ${
              design === 'violet'
                ? 'bg-gradient-to-br from-[#7C5CBF] to-[#4C3580]'
                : 'bg-gradient-to-br from-[#C9A84C] to-[#8B6914]'
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 bg-white -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 bg-white translate-y-8 -translate-x-8" />
              <div>
                <p className="text-white font-extrabold text-lg tracking-tight">bcarte</p>
              </div>
              <div>
                <p className="text-white font-bold text-lg">{CURRENT_USER.fullName}</p>
                <p className="text-white/80 text-sm mt-0.5">{CURRENT_USER.title}</p>
                <p className="text-white/60 text-xs mt-3">bcarte.io/{CURRENT_USER.publicUrlSlug}</p>
              </div>
              <div className="absolute bottom-4 right-4">
                <IconCreditCard size={28} className="text-white/30" />
              </div>
            </div>
          </div>
          <p className="text-sm text-text-secondary text-center">
            Votre carte NFC renvoie vers votre profil public. Si vous mettez à jour votre profil, la carte se met à jour automatiquement.
          </p>
          <div className="flex justify-end">
            <button className="btn-primary" onClick={() => setStep(1)}>
              Choisir le design
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Design */}
      {step === 1 && (
        <div className="card space-y-6">
          <h2 className="section-title">Choisissez votre design</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {([
              { value: 'violet' as Design, label: 'Violet Premium', gradient: 'from-[#7C5CBF] to-[#4C3580]' },
              { value: 'or' as Design, label: 'Or Premium', gradient: 'from-[#C9A84C] to-[#8B6914]' },
            ]).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDesign(opt.value)}
                className={`border-2 rounded-card-lg overflow-hidden transition-all ${
                  design === opt.value ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-[#E5E7EB]'
                }`}
              >
                <div className={`bg-gradient-to-br ${opt.gradient} h-28 flex items-end p-4`}>
                  <div>
                    <p className="text-white font-bold text-sm">{CURRENT_USER.fullName}</p>
                    <p className="text-white/70 text-xs">{CURRENT_USER.title}</p>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-primary">{opt.label}</span>
                  {design === opt.value && (
                    <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <IconCheck size={12} className="text-white" />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(0)}>
              <IconChevronLeft size={16} />
              Retour
            </button>
            <button className="btn-primary" onClick={() => setStep(2)}>
              Suivant
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: vCard info */}
      {step === 2 && (
        <div className="card space-y-5">
          <h2 className="section-title">Informations de la carte</h2>
          <p className="text-sm text-text-secondary">Ces informations seront encodées dans la puce NFC de votre carte.</p>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nom complet</label>
                <input className="input" defaultValue={CURRENT_USER.fullName} />
              </div>
              <div>
                <label className="label">Titre</label>
                <input className="input" defaultValue={CURRENT_USER.title} />
              </div>
            </div>
            <div>
              <label className="label">WhatsApp</label>
              <div className="relative">
                <IconBrandWhatsapp className="absolute left-3 top-1/2 -translate-y-1/2 text-whatsapp" size={16} />
                <input className="input pl-9" defaultValue={CURRENT_USER.whatsapp} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                <input className="input pl-9" type="email" defaultValue={CURRENT_USER.contactEmail} />
              </div>
            </div>
            <div>
              <label className="label">URL du profil bcarte</label>
              <div className="relative">
                <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                <input className="input pl-9" defaultValue={`https://bcarte.io/${CURRENT_USER.publicUrlSlug}`} readOnly />
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              <IconChevronLeft size={16} />
              Retour
            </button>
            <button className="btn-primary" onClick={() => setStep(3)}>
              Récapitulatif
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Summary & Order */}
      {step === 3 && (
        <div className="card space-y-6">
          <h2 className="section-title">Récapitulatif</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm py-2 border-b border-[#E5E7EB]">
              <span className="text-text-secondary">Carte NFC bcarte</span>
              <span className="font-medium text-text-primary">1 unité</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-[#E5E7EB]">
              <span className="text-text-secondary">Design</span>
              <span className="font-medium text-text-primary">{design === 'violet' ? 'Violet Premium' : 'Or Premium'}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-[#E5E7EB]">
              <span className="text-text-secondary">Délai de livraison</span>
              <span className="font-medium text-text-primary">7–10 jours ouvrés</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-text-secondary">Mise à jour automatique</span>
              <span className="text-success font-medium flex items-center gap-1">
                <IconCheck size={14} />
                Incluse
              </span>
            </div>
          </div>
          <div className="bg-primary-light border border-primary-border rounded-card p-4 text-sm text-primary">
            <p className="font-semibold mb-1">Comment ça fonctionne ?</p>
            <p>Votre carte NFC est liée à votre profil bcarte. Lorsqu&apos;un contact scanne la carte, il accède directement à votre profil public à jour — même si vos informations changent après la commande.</p>
          </div>
          <div className="flex justify-between">
            <button className="btn-secondary" onClick={() => setStep(2)}>
              <IconChevronLeft size={16} />
              Retour
            </button>
            <button className="btn-primary px-6" onClick={handleOrder}>
              <IconCreditCard size={16} />
              Commander
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
