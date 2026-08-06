'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  IconShieldCheck, IconLoader2, IconCheck, IconX,
  IconMapPin, IconBriefcase, IconSchool, IconClock,
  IconCircleCheck, IconAlertCircle,
  IconPhone, IconBrandLinkedin, IconMail,
  IconSearch, IconCheckbox, IconSquare,
  IconChevronDown, IconLink, IconCopy, IconExternalLink,
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

type StatusFilter = 'EN_ATTENTE' | 'CONFIRMEE' | 'REJETEE' | 'all'
type TypeFilter   = 'all' | 'EXPÉRIENCE' | 'FORMATION'
type SortOrder    = 'newest' | 'oldest'

export default function OrgVerificationsPage() {
  const [requests,    setRequests]    = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)
  const [statusFilter,setStatusFilter]= useState<StatusFilter>('EN_ATTENTE')
  const [typeFilter,  setTypeFilter]  = useState<TypeFilter>('all')
  const [sort,        setSort]        = useState<SortOrder>('newest')
  const [search,      setSearch]      = useState('')
  const [selected,    setSelected]    = useState<Set<string>>(new Set())
  const [acting,      setActing]      = useState<string | null>(null)
  const [bulkActing,  setBulkActing]  = useState(false)
  const [expanded,    setExpanded]    = useState<Set<string>>(new Set())

  /* ── magic link ── */
  const [linkUrl,     setLinkUrl]     = useState<string | null>(null)
  const [linkLoading, setLinkLoading] = useState(false)
  const [copied,      setCopied]      = useState(false)

  const generateLink = async () => {
    setLinkLoading(true)
    const res = await fetch('/api/org/verify-link')
    if (res.ok) {
      const d = await res.json()
      setLinkUrl(d.url)
    }
    setLinkLoading(false)
  }

  const copyLink = () => {
    if (!linkUrl) return
    navigator.clipboard.writeText(linkUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    fetch('/api/org/verifications')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setRequests(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  /* ── computed stats ── */
  const stats = useMemo(() => ({
    total:    requests.length,
    pending:  requests.filter(r => r.status === 'EN_ATTENTE').length,
    confirmed:requests.filter(r => r.status === 'CONFIRMEE').length,
    rejected: requests.filter(r => r.status === 'REJETEE').length,
  }), [requests])

  /* ── filtered + sorted list ── */
  const filtered = useMemo(() => {
    let list = requests
    if (statusFilter !== 'all') list = list.filter(r => r.status === statusFilter)
    if (typeFilter   !== 'all') list = list.filter(r => r.type   === typeFilter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(r =>
        r.profile?.fullName?.toLowerCase().includes(q) ||
        r.label?.toLowerCase().includes(q) ||
        r.profile?.title?.toLowerCase().includes(q)
      )
    }
    return sort === 'newest'
      ? [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      : [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }, [requests, statusFilter, typeFilter, search, sort])

  const pendingFiltered = filtered.filter(r => r.status === 'EN_ATTENTE')
  const allPendingSelected = pendingFiltered.length > 0 &&
    pendingFiltered.every(r => selected.has(r.id))

  /* ── actions ── */
  const toggleSelect = (id: string) =>
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const toggleSelectAll = () => {
    if (allPendingSelected) {
      setSelected(prev => { const s = new Set(prev); pendingFiltered.forEach(r => s.delete(r.id)); return s })
    } else {
      setSelected(prev => { const s = new Set(prev); pendingFiltered.forEach(r => s.add(r.id)); return s })
    }
  }

  const toggleExpand = (id: string) =>
    setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const act = async (id: string, status: 'CONFIRMEE' | 'REJETEE') => {
    setActing(id)
    const res = await fetch(`/api/org/verifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      setSelected(prev => { const s = new Set(prev); s.delete(id); return s })
    }
    setActing(null)
  }

  const bulkAct = async (status: 'CONFIRMEE' | 'REJETEE') => {
    const ids = Array.from(selected)
    if (!ids.length) return
    setBulkActing(true)
    const res = await fetch('/api/org/verifications/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, status }),
    })
    if (res.ok) {
      setRequests(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r))
      setSelected(new Set())
    }
    setBulkActing(false)
  }

  const STATUS_TABS: { key: StatusFilter; label: string }[] = [
    { key: 'EN_ATTENTE', label: 'En attente' },
    { key: 'CONFIRMEE',  label: 'Confirmées' },
    { key: 'REJETEE',    label: 'Rejetées'   },
    { key: 'all',        label: 'Toutes'      },
  ]

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-[220px] pb-16 lg:pb-0 min-h-screen">
      <div className="max-w-3xl mx-auto px-5 py-7 lg:px-8 lg:py-9 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="page-title">Vérifications</h1>
            <p className="page-subtitle">Demandes de vérification reçues des professionnels</p>
          </div>
          {stats.pending > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-[#FFFBEB] text-[#D97706] text-xs font-bold px-3 py-1.5 rounded-full border border-[#FDE68A] flex-shrink-0">
              <IconClock size={12} /> {stats.pending} en attente
            </span>
          )}
        </div>

        {/* ── Magic link panel ── */}
        <div className="card p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
              <IconLink size={17} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-text-primary text-sm">Lien de vérification automatique</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Partagez ce lien avec vos employés. En cliquant dessus, leurs expériences chez vous sont confirmées instantanément.
              </p>
            </div>
          </div>

          {linkUrl ? (
            <div className="flex items-center gap-2 bg-bg-light border border-border rounded-xl px-3 py-2">
              <p className="text-xs text-text-secondary font-mono flex-1 truncate">{linkUrl}</p>
              <button onClick={copyLink}
                className={`flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-xs font-semibold flex-shrink-0 transition-all ${
                  copied
                    ? 'bg-success text-white'
                    : 'bg-primary-light text-primary hover:bg-primary hover:text-white'
                }`}>
                {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
              <a href={linkUrl} target="_blank" rel="noopener noreferrer"
                className="h-8 w-8 flex items-center justify-center rounded-[8px] bg-border-subtle hover:bg-border transition-colors flex-shrink-0">
                <IconExternalLink size={13} className="text-text-secondary" />
              </a>
            </div>
          ) : (
            <button onClick={generateLink} disabled={linkLoading}
              className="btn-primary w-full justify-center text-sm">
              {linkLoading
                ? <IconLoader2 size={14} className="animate-spin" />
                : <IconLink size={14} />}
              Générer le lien
            </button>
          )}
        </div>

        {/* ── Stats ── */}
        {!loading && (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total',      value: stats.total,     color: 'text-text-primary',  bg: 'bg-border-subtle' },
              { label: 'En attente', value: stats.pending,   color: 'text-[#D97706]',     bg: 'bg-[#FFFBEB]' },
              { label: 'Confirmées', value: stats.confirmed, color: 'text-[#059669]',     bg: 'bg-[#ECFDF5]' },
              { label: 'Rejetées',   value: stats.rejected,  color: 'text-red-600',       bg: 'bg-red-50' },
            ].map(s => (
              <div key={s.label} className={`card text-center py-4 ${s.bg} border-0`}>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Controls ── */}
        <div className="card p-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <IconSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            <input
              className="input pl-9"
              placeholder="Rechercher par nom, poste, diplôme…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Status tabs */}
            <div className="flex gap-1 p-1 bg-border-subtle rounded-xl">
              {STATUS_TABS.map(t => (
                <button key={t.key} onClick={() => setStatusFilter(t.key)}
                  className={`px-3 py-1 rounded-[8px] text-xs font-semibold transition-all ${
                    statusFilter === t.key
                      ? 'bg-white text-text-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}>
                  {t.label}
                  {t.key === 'EN_ATTENTE' && stats.pending > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#D97706] text-white text-[10px] font-bold">
                      {stats.pending}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex gap-1 p-1 bg-border-subtle rounded-xl">
              {(['all', 'EXPÉRIENCE', 'FORMATION'] as TypeFilter[]).map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1 rounded-[8px] text-xs font-semibold transition-all ${
                    typeFilter === t
                      ? 'bg-white text-text-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}>
                  {t === 'all' ? 'Tous types' : t === 'EXPÉRIENCE' ? 'Expériences' : 'Formations'}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select className="input w-auto text-xs py-1.5"
              value={sort} onChange={e => setSort(e.target.value as SortOrder)}>
              <option value="newest">Plus récentes</option>
              <option value="oldest">Plus anciennes</option>
            </select>
          </div>
        </div>

        {/* ── Bulk action bar ── */}
        {selected.size > 0 && (
          <div className="sticky top-4 z-20 card p-3 flex items-center gap-3 bg-white shadow-card-hover border-primary/30">
            <span className="text-sm font-semibold text-text-primary flex-1">
              {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
            </span>
            <button onClick={() => setSelected(new Set())}
              className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
              Désélectionner
            </button>
            <button onClick={() => bulkAct('REJETEE')} disabled={bulkActing}
              className="flex items-center gap-1.5 h-8 px-4 rounded-[8px] border border-danger/20 text-danger text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50">
              {bulkActing ? <IconLoader2 size={12} className="animate-spin" /> : <IconX size={12} />}
              Rejeter tout
            </button>
            <button onClick={() => bulkAct('CONFIRMEE')} disabled={bulkActing}
              className="flex items-center gap-1.5 h-8 px-4 rounded-[8px] bg-success text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {bulkActing ? <IconLoader2 size={12} className="animate-spin" /> : <IconCheck size={12} />}
              Confirmer tout
            </button>
          </div>
        )}

        {/* ── Select all bar ── */}
        {pendingFiltered.length > 1 && statusFilter === 'EN_ATTENTE' && (
          <button onClick={toggleSelectAll}
            className="flex items-center gap-2 text-xs text-text-secondary hover:text-primary transition-colors">
            {allPendingSelected
              ? <IconCheckbox size={15} className="text-primary" />
              : <IconSquare size={15} />}
            {allPendingSelected ? 'Désélectionner tout' : `Sélectionner les ${pendingFiltered.length} demandes en attente`}
          </button>
        )}

        {/* ── Results ── */}
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
              {search ? `Aucun résultat pour « ${search} »` : 'Aucune demande dans cette catégorie'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req: any) => {
              const pro = req.profile
              if (!pro) return null
              const color     = avatarColor(pro.fullName ?? '')
              const isLoading = acting === req.id
              const isPending = req.status === 'EN_ATTENTE'
              const isSelected= selected.has(req.id)
              const isExpanded= expanded.has(req.id)

              const refItem = req.type === 'EXPÉRIENCE'
                ? (pro.experiences ?? []).find((e: any) => e.id === req.refId)
                : (pro.educations  ?? []).find((e: any) => e.id === req.refId)

              const otherExp = (pro.experiences ?? []).filter((e: any) => e.id !== req.refId)

              return (
                <div key={req.id}
                  className={`card transition-all ${isSelected ? 'border-primary/40 bg-primary-light/20' : ''}`}>

                  {/* ── Top row: checkbox + status + date ── */}
                  <div className="flex items-center gap-3 mb-4">
                    {isPending && (
                      <button onClick={() => toggleSelect(req.id)}
                        className="flex-shrink-0 text-text-tertiary hover:text-primary transition-colors">
                        {isSelected
                          ? <IconCheckbox size={18} className="text-primary" />
                          : <IconSquare size={18} />}
                      </button>
                    )}
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
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      req.type === 'EXPÉRIENCE'
                        ? 'bg-primary-light text-primary'
                        : 'bg-border-subtle text-text-secondary'
                    }`}>
                      {req.type === 'EXPÉRIENCE' ? 'Expérience' : 'Formation'}
                    </span>
                    <span className="text-xs text-text-tertiary ml-auto flex-shrink-0">
                      {new Date(req.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* ── Professional ── */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: color }}>
                      {pro.avatarUrl
                        ? <img src={pro.avatarUrl} alt={pro.fullName} className="w-full h-full object-cover object-top" />
                        : initials(pro.fullName ?? '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-primary">{pro.fullName}</p>
                      <p className="text-sm text-text-secondary">{pro.title || '—'}</p>
                      {(pro.city || pro.country) && (
                        <p className="text-xs text-text-tertiary flex items-center gap-1 mt-0.5">
                          <IconMapPin size={10} />
                          {[pro.city, pro.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-1.5">
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

                  {/* ── Item to verify ── */}
                  <div className="mt-4 rounded-xl border border-primary/20 bg-primary-light/40 p-4 space-y-2">
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

                  {/* ── Other experiences (collapsible) ── */}
                  {otherExp.length > 0 && (
                    <div className="mt-3">
                      <button onClick={() => toggleExpand(req.id)}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-text-tertiary uppercase tracking-widest hover:text-text-secondary transition-colors">
                        <IconBriefcase size={11} />
                        Autres expériences ({otherExp.length})
                        <IconChevronDown size={11} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="mt-2 space-y-2">
                          {otherExp.map((e: any) => (
                            <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-bg-light border border-border">
                              <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
                                {(e.company ?? '?').slice(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-text-primary truncate">{e.title}</p>
                                <p className="text-[11px] text-text-secondary">{e.company}</p>
                              </div>
                              {e.startDate && (
                                <p className="text-[10px] text-text-tertiary flex-shrink-0">
                                  {new Date(e.startDate).getFullYear()}
                                  {e.isCurrent ? ' – présent' : e.endDate ? ` – ${new Date(e.endDate).getFullYear()}` : ''}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Actions ── */}
                  {isPending && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-border-subtle">
                      <button onClick={() => act(req.id, 'REJETEE')} disabled={!!acting || bulkActing}
                        className="flex-1 flex items-center justify-center gap-2 h-10 rounded-[10px] border border-danger/20 text-danger text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50">
                        {isLoading ? <IconLoader2 size={14} className="animate-spin" /> : <IconX size={14} />}
                        Rejeter
                      </button>
                      <button onClick={() => act(req.id, 'CONFIRMEE')} disabled={!!acting || bulkActing}
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
