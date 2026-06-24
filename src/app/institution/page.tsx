'use client'

import { useState } from 'react'
import { IconCircleCheck, IconX, IconClock, IconUsers } from '@tabler/icons-react'
import { MOCK_VERIFICATION_REQUESTS, MOCK_PROFILES } from '@/lib/mock-data'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

const TABS = ["En attente", "Historique", "Membres"]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function InstitutionPage() {
  const [tab, setTab] = useState(0)
  const [requests, setRequests] = useState(MOCK_VERIFICATION_REQUESTS)

  const pending = requests.filter(r => r.status === 'en_attente')
  const history = requests.filter(r => r.status !== 'en_attente')
  const members = MOCK_PROFILES.filter(p => p.verified).slice(0, 6)

  const handleAction = (id: string, action: 'confirmée' | 'rejetée') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action, resolvedAt: '2026-06-24' } : r))
  }

  const STATUS_MAP = {
    confirmée: { label: 'Confirmée', className: 'text-success bg-success-light' },
    rejetée: { label: 'Rejetée', className: 'text-danger bg-red-50' },
    en_attente: { label: 'En attente', className: 'text-[#D97706] bg-[#FFFBEB]' },
    non_demandée: { label: 'Non demandée', className: 'text-text-tertiary bg-[#F3F4F6]' },
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Espace Institution</h1>
              <p className="text-text-secondary text-sm mt-1">Gérez les demandes de vérification</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-text-primary">École Polytechnique de Thiès</p>
              <span className="badge-verified text-xs">
                <IconCircleCheck size={11} />
                Institution vérifiée
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#E5E7EB]">
            {TABS.map((t, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  tab === i ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {t}
                {i === 0 && pending.length > 0 && (
                  <span className="ml-2 text-xs bg-[#D97706] text-white px-1.5 py-0.5 rounded-badge">{pending.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Pending */}
          {tab === 0 && (
            <div className="space-y-3">
              {pending.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                  <IconCircleCheck size={40} className="mx-auto mb-3 text-success" />
                  <p className="font-medium">Aucune demande en attente</p>
                  <p className="text-sm text-text-tertiary mt-1">Toutes les demandes ont été traitées</p>
                </div>
              ) : (
                pending.map((req) => (
                  <div key={req.id} className="card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-badge capitalize ${req.type === 'experience' ? 'bg-primary-light text-primary' : 'bg-secondary-light text-secondary'}`}>
                          {req.type === 'experience' ? 'Expérience' : 'Formation'}
                        </span>
                        <p className="font-semibold text-text-primary mt-2">{req.itemTitle}</p>
                        <p className="text-sm text-text-secondary mt-1">
                          Demandé par <span className="font-medium">{req.profileName}</span> · {req.profileTitle}
                        </p>
                        <p className="text-xs text-text-tertiary mt-1 flex items-center gap-1">
                          <IconClock size={12} />
                          Envoyé le {req.sentAt}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleAction(req.id, 'confirmée')}
                          className="flex items-center gap-1.5 text-sm font-medium text-success bg-success-light hover:bg-[#D1FAE5] px-3 py-2 rounded-btn transition-colors"
                        >
                          <IconCircleCheck size={15} />
                          Confirmer
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'rejetée')}
                          className="flex items-center gap-1.5 text-sm font-medium text-danger bg-red-50 hover:bg-red-100 px-3 py-2 rounded-btn transition-colors"
                        >
                          <IconX size={15} />
                          Rejeter
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* History */}
          {tab === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">{history.length} demandes traitées</p>
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="text-left py-3 pr-4 text-xs font-medium text-text-secondary">Demandeur</th>
                      <th className="text-left py-3 pr-4 text-xs font-medium text-text-secondary">Intitulé</th>
                      <th className="text-left py-3 pr-4 text-xs font-medium text-text-secondary">Date</th>
                      <th className="text-left py-3 text-xs font-medium text-text-secondary">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {history.map((req) => {
                      const s = STATUS_MAP[req.status]
                      return (
                        <tr key={req.id}>
                          <td className="py-3 pr-4 font-medium text-text-primary">{req.profileName}</td>
                          <td className="py-3 pr-4 text-text-secondary max-w-xs truncate">{req.itemTitle}</td>
                          <td className="py-3 pr-4 text-text-tertiary">{req.resolvedAt}</td>
                          <td className="py-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-badge ${s.className}`}>{s.label}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Members */}
          {tab === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IconUsers size={18} className="text-primary" />
                <p className="text-sm text-text-secondary"><span className="font-semibold text-text-primary">{members.length}</span> membres vérifiés liés à cette institution</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {members.map((p) => (
                  <div key={p.id} className="card flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {getInitials(p.fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary text-sm truncate">{p.fullName}</p>
                      <p className="text-xs text-text-secondary truncate">{p.title}</p>
                    </div>
                    <span className="badge-verified flex-shrink-0">
                      <IconCircleCheck size={11} />
                      Vérifié
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
