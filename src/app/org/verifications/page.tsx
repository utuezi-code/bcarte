'use client'

import { useEffect, useState } from 'react'
import {
  IconShieldCheck, IconLoader2, IconCheck, IconX,
  IconMapPin, IconBriefcase, IconSchool, IconClock,
  IconCircleCheck, IconAlertCircle,
  IconPhone, IconBrandLinkedin, IconMail,
} from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

const AVATAR_COLORS = ['#6C47FF', '#059669', '#C9A84C', '#2563EB', '#DC2626']
function avatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

type Filter = 'EN_ATTENTE' | 'CONFIRMEE' | 'REJETEE' | 'all'

export default function OrgVerificationsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState<Filter>('EN_ATTENTE')
  const [acting,   setActing]   = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/org/verifications')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setRequests(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const act = async (id: string, status: 'CONFIRMEE' | 'REJETEE') => {
    setActing(id)
    const res = await fetch(`/api/org/verifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    }
    setActing(null)
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)
  const pendingCount = requests.filter(r => r.status === 'EN_ATTENTE').length

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'EN_ATTENTE', label: 'En attente' },
    { key: 'CONFIRMEE',  label: 'Confirmées'  },
    { key: 'REJETEE',    label: 'Rejetées'    },
    { key: 'all',        label: 'Toutes'       },
  ]

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-[220px] pb-16 lg:pb-0 min-h-screen">
      <div className="max-w-3xl mx-auto px-5 py-7 lg:px-8 lg:py-9 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Vérifications</h1>
          <p className="page-subtitle">Demandes de vérification reçues des professionnels</p>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-[#FFFBEB] text-[#D97706] text-xs font-bold px-3 py-1.5 rounded-full border border-[#FDE68A] flex-shrink-0">
            <IconClock size={12} /> {pendingCount} en attente
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-border-subtle rounded-xl w-fit">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-[10px] text-sm font-semibold transition-all ${
              filter === f.key
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}>
            {f.label}
            {f.key === 'EN_ATTENTE' && pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#D97706] text-white text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <IconLoader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-20 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-border-subtle flex items-center justify-center mx-auto">
            <IconShieldCheck size={26} className="text-text-tertiary" />
          </div>
          <p className="font-semibold text-text-primary text-sm">Aucune demande</p>
          <p className="text-xs text-text-secondary">
            {filter === 'EN_ATTENTE' ? 'Aucune demande en attente pour le moment' : 'Aucune demande dans cette catégorie'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req: any) => {
            const pro = req.profile
            if (!pro) return null
            const color = avatarColor(pro.fullName ?? '')
            const isLoading = acting === req.id
            const isPending = req.status === 'EN_ATTENTE'

            /* find the specific item being verified */
            const refItem = req.type === 'EXPÉRIENCE'
              ? (pro.experiences ?? []).find((e: any) => e.id === req.refId)
              : (pro.educations  ?? []).find((e: any) => e.id === req.refId)

            return (
              <div key={req.id} className="card space-y-5">

                {/* ── Status bar */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    req.status === 'EN_ATTENTE' ? 'bg-[#FFFBEB] text-[#D97706]' :
                    req.status === 'CONFIRMEE'  ? 'bg-[#ECFDF5] text-[#059669]' :
                                                  'bg-red-50 text-red-600'
                  }`}>
                    {req.status === 'EN_ATTENTE' ? <IconClock size={11} /> :
                     req.status === 'CONFIRMEE'  ? <IconCircleCheck size={11} /> :
                                                   <IconAlertCircle size={11} />}
                    {req.status === 'EN_ATTENTE' ? 'En attente' :
                     req.status === 'CONFIRMEE'  ? 'Confirmée' : 'Rejetée'}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                {/* ── Professional info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                    style={{ backgroundColor: color }}>
                    {pro.avatarUrl
                      ? <img src={pro.avatarUrl} alt={pro.fullName} className="w-full h-full object-cover object-top" />
                      : initials(pro.fullName ?? '')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text-primary">{pro.fullName}</p>
                    <p className="text-sm text-text-secondary mt-0.5">{pro.title || '—'}</p>
                    {(pro.city || pro.country) && (
                      <p className="text-xs text-text-tertiary flex items-center gap-1 mt-1">
                        <IconMapPin size={11} />
                        {[pro.city, pro.country].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {/* Contact */}
                    <div className="flex flex-wrap gap-3 mt-2">
                      {pro.emailPro && (
                        <a href={`mailto:${pro.emailPro}`}
                          className="text-xs text-text-secondary hover:text-primary flex items-center gap-1 transition-colors">
                          <IconMail size={11} /> {pro.emailPro}
                        </a>
                      )}
                      {pro.phone && (
                        <a href={`tel:${pro.phone}`}
                          className="text-xs text-text-secondary hover:text-primary flex items-center gap-1 transition-colors">
                          <IconPhone size={11} /> {pro.phone}
                        </a>
                      )}
                      {pro.linkedin && (
                        <a href={pro.linkedin} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary flex items-center gap-1 hover:underline">
                          <IconBrandLinkedin size={11} /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── What is being verified */}
                <div className="rounded-xl border border-primary/20 bg-primary-light/40 p-4 space-y-2">
                  <p className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                    {req.type === 'EXPÉRIENCE' ? <IconBriefcase size={11} /> : <IconSchool size={11} />}
                    {req.type === 'EXPÉRIENCE' ? 'Expérience à vérifier' : 'Formation à vérifier'}
                  </p>
                  <p className="text-sm font-semibold text-text-primary">{req.label}</p>
                  {refItem && (
                    <div className="text-xs text-text-secondary space-y-0.5 pt-1 border-t border-primary/10">
                      {req.type === 'EXPÉRIENCE' && (
                        <>
                          {refItem.city && <p>📍 {refItem.city}</p>}
                          {(refItem.startDate || refItem.endDate) && (
                            <p>
                              {refItem.startDate ? new Date(refItem.startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : ''}
                              {' — '}
                              {refItem.isCurrent ? 'En cours' : refItem.endDate ? new Date(refItem.endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : ''}
                            </p>
                          )}
                          {refItem.description && <p className="mt-1 text-text-tertiary line-clamp-2">{refItem.description}</p>}
                        </>
                      )}
                      {req.type === 'FORMATION' && (
                        <>
                          {refItem.field && <p>Spécialité : {refItem.field}</p>}
                          {(refItem.startYear || refItem.endYear) && (
                            <p>{refItem.startYear ?? ''}{refItem.endYear ? ` — ${refItem.endYear}` : refItem.isCurrent ? ' — Présent' : ''}</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* ── All experiences (context) */}
                {(pro.experiences ?? []).length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <IconBriefcase size={11} /> Autres expériences
                    </p>
                    <div className="space-y-2">
                      {(pro.experiences ?? [])
                        .filter((e: any) => e.id !== req.refId)
                        .slice(0, 3)
                        .map((e: any) => (
                          <div key={e.id} className="flex items-start gap-3 p-3 rounded-xl bg-bg-light border border-border">
                            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
                              {(e.company ?? '?').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-text-primary truncate">{e.title}</p>
                              <p className="text-[11px] text-text-secondary">{e.company}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* ── Actions */}
                {isPending && (
                  <div className="flex gap-3 pt-2 border-t border-border-subtle">
                    <button
                      onClick={() => act(req.id, 'REJETEE')}
                      disabled={!!acting}
                      className="flex-1 flex items-center justify-center gap-2 h-10 rounded-[10px] border border-danger/20 text-danger text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50">
                      {isLoading ? <IconLoader2 size={14} className="animate-spin" /> : <IconX size={14} />}
                      Rejeter
                    </button>
                    <button
                      onClick={() => act(req.id, 'CONFIRMEE')}
                      disabled={!!acting}
                      className="flex-1 flex items-center justify-center gap-2 h-10 rounded-[10px] bg-success text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                      {isLoading ? <IconLoader2 size={14} className="animate-spin" /> : <IconCheck size={14} />}
                      Confirmer
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      </div>
      </main>
      <BottomNav />
    </div>
  )
}
