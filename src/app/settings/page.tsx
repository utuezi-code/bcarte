'use client'

import { useState } from 'react'
import {
  IconUser, IconLock, IconBell, IconShield,
  IconCheck, IconEye, IconEyeOff, IconTrash,
} from '@tabler/icons-react'
import { CURRENT_USER } from '@/lib/mock-data'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

const TABS = ['Compte', 'Sécurité', 'Notifications', 'Confidentialité']

export default function SettingsPage() {
  const [tab, setTab] = useState(0)
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [notifs, setNotifs] = useState({
    verificationConfirmed: true,
    verificationRejected: true,
    profileViews: false,
    newsletter: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-2xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">

          <div>
            <h1 className="text-2xl font-bold text-text-primary">Paramètres</h1>
            <p className="text-text-secondary text-sm mt-1">Gérez votre compte et vos préférences</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
            {TABS.map((t, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  tab === i ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* ── Compte ── */}
          {tab === 0 && (
            <div className="space-y-4">
              <div className="card space-y-4">
                <h2 className="font-semibold text-text-primary flex items-center gap-2">
                  <IconUser size={17} className="text-primary" />
                  Informations du compte
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nom complet</label>
                    <input className="input" defaultValue={CURRENT_USER.fullName} />
                  </div>
                  <div>
                    <label className="label">Adresse email</label>
                    <input className="input" type="email" defaultValue={CURRENT_USER.email} />
                  </div>
                </div>
                <div>
                  <label className="label">Rôle</label>
                  <div className="input bg-bg-light text-text-secondary cursor-not-allowed">Professionnel</div>
                </div>
                <div className="flex justify-end">
                  <button onClick={handleSave} className="btn-primary">
                    {saved ? <><IconCheck size={15} /> Enregistré</> : 'Enregistrer'}
                  </button>
                </div>
              </div>

              <div className="card border-danger/20 bg-red-50/40 space-y-3">
                <h2 className="font-semibold text-danger flex items-center gap-2">
                  <IconTrash size={17} />
                  Zone dangereuse
                </h2>
                <p className="text-sm text-text-secondary">
                  La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
                </p>
                <button className="text-sm font-medium text-danger border border-danger/30 bg-white hover:bg-red-50 px-4 py-2 rounded-btn transition-colors">
                  Supprimer mon compte
                </button>
              </div>
            </div>
          )}

          {/* ── Sécurité ── */}
          {tab === 1 && (
            <div className="card space-y-5">
              <h2 className="font-semibold text-text-primary flex items-center gap-2">
                <IconLock size={17} className="text-primary" />
                Changer le mot de passe
              </h2>
              <div>
                <label className="label">Mot de passe actuel</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                    aria-label="Afficher le mot de passe"
                  >
                    {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="input pr-10"
                    placeholder="Minimum 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                    aria-label="Afficher le nouveau mot de passe"
                  >
                    {showNewPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Confirmer le nouveau mot de passe</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <div className="flex justify-end">
                <button onClick={handleSave} className="btn-primary">
                  {saved ? <><IconCheck size={15} /> Mis à jour</> : 'Mettre à jour'}
                </button>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {tab === 2 && (
            <div className="card space-y-1">
              <h2 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
                <IconBell size={17} className="text-primary" />
                Préférences de notifications
              </h2>
              {[
                { key: 'verificationConfirmed', label: 'Vérification confirmée', desc: 'Quand une institution confirme votre expérience ou diplôme' },
                { key: 'verificationRejected',  label: 'Vérification rejetée',   desc: 'Quand une institution rejette votre demande' },
                { key: 'profileViews',          label: 'Vues du profil',         desc: 'Résumé hebdomadaire des vues de votre profil' },
                { key: 'newsletter',            label: 'Newsletter bcarte',      desc: 'Actualités et nouvelles fonctionnalités' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-4 border-b border-[#F3F4F6] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{label}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifs(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                    className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ml-4 ${notifs[key as keyof typeof notifs] ? 'bg-primary' : 'bg-[#E5E7EB]'}`}
                    role="switch"
                    aria-checked={notifs[key as keyof typeof notifs]}
                    aria-label={label}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifs[key as keyof typeof notifs] ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Confidentialité ── */}
          {tab === 3 && (
            <div className="space-y-4">
              <div className="card space-y-1">
                <h2 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
                  <IconShield size={17} className="text-primary" />
                  Visibilité du profil
                </h2>
                {[
                  { label: 'Profil visible dans l\'annuaire', desc: 'Les recruteurs et visiteurs peuvent vous trouver via /explore' },
                  { label: 'Afficher le nombre de vues',      desc: 'Visible sur votre tableau de bord uniquement' },
                  { label: 'Profil indexé par les moteurs',   desc: 'Votre profil peut apparaître dans les résultats Google' },
                ].map(({ label, desc }, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-[#F3F4F6] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{label}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">{desc}</p>
                    </div>
                    <button
                      className="w-11 h-6 rounded-full bg-primary relative flex-shrink-0 ml-4"
                      role="switch"
                      aria-checked={true}
                      aria-label={label}
                    >
                      <span className="absolute top-1 w-4 h-4 bg-white rounded-full shadow translate-x-6" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="card text-sm text-text-secondary space-y-2">
                <p className="font-semibold text-text-primary text-[13px]">Vos données vous appartiennent</p>
                <p>Vous pouvez exporter ou supprimer vos données à tout moment. bcarte ne vend jamais vos informations à des tiers.</p>
                <button className="text-primary font-medium hover:underline text-xs mt-1">
                  Télécharger mes données →
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      <BottomNav />
    </div>
  )
}
