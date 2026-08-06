'use client'

import { useEffect, useState } from 'react'
import {
  IconBuilding, IconLoader2, IconSearch, IconX,
  IconShieldCheck, IconLink, IconMapPin, IconUsers,
  IconCircleCheck, IconAlertCircle, IconChevronDown,
} from '@tabler/icons-react'

type LinkForm = {
  /* entreprise / institution */
  role: string; department: string; matricule: string
  /* école / université */
  program: string; degree: string; studentId: string; graduationYear: string
  /* club / ONG */
  clubRole: string; section: string; memberId: string; since: string
  /* commun */
  message: string
}
const EMPTY_FORM: LinkForm = {
  role: '', department: '', matricule: '',
  program: '', degree: '', studentId: '', graduationYear: '',
  clubRole: '', section: '', memberId: '', since: '',
  message: '',
}

function orgCategory(type: string): 'entreprise' | 'ecole' | 'club' {
  const t = (type ?? '').toLowerCase()
  if (t === 'université' || t === 'universite' || t === 'école' || t === 'ecole') return 'ecole'
  if (t === 'club' || t === 'ong' || t === 'association') return 'club'
  return 'entreprise'
}

export default function DashboardOrgPage() {
  const [myOrgs,    setMyOrgs]    = useState<any[]>([])
  const [orgs,      setOrgs]      = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [searching, setSearching] = useState(false)
  const [search,    setSearch]    = useState('')
  const [joining,   setJoining]   = useState<string | null>(null)
  const [leaving,   setLeaving]   = useState<string | null>(null)
  const [error,     setError]     = useState('')
  /* form state: orgId being linked, or null */
  const [linkingOrg, setLinkingOrg] = useState<any | null>(null)
  const [form,       setForm]       = useState<LinkForm>(EMPTY_FORM)

  useEffect(() => {
    fetch('/api/org/join')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setMyOrgs(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    setSearching(true)
    const t = setTimeout(() => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      fetch(`/api/orgs?${params}`)
        .then(r => r.ok ? r.json() : [])
        .then(d => { setOrgs(Array.isArray(d) ? d : []); setSearching(false) })
        .catch(() => setSearching(false))
    }, search ? 350 : 0)
    return () => clearTimeout(t)
  }, [search])

  const join = async () => {
    if (!linkingOrg) return
    setJoining(linkingOrg.id); setError('')
    const cat = orgCategory(linkingOrg.type)

    const payload: any = { organisationId: linkingOrg.id, message: form.message || undefined }
    if (cat === 'entreprise') {
      payload.role       = form.role       || undefined
      payload.department = form.department || undefined
      payload.matricule  = form.matricule  || undefined
    } else if (cat === 'ecole') {
      payload.role       = form.degree     || undefined  // stored as role
      payload.department = form.program    || undefined  // stored as department
      payload.matricule  = form.studentId  || undefined
      payload.message    = [form.graduationYear ? `Promotion ${form.graduationYear}` : '', form.message].filter(Boolean).join(' — ') || undefined
    } else {
      payload.role       = form.clubRole   || undefined
      payload.department = form.section    || undefined
      payload.matricule  = form.memberId   || undefined
      payload.message    = [form.since ? `Membre depuis ${form.since}` : '', form.message].filter(Boolean).join(' — ') || undefined
    }

    const res  = await fetch('/api/org/join', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Erreur'); setJoining(null); return }
    const updated = await fetch('/api/org/join').then(r => r.json()).catch(() => myOrgs)
    setMyOrgs(Array.isArray(updated) ? updated : myOrgs)
    setLinkingOrg(null); setForm(EMPTY_FORM); setJoining(null)
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

  const showResults = !searching

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
                  {search ? `${orgs.length} résultat${orgs.length > 1 ? 's' : ''}` : `${orgs.length} organisation${orgs.length > 1 ? 's' : ''}`}
                </p>
                <div className="space-y-2 max-h-72 overflow-y-auto -mx-1 px-1">
                  {orgs.map((o: any) => {
                    const alreadyMember = myOrgs.some((m: any) => m.organisation?.id === o.id)
                    const isOpen = linkingOrg?.id === o.id
                    return (
                      <div key={o.id} className={`rounded-xl border transition-all ${isOpen ? 'border-primary/40 bg-primary-light/10' : 'border-border hover:border-primary/30 hover:bg-bg-light'}`}>
                        {/* Header row */}
                        <div className="flex items-center gap-3 p-3.5">
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: o.logoUrl ? '#F3F4F6' : (o.logoColor ?? '#6C47FF') }}>
                            {o.logoUrl
                              ? <img src={o.logoUrl} alt={o.name} className="w-full h-full object-contain" />
                              : o.name?.slice(0, 2).toUpperCase()}
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
                              Lié
                            </span>
                          ) : (
                            <button
                              onClick={() => { setLinkingOrg(isOpen ? null : o); setForm(EMPTY_FORM); setError('') }}
                              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-[8px] flex-shrink-0 transition-all ${
                                isOpen ? 'bg-border-subtle text-text-secondary' : 'btn-primary'
                              }`}>
                              {isOpen
                                ? <><IconChevronDown size={11} className="rotate-180" /> Annuler</>
                                : <><IconLink size={11} /> Lier</>}
                            </button>
                          )}
                        </div>

                        {/* Expanded form */}
                        {isOpen && (() => {
                          const cat = orgCategory(o.type)
                          const requiredOk =
                            cat === 'entreprise' ? !!form.role :
                            cat === 'ecole'      ? !!form.program :
                                                   !!form.clubRole
                          return (
                            <div className="px-4 pb-4 space-y-3 border-t border-primary/10 pt-3">
                              <p className="text-xs text-text-secondary font-medium">
                                Renseignez vos informations pour que <span className="font-bold text-text-primary">{o.name}</span> puisse vous identifier.
                              </p>

                              {/* ── ENTREPRISE / INSTITUTION ── */}
                              {cat === 'entreprise' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="label">Poste / Fonction *</label>
                                    <input className="input" placeholder="Ex : Ingénieur logiciel"
                                      value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                                  </div>
                                  <div>
                                    <label className="label">Département / Service</label>
                                    <input className="input" placeholder="Ex : R&D, Finance…"
                                      value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
                                  </div>
                                  <div>
                                    <label className="label">Matricule / ID employé <span className="text-text-tertiary font-normal">(optionnel)</span></label>
                                    <input className="input" placeholder="Ex : EMP-00142"
                                      value={form.matricule} onChange={e => setForm(f => ({ ...f, matricule: e.target.value }))} />
                                  </div>
                                </div>
                              )}

                              {/* ── ÉCOLE / UNIVERSITÉ ── */}
                              {cat === 'ecole' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="sm:col-span-2">
                                    <label className="label">Filière / Programme *</label>
                                    <input className="input" placeholder="Ex : Génie informatique, Droit des affaires…"
                                      value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))} />
                                  </div>
                                  <div>
                                    <label className="label">Diplôme préparé / obtenu</label>
                                    <input className="input" placeholder="Ex : Master, Licence, BTS…"
                                      value={form.degree} onChange={e => setForm(f => ({ ...f, degree: e.target.value }))} />
                                  </div>
                                  <div>
                                    <label className="label">Promotion (année de sortie)</label>
                                    <input className="input" placeholder="Ex : 2023"
                                      value={form.graduationYear} onChange={e => setForm(f => ({ ...f, graduationYear: e.target.value }))} />
                                  </div>
                                  <div>
                                    <label className="label">Numéro étudiant <span className="text-text-tertiary font-normal">(optionnel)</span></label>
                                    <input className="input" placeholder="Ex : 20190456"
                                      value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} />
                                  </div>
                                </div>
                              )}

                              {/* ── CLUB / ONG / ASSOCIATION ── */}
                              {cat === 'club' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="label">Rôle dans l'organisation *</label>
                                    <input className="input" placeholder="Ex : Président, Trésorier, Membre…"
                                      value={form.clubRole} onChange={e => setForm(f => ({ ...f, clubRole: e.target.value }))} />
                                  </div>
                                  <div>
                                    <label className="label">Section / Équipe</label>
                                    <input className="input" placeholder="Ex : Équipe technique, Comité…"
                                      value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} />
                                  </div>
                                  <div>
                                    <label className="label">Numéro de membre <span className="text-text-tertiary font-normal">(optionnel)</span></label>
                                    <input className="input" placeholder="Ex : MBR-0042"
                                      value={form.memberId} onChange={e => setForm(f => ({ ...f, memberId: e.target.value }))} />
                                  </div>
                                  <div>
                                    <label className="label">Membre depuis <span className="text-text-tertiary font-normal">(optionnel)</span></label>
                                    <input className="input" placeholder="Ex : 2020"
                                      value={form.since} onChange={e => setForm(f => ({ ...f, since: e.target.value }))} />
                                  </div>
                                </div>
                              )}

                              {/* Message commun */}
                              <div>
                                <label className="label">Message à l'organisation <span className="text-text-tertiary font-normal">(optionnel)</span></label>
                                <textarea className="input resize-none min-h-[56px]"
                                  placeholder="Précisez votre demande si nécessaire…"
                                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                              </div>

                              {error && (
                                <div className="flex items-center gap-2 text-xs text-danger bg-red-50 px-3 py-2 rounded-xl border border-danger/15">
                                  <IconAlertCircle size={13} className="flex-shrink-0" /> {error}
                                </div>
                              )}

                              <button onClick={join} disabled={!!joining || !requiredOk}
                                className="btn-primary w-full justify-center">
                                {joining ? <IconLoader2 size={14} className="animate-spin" /> : <IconLink size={14} />}
                                Envoyer la demande de liaison
                              </button>
                            </div>
                          )
                        })()}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* No results */}
            {!searching && orgs.length === 0 && (
              <div className="text-center py-6 space-y-1">
                <p className="text-sm text-text-secondary font-medium">
                  {search ? `Aucun résultat pour « ${search} »` : 'Aucune organisation disponible'}
                </p>
                {search && <p className="text-xs text-text-tertiary">Vérifiez l'orthographe ou essayez un autre terme</p>}
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
