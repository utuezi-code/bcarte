'use client'

import { useEffect, useState } from 'react'
import {
  IconBuilding, IconLoader2, IconSearch, IconX,
  IconShieldCheck, IconPlus, IconMapPin, IconUsers,
  IconCircleCheck, IconAlertCircle,
} from '@tabler/icons-react'

export default function DashboardOrgPage() {
  const [myOrgs,    setMyOrgs]    = useState<any[]>([])
  const [orgs,      setOrgs]      = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [searching, setSearching] = useState(false)
  const [search,    setSearch]    = useState('')
  const [joining,   setJoining]   = useState<string | null>(null)
  const [leaving,   setLeaving]   = useState<string | null>(null)
  const [error,     setError]     = useState('')

  useEffect(() => {
    fetch('/api/org/join')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setMyOrgs(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!search) { setOrgs([]); return }
    setSearching(true)
    const t = setTimeout(() => {
      fetch(`/api/orgs?search=${encodeURIComponent(search)}`)
        .then(r => r.json())
        .then(d => { setOrgs(Array.isArray(d) ? d : []); setSearching(false) })
        .catch(() => setSearching(false))
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  const join = async (orgId: string) => {
    setJoining(orgId); setError('')
    const res  = await fetch('/api/org/join', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organisationId: orgId }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Erreur'); setJoining(null); return }
    const updated = await fetch('/api/org/join').then(r => r.json()).catch(() => myOrgs)
    setMyOrgs(Array.isArray(updated) ? updated : myOrgs)
    setSearch(''); setOrgs([]); setJoining(null)
  }

  const leave = async (orgId: string) => {
    setLeaving(orgId)
    await fetch('/api/org/join', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organisationId: orgId }),
    })
    setMyOrgs(prev => prev.filter((m: any) => m.organisation?.id !== orgId))
    setLeaving(null)
  }

  const showResults = !searching && orgs.length > 0

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="page-title">Mon organisation</h1>
        <p className="page-subtitle">Liez-vous à vos employeurs et établissements</p>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

        {/* ── LEFT — sidebar info (sticky) ───────────────────────────────── */}
        <div className="lg:sticky lg:top-8 space-y-4">

          {/* Why join card */}
          <div className="rounded-[14px] overflow-hidden shadow-card">
            <div style={{ background: 'linear-gradient(145deg, #1A0E4E 0%, #3B1FA0 55%, #6C47FF 100%)' }}
              className="px-6 py-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <IconBuilding size={22} className="text-white" />
              </div>
              <p className="text-white font-bold text-base leading-tight">
                Rejoindre une organisation
              </p>
              <p className="text-white/60 text-xs mt-2 leading-relaxed">
                Liez-vous à vos employeurs et établissements pour obtenir la vérification de vos expériences.
              </p>
            </div>
            <div className="bg-white divide-y divide-border">
              {[
                { Icon: IconCircleCheck, color: '#059669', bg: '#ECFDF5', label: 'Expériences vérifiées par l\'organisation' },
                { Icon: IconShieldCheck, color: '#6C47FF', bg: '#F0EDFF', label: 'Badge vérifié sur votre profil public'     },
                { Icon: IconUsers,       color: '#D97706', bg: '#FFFBEB', label: 'Visibilité auprès des recruteurs'           },
              ].map(({ Icon, color, bg, label }) => (
                <div key={label} className="flex items-start gap-3 px-5 py-3.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: bg }}>
                    <Icon size={13} style={{ color }} />
                  </div>
                  <p className="text-xs text-text-secondary leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* My orgs count */}
          {myOrgs.length > 0 && (
            <div className="card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                <IconBuilding size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{myOrgs.length}</p>
                <p className="text-xs text-text-tertiary">
                  {myOrgs.length === 1 ? 'organisation liée' : 'organisations liées'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT — search + my orgs ───────────────────────────────────── */}
        <div className="space-y-4 min-w-0">

          {/* Search card */}
          <div className="card space-y-4">
            <div>
              <p className="font-semibold text-text-primary text-sm">Rechercher une organisation</p>
              <p className="text-xs text-text-tertiary mt-0.5">Tapez le nom de votre entreprise, école ou institution</p>
            </div>

            {/* Search input */}
            <div className="relative">
              <IconSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
              <input
                className="input pl-9 pr-9"
                placeholder="Rechercher par nom…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => { setSearch(''); setOrgs([]) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors">
                  <IconX size={14} />
                </button>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-danger bg-red-50 px-4 py-2.5 rounded-xl border border-danger/15">
                <IconAlertCircle size={14} className="flex-shrink-0" /> {error}
              </div>
            )}

            {/* Spinner */}
            {searching && (
              <div className="flex justify-center py-6">
                <IconLoader2 size={20} className="animate-spin text-primary" />
              </div>
            )}

            {/* Results */}
            {showResults && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest">
                  {orgs.length} résultat{orgs.length > 1 ? 's' : ''}
                </p>
                <div className="space-y-2 max-h-72 overflow-y-auto -mx-1 px-1">
                  {orgs.map((o: any) => {
                    const alreadyMember = myOrgs.some((m: any) => m.organisation?.id === o.id)
                    return (
                      <div key={o.id}
                        className="flex items-center gap-3 p-3.5 rounded-xl border border-border hover:border-primary/30 hover:bg-bg-light transition-all">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: o.logoColor ?? '#6C47FF' }}>
                          {o.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">{o.name}</p>
                          <p className="text-xs text-text-tertiary flex items-center gap-1 mt-0.5">
                            <IconMapPin size={10} />
                            {[o.type, o.city, o.country].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                        {alreadyMember ? (
                          <span className="text-xs text-primary font-semibold bg-primary-light px-3 py-1 rounded-full flex-shrink-0">
                            Membre
                          </span>
                        ) : (
                          <button onClick={() => join(o.id)} disabled={joining === o.id}
                            className="btn-primary text-xs px-3 py-1.5 gap-1 flex-shrink-0">
                            {joining === o.id
                              ? <IconLoader2 size={11} className="animate-spin" />
                              : <IconPlus size={11} />}
                            Rejoindre
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* No results */}
            {!searching && search && orgs.length === 0 && (
              <div className="text-center py-6 space-y-1">
                <p className="text-sm text-text-secondary font-medium">Aucun résultat pour « {search} »</p>
                <p className="text-xs text-text-tertiary">Vérifiez l'orthographe ou essayez un autre terme</p>
              </div>
            )}
          </div>

          {/* ── Mes organisations ────────────────────────────────────────── */}
          {loading ? (
            <div className="flex justify-center py-16">
              <IconLoader2 size={22} className="animate-spin text-primary" />
            </div>
          ) : myOrgs.length === 0 ? (
            <div className="card text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-border-subtle flex items-center justify-center mx-auto">
                <IconBuilding size={24} className="text-text-tertiary" />
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">Aucune organisation liée</p>
                <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
                  Rejoignez une organisation pour que vos expériences puissent être vérifiées.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="section-title">Mes organisations ({myOrgs.length})</p>
              {myOrgs.map((m: any) => {
                const o = m.organisation
                if (!o) return null
                return (
                  <div key={o.id} className="card flex items-center gap-4 hover:border-primary/20 transition-colors group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: o.logoColor ?? '#6C47FF' }}>
                      {o.name?.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-text-primary text-sm truncate">{o.name}</p>
                        {o.verified && (
                          <span className="badge-verified flex-shrink-0">
                            <IconShieldCheck size={9} /> Vérifié
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
                        <IconMapPin size={10} className="flex-shrink-0" />
                        {[o.type, o.city, o.country].filter(Boolean).join(' · ')}
                      </p>
                      {m.role && (
                        <p className="text-xs text-text-tertiary mt-0.5">{m.role}</p>
                      )}
                    </div>

                    <button
                      onClick={() => leave(o.id)}
                      disabled={leaving === o.id}
                      className="btn-danger flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50">
                      {leaving === o.id ? <IconLoader2 size={13} className="animate-spin" /> : null}
                      Quitter
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
