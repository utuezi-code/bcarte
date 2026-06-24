'use client'

import { useEffect, useState } from 'react'
import { IconUser, IconLock, IconBell, IconShield, IconCheck, IconEye, IconEyeOff, IconLoader2 } from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

const TABS = ['Compte', 'Sécurité', 'Notifications', 'Confidentialité']

export default function SettingsPage() {
  const [tab, setTab]                     = useState(0)
  const [saved, setSaved]                 = useState(false)
  const [showPassword, setShowPassword]   = useState(false)
  const [me, setMe]                       = useState<any>(null)
  const [notifs, setNotifs]               = useState({
    verificationConfirmed: true,
    verificationRejected: true,
    profileViews: false,
    newsletter: false,
  })

  useEffect(() => {
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(d => { if (d) setMe(d) })
  }, [])

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
            <p className="text-sm text-text-secondary mt-1">Gérez votre compte et vos préférences</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-xl w-fit">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === i ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Compte */}
          {tab === 0 && (
            <div className="card space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                  <IconUser size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-text-primary">Informations du compte</h2>
                  <p className="text-xs text-text-secondary">{me?.email ?? '…'}</p>
                </div>
              </div>
              <div>
                <label className="label">Nom affiché</label>
                <input className="input" defaultValue={me?.name ?? ''} placeholder="Votre nom" />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input opacity-60 cursor-not-allowed" defaultValue={me?.email ?? ''} disabled />
              </div>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-5 py-2.5">
                {saved && <IconCheck size={16} />}
                {saved ? 'Enregistré !' : 'Enregistrer'}
              </button>
            </div>
          )}

          {/* Sécurité */}
          {tab === 1 && (
            <div className="card space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                  <IconLock size={20} className="text-text-secondary" />
                </div>
                <h2 className="font-semibold text-text-primary">Changer le mot de passe</h2>
              </div>
              <div>
                <label className="label">Mot de passe actuel</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Nouveau mot de passe</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <div>
                <label className="label">Confirmer le mot de passe</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-5 py-2.5">
                {saved && <IconCheck size={16} />}
                {saved ? 'Modifié !' : 'Modifier le mot de passe'}
              </button>
            </div>
          )}

          {/* Notifications */}
          {tab === 2 && (
            <div className="card space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                  <IconBell size={20} className="text-text-secondary" />
                </div>
                <h2 className="font-semibold text-text-primary">Préférences de notifications</h2>
              </div>
              {[
                { key: 'verificationConfirmed', label: 'Vérification confirmée',   desc: 'Quand une entreprise confirme votre expérience' },
                { key: 'verificationRejected',  label: 'Vérification rejetée',     desc: 'Quand une vérification est refusée' },
                { key: 'profileViews',          label: 'Vues de profil',           desc: 'Rapport hebdomadaire des vues' },
                { key: 'newsletter',            label: 'Newsletter bcarte',        desc: 'Actualités et conseils' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{n.label}</p>
                    <p className="text-xs text-text-secondary">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifs({...notifs, [n.key]: !notifs[n.key as keyof typeof notifs]})}
                    className={`w-10 h-5.5 rounded-full transition-colors relative ${notifs[n.key as keyof typeof notifs] ? 'bg-primary' : 'bg-[#E5E7EB]'}`}
                    style={{ width: 40, height: 22 }}
                  >
                    <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-all ${notifs[n.key as keyof typeof notifs] ? 'right-0.5' : 'left-0.5'}`}
                      style={{ width: 18, height: 18 }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Confidentialité */}
          {tab === 3 && (
            <div className="card space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                  <IconShield size={20} className="text-text-secondary" />
                </div>
                <h2 className="font-semibold text-text-primary">Confidentialité</h2>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-text-primary">Profil public</p>
                  <p className="text-xs text-text-secondary">Votre profil est visible dans les résultats de recherche</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-primary relative" style={{ width: 40, height: 22 }}>
                  <span className="absolute right-0.5 top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow" style={{ width: 18, height: 18 }} />
                </div>
              </div>
              <div className="pt-4 border-t border-[#F3F4F6]">
                <p className="text-sm font-medium text-danger mb-2">Zone de danger</p>
                <button className="text-sm text-danger border border-danger/30 rounded-lg px-4 py-2 hover:bg-red-50 transition-colors">
                  Supprimer mon compte
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
