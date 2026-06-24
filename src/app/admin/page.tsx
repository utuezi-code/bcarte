'use client'

import { useState } from 'react'
import {
  IconUsers, IconCircleCheck, IconCreditCard, IconBuilding,
  IconSearch, IconShield, IconBan, IconCheck, IconMail,
  IconChartBar, IconAlertTriangle
} from '@tabler/icons-react'
import { MOCK_PROFILES } from '@/lib/mock-data'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

const TABS = ['Statistiques', 'Utilisateurs', 'Institutions', 'Modération', 'Invitations']

const STATS = [
  { label: 'Profils créés', value: '1 247', icon: IconUsers, color: 'text-primary bg-primary-light' },
  { label: 'Vérifications', value: '342', icon: IconCircleCheck, color: 'text-success bg-success-light' },
  { label: 'Cartes NFC', value: '89', icon: IconCreditCard, color: 'text-secondary bg-secondary-light' },
  { label: 'Institutions', value: '23', icon: IconBuilding, color: 'text-[#2563EB] bg-[#EFF6FF]' },
]

const PENDING_INSTITUTIONS = [
  { id: 1, name: 'Université de Lomé', country: 'Togo', email: 'admin@univ-lome.tg', requestedAt: '2026-06-20' },
  { id: 2, name: 'ISCAE Casablanca', country: 'Maroc', email: 'direction@iscae.ma', requestedAt: '2026-06-18' },
]

const REPORTED_CONTENT = [
  { id: 1, type: 'Profil', content: 'Ibrahim Touré', reason: 'Fausses informations', reportedAt: '2026-06-22' },
  { id: 2, type: 'Expérience', content: 'Chef de projet chez XYZ Corp', reason: 'Entreprise inexistante', reportedAt: '2026-06-21' },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function AdminPage() {
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitesSent, setInvitesSent] = useState(12)

  const users = MOCK_PROFILES.filter(p =>
    !search || p.fullName.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase())
  )

  const sendInvite = () => {
    if (inviteEmail.trim() && invitesSent < 100) {
      setInvitesSent(prev => prev + 1)
      setInviteEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Administration</h1>
              <p className="text-text-secondary text-sm mt-1">Gestion globale de la plateforme bcarte</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#EFF6FF] text-[#2563EB] px-3 py-1.5 rounded-badge">
              <IconShield size={13} />
              Administrateur
            </span>
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

          {/* Stats */}
          {tab === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="card">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-text-secondary">{stat.label}</p>
                          <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-9 h-9 rounded-card flex items-center justify-center ${stat.color}`}>
                          <Icon size={18} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="card">
                <h3 className="section-title mb-4 flex items-center gap-2">
                  <IconChartBar size={18} className="text-primary" />
                  Activité récente (30 jours)
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Nouveaux profils', value: 47, max: 100 },
                    { label: 'Vérifications envoyées', value: 31, max: 100 },
                    { label: 'CV générés', value: 128, max: 200, displayMax: '128/mois' },
                    { label: 'Cartes NFC commandées', value: 12, max: 50 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-text-secondary">{item.label}</span>
                        <span className="font-semibold text-text-primary">{item.displayMax || item.value}</span>
                      </div>
                      <div className="bg-[#F3F4F6] rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${(item.value / item.max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                <input className="input pl-9 bg-white" placeholder="Rechercher un utilisateur..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="text-left py-3 pr-4 text-xs font-medium text-text-secondary">Utilisateur</th>
                      <th className="text-left py-3 pr-4 text-xs font-medium text-text-secondary hidden sm:table-cell">Ville</th>
                      <th className="text-left py-3 pr-4 text-xs font-medium text-text-secondary hidden md:table-cell">Secteur</th>
                      <th className="text-left py-3 pr-4 text-xs font-medium text-text-secondary">Statut</th>
                      <th className="text-left py-3 text-xs font-medium text-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {users.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {getInitials(p.fullName)}
                            </div>
                            <div>
                              <p className="font-medium text-text-primary">{p.fullName}</p>
                              <p className="text-xs text-text-tertiary">{p.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-text-secondary hidden sm:table-cell">{p.city}</td>
                        <td className="py-3 pr-4 text-text-secondary hidden md:table-cell">{p.sector}</td>
                        <td className="py-3 pr-4">
                          {p.verified ? (
                            <span className="badge-verified"><IconCircleCheck size={11} />Vérifié</span>
                          ) : (
                            <span className="text-xs text-text-tertiary bg-[#F3F4F6] px-2 py-0.5 rounded-badge">Standard</span>
                          )}
                        </td>
                        <td className="py-3">
                          <button className="btn-ghost py-1 px-2 hover:text-danger hover:bg-red-50 text-xs" aria-label="Suspendre">
                            <IconBan size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Institutions */}
          {tab === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">{PENDING_INSTITUTIONS.length} institutions en attente de validation</p>
              {PENDING_INSTITUTIONS.map((inst) => (
                <div key={inst.id} className="card flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-text-primary">{inst.name}</p>
                    <p className="text-sm text-text-secondary">{inst.country} · {inst.email}</p>
                    <p className="text-xs text-text-tertiary mt-1">Demande du {inst.requestedAt}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1.5 text-sm font-medium text-success bg-success-light hover:bg-[#D1FAE5] px-3 py-2 rounded-btn transition-colors">
                      <IconCheck size={14} />
                      Valider
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-danger bg-red-50 hover:bg-red-100 px-3 py-2 rounded-btn transition-colors">
                      Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Moderation */}
          {tab === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">{REPORTED_CONTENT.length} contenus signalés</p>
              {REPORTED_CONTENT.map((item) => (
                <div key={item.id} className="card border-l-4 border-l-[#F59E0B]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <IconAlertTriangle size={15} className="text-[#F59E0B]" />
                        <span className="text-xs font-medium text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-badge">{item.type}</span>
                      </div>
                      <p className="font-semibold text-text-primary mt-2">{item.content}</p>
                      <p className="text-sm text-text-secondary mt-0.5">Motif : {item.reason}</p>
                      <p className="text-xs text-text-tertiary mt-1">Signalé le {item.reportedAt}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="btn-secondary text-xs py-1.5 px-3">Ignorer</button>
                      <button className="text-xs font-medium text-danger bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-btn transition-colors">
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Invitations */}
          {tab === 4 && (
            <div className="max-w-md space-y-6">
              <div className="card">
                <h3 className="section-title mb-2">Profils pilotes</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Programme de lancement : 100 invitations pour les premiers profils pilotes bcarte.
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Invitations utilisées</span>
                    <span className="font-bold text-text-primary">{invitesSent} / 100</span>
                  </div>
                  <div className="bg-[#F3F4F6] rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${invitesSent}%` }} />
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">{100 - invitesSent} invitations restantes</p>
                </div>
              </div>

              <div className="card space-y-4">
                <h3 className="font-semibold text-text-primary">Envoyer une invitation</h3>
                <div>
                  <label htmlFor="inviteEmail" className="label">Adresse email</label>
                  <div className="relative">
                    <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                    <input
                      id="inviteEmail"
                      type="email"
                      className="input pl-9"
                      placeholder="email@exemple.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="btn-primary w-full justify-center"
                  onClick={sendInvite}
                  disabled={!inviteEmail.trim() || invitesSent >= 100}
                >
                  <IconMail size={16} />
                  Envoyer l&apos;invitation
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
