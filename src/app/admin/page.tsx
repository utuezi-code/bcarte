'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconUsers, IconCircleCheck, IconBuilding, IconSearch,
  IconShield, IconBan, IconCheck, IconMail, IconLoader2,
  IconChartBar, IconX, IconLogout, IconRefresh, IconClock,
} from '@tabler/icons-react'

const TABS = ['Statistiques', 'Utilisateurs', 'Organisations', 'Invitations']

const AVATAR_COLORS = ['#6C47FF', '#059669', '#C9A84C', '#2563EB', '#DC2626', '#7C3AED', '#0891B2', '#D97706']
function avatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

export default function AdminPage() {
  const router = useRouter()
  const [tab,     setTab]     = useState(0)
  const [stats,   setStats]   = useState<any>(null)
  const [users,   setUsers]   = useState<any[]>([])
  const [orgs,    setOrgs]    = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [usedCount, setUsedCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [search,  setSearch]  = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [orgFilter, setOrgFilter] = useState('pending')

  /* Check admin session */
  useEffect(() => {
    fetch('/api/admin/stats').then(r => {
      if (r.status === 401) router.replace('/admin/login')
    })
  }, [router])

  /* Load stats */
  const loadStats = useCallback(async () => {
    const r = await fetch('/api/admin/stats')
    if (r.ok) setStats(await r.json())
  }, [])

  /* Load users */
  const loadUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    const r = await fetch(`/api/admin/users?${params}`)
    if (r.ok) { const d = await r.json(); setUsers(d.users ?? []) }
    setLoading(false)
  }, [search])

  /* Load orgs */
  const loadOrgs = useCallback(async () => {
    setLoading(true)
    const r = await fetch(`/api/admin/organisations?filter=${orgFilter}`)
    if (r.ok) { const d = await r.json(); setOrgs(d.organisations ?? []) }
    setLoading(false)
  }, [orgFilter])

  /* Load invitations */
  const loadInvites = useCallback(async () => {
    const r = await fetch('/api/admin/invitations')
    if (r.ok) { const d = await r.json(); setInvites(d.invitations ?? []); setUsedCount(d.usedCount ?? 0) }
  }, [])

  useEffect(() => { loadStats() }, [loadStats])
  useEffect(() => { if (tab === 1) loadUsers() }, [tab, loadUsers])
  useEffect(() => { if (tab === 2) loadOrgs()  }, [tab, orgFilter, loadOrgs])
  useEffect(() => { if (tab === 3) loadInvites() }, [tab, loadInvites])

  /* Debounce search */
  useEffect(() => {
    if (tab !== 1) return
    const t = setTimeout(loadUsers, search ? 350 : 0)
    return () => clearTimeout(t)
  }, [search, tab, loadUsers])

  const toggleSuspend = async (id: string, suspended: boolean) => {
    const r = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suspended: !suspended }),
    })
    if (r.ok) setUsers(prev => prev.map(u => u.id === id ? { ...u, suspended: !suspended } : u))
  }

  const toggleVerifyOrg = async (id: string, verified: boolean) => {
    const r = await fetch(`/api/admin/organisations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: !verified }),
    })
    if (r.ok) setOrgs(prev => prev.map(o => o.id === id ? { ...o, verified: !verified } : o))
  }

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return
    setInviteLoading(true)
    setInviteError('')
    const r = await fetch('/api/admin/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail }),
    })
    const d = await r.json()
    setInviteLoading(false)
    if (!r.ok) { setInviteError(d.error ?? 'Erreur'); return }
    setInviteEmail('')
    loadInvites()
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  const statCards = stats ? [
    { label: 'Profils créés', value: stats.totalProfiles, icon: IconUsers, color: 'text-[#6C47FF] bg-[#F0EDFF]' },
    { label: 'Vérifications confirmées', value: stats.confirmedVerifications, icon: IconCircleCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'En attente', value: stats.pendingVerifications, icon: IconClock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Organisations', value: stats.totalOrgs, icon: IconBuilding, color: 'text-[#2563EB] bg-[#EFF6FF]' },
  ] : []

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      {/* Admin top bar */}
      <header className="bg-[#0F0B2E] border-b border-white/8 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6C47FF, #9B6DFF)' }}>
            <IconShield size={14} className="text-white" />
          </div>
          <span className="text-white font-black text-sm tracking-tight">bcarte admin</span>
        </div>
        <button onClick={logout}
          className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-medium transition-colors">
          <IconLogout size={13} />
          Déconnexion
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-[#0F0B2E]">Administration</h1>
          <p className="text-gray-400 text-sm mt-0.5">Gestion globale de la plateforme bcarte</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto gap-1">
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                tab === i ? 'border-[#6C47FF] text-[#6C47FF]' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── Stats ── */}
        {tab === 0 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats === null ? (
                <div className="col-span-4 flex justify-center py-12"><IconLoader2 size={24} className="animate-spin text-[#6C47FF]" /></div>
              ) : statCards.map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                      </div>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                        <Icon size={17} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {stats && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <IconChartBar size={16} className="text-[#6C47FF]" />
                    Activité (30 derniers jours)
                  </h3>
                  <button onClick={loadStats} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <IconRefresh size={14} />
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Nouveaux profils', value: stats.last30d.newProfiles, max: Math.max(stats.last30d.newProfiles, 1) },
                    { label: 'Nouvelles vérifications', value: stats.last30d.newVerifs, max: Math.max(stats.last30d.newVerifs, 1) },
                    { label: 'Nouvelles organisations', value: stats.last30d.newOrgs, max: Math.max(stats.last30d.newOrgs, 1) },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-bold text-gray-900">{item.value}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2">
                        <div className="bg-[#6C47FF] h-2 rounded-full transition-all"
                          style={{ width: item.max > 0 ? `${Math.min((item.value / item.max) * 100, 100)}%` : '0%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Utilisateurs ── */}
        {tab === 1 && (
          <div className="space-y-4">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input className="w-full h-10 pl-9 pr-9 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#6C47FF] transition-colors"
                placeholder="Rechercher par nom, titre, ville…"
                value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <IconX size={13} />
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><IconLoader2 size={24} className="animate-spin text-[#6C47FF]" /></div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Profil</th>
                      <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Email</th>
                      <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Localisation</th>
                      <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
                      <th className="py-3 px-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">Aucun utilisateur</td></tr>
                    ) : users.map(u => (
                      <tr key={u.id} className={u.suspended ? 'bg-red-50/50' : 'hover:bg-gray-50/50 transition-colors'}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 overflow-hidden"
                              style={{ backgroundColor: avatarColor(u.fullName ?? '') }}>
                              {u.avatarUrl
                                ? <img src={u.avatarUrl} alt={u.fullName} className="w-full h-full object-cover" />
                                : initials(u.fullName ?? '')
                              }
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{u.fullName}</p>
                              {u.title && <p className="text-xs text-gray-400">{u.title}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-xs hidden sm:table-cell">{u.user?.email ?? '—'}</td>
                        <td className="py-3 px-4 text-gray-500 text-xs hidden md:table-cell">
                          {[u.city, u.country].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="py-3 px-4">
                          {u.suspended
                            ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full"><IconBan size={9} />Suspendu</span>
                            : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><IconCheck size={9} />Actif</span>
                          }
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleSuspend(u.id, u.suspended)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                              u.suspended
                                ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                : 'text-red-600 bg-red-50 hover:bg-red-100'
                            }`}>
                            {u.suspended ? 'Réactiver' : 'Suspendre'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Organisations ── */}
        {tab === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {['pending', 'verified', ''].map((f, i) => (
                <button key={i} onClick={() => setOrgFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    orgFilter === f ? 'bg-[#6C47FF] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#6C47FF]/30'
                  }`}>
                  {f === 'pending' ? 'À vérifier' : f === 'verified' ? 'Vérifiées' : 'Toutes'}
                </button>
              ))}
              <button onClick={loadOrgs} className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
                <IconRefresh size={16} />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><IconLoader2 size={24} className="animate-spin text-[#6C47FF]" /></div>
            ) : orgs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
                <IconBuilding size={28} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Aucune organisation</p>
              </div>
            ) : (
              <div className="space-y-2">
                {orgs.map(org => (
                  <div key={org.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between gap-4 shadow-sm">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{org.name}</p>
                        {org.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#6C47FF] bg-[#F0EDFF] px-2 py-0.5 rounded-full">
                            <IconShield size={9} />Vérifiée
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {org.type} · {[org.city, org.country].filter(Boolean).join(', ')}
                        {org.owner?.email ? ` · ${org.owner.email}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleVerifyOrg(org.id, org.verified)}
                      className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-colors ${
                        org.verified
                          ? 'text-red-600 bg-red-50 hover:bg-red-100'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}>
                      {org.verified ? <><IconX size={12} />Révoquer</> : <><IconCheck size={12} />Vérifier</>}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Invitations ── */}
        {tab === 3 && (
          <div className="space-y-5 max-w-lg">
            {/* Quota */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 font-medium">Invitations pilotes</span>
                <span className="font-bold text-gray-900">{invites.length} / 100</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2.5 mb-1.5">
                <div className="bg-[#6C47FF] h-2.5 rounded-full transition-all"
                  style={{ width: `${Math.min(invites.length, 100)}%` }} />
              </div>
              <p className="text-xs text-gray-400">{usedCount} utilisées · {100 - invites.length} restantes</p>
            </div>

            {/* Send invite */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
              <h3 className="font-semibold text-gray-800">Envoyer une invitation</h3>
              <div className="relative">
                <IconMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6C47FF] transition-colors"
                  placeholder="email@exemple.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendInvite()}
                />
              </div>
              {inviteError && <p className="text-red-500 text-xs">{inviteError}</p>}
              <button
                onClick={sendInvite}
                disabled={inviteLoading || !inviteEmail.trim() || invites.length >= 100}
                className="w-full h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #9B6DFF 100%)' }}>
                {inviteLoading ? <IconLoader2 size={14} className="animate-spin" /> : <IconMail size={14} />}
                Envoyer l&apos;invitation
              </button>
            </div>

            {/* List */}
            {invites.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Invitations envoyées</p>
                </div>
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {invites.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{inv.email}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(inv.sentAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {inv.usedAt
                        ? <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Utilisée</span>
                        : <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">En attente</span>
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
