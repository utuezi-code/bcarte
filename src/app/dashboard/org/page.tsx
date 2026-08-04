'use client'

import { useEffect, useState } from 'react'
import { IconBuilding, IconLoader2, IconSearch, IconX, IconShieldCheck, IconPlus, IconArrowUpRight } from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import { COUNTRIES } from '@/lib/constants'

export default function DashboardOrgPage() {
  const [myOrgs, setMyOrgs]       = useState<any[]>([])
  const [orgs, setOrgs]           = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [searching, setSearching] = useState(false)
  const [search, setSearch]       = useState('')
  const [joining, setJoining]     = useState<string | null>(null)
  const [error, setError]         = useState('')

  useEffect(() => {
    fetch('/api/org/join')
      .then(r => r.ok ? r.json() : [])
      .then(d => { setMyOrgs(d); setLoading(false) })
  }, [])

  useEffect(() => {
    if (!search) { setOrgs([]); return }
    setSearching(true)
    const t = setTimeout(() => {
      fetch(`/api/orgs?search=${encodeURIComponent(search)}`)
        .then(r => r.json())
        .then(d => { setOrgs(d); setSearching(false) })
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  const join = async (orgId: string) => {
    setJoining(orgId)
    setError('')
    const res = await fetch('/api/org/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organisationId: orgId }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Erreur'); setJoining(null); return }
    // Rafraîchir la liste
    const updated = await fetch('/api/org/join').then(r => r.json())
    setMyOrgs(updated)
    setSearch('')
    setOrgs([])
    setJoining(null)
  }

  const leave = async (orgId: string) => {
    await fetch('/api/org/join', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organisationId: orgId }),
    })
    setMyOrgs(prev => prev.filter((m: any) => m.organisation?.id !== orgId))
  }

  return (
    <div className="min-h-screen bg-[#F7F6FF]">
      <Sidebar />
      <main className="lg:pl-[220px] pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-3xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Mon organisation</h1>
            <p className="text-sm text-text-secondary mt-1">Liez-vous à vos employeurs et établissements</p>
          </div>

          {/* Recherche */}
          <div className="card space-y-3">
            <h2 className="font-semibold text-text-primary">Rejoindre une organisation</h2>
            <div className="relative">
              <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                className="input pl-9 pr-9"
                placeholder="Rechercher une organisation…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => { setSearch(''); setOrgs([]) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary">
                  <IconX size={14} />
                </button>
              )}
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            {searching && <div className="flex justify-center py-4"><IconLoader2 size={20} className="animate-spin text-primary" /></div>}

            {orgs.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {orgs.map((o: any) => {
                  const alreadyMember = myOrgs.some((m: any) => m.organisation?.id === o.id)
                  return (
                    <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#F0F0F0] hover:border-[#E5E7EB]">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                        style={{ backgroundColor: o.logoColor ?? '#6C47FF' }}>
                        {o.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{o.name}</p>
                        <p className="text-xs text-text-secondary">{o.type} · {o.city}, {o.country}</p>
                      </div>
                      {alreadyMember ? (
                        <span className="text-xs text-primary font-medium">Déjà membre</span>
                      ) : (
                        <button onClick={() => join(o.id)} disabled={joining === o.id}
                          className="flex items-center gap-1 text-xs font-semibold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60">
                          {joining === o.id ? <IconLoader2 size={12} className="animate-spin" /> : <IconPlus size={12} />}
                          Rejoindre
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Mes organisations */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <IconLoader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : myOrgs.length === 0 ? (
            <div className="card text-center py-14 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto">
                <IconBuilding size={28} className="text-text-tertiary" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">Aucune organisation liée</p>
                <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
                  Rejoignez une organisation pour que vos expériences puissent être vérifiées.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="font-semibold text-text-primary">Mes organisations ({myOrgs.length})</h2>
              {myOrgs.map((m: any) => {
                const o = m.organisation
                if (!o) return null
                return (
                  <div key={o.id} className="card flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: o.logoColor ?? '#6C47FF' }}>
                      {o.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-text-primary truncate">{o.name}</p>
                        {o.verified && (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-primary bg-primary-light px-1.5 py-0.5 rounded-full">
                            <IconShieldCheck size={9} /> Vérifié
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary">{o.type} · {o.city}, {o.country}</p>
                      <p className="text-xs text-text-tertiary mt-0.5">{m.role}</p>
                    </div>
                    <button onClick={() => leave(o.id)}
                      className="text-xs text-danger border border-danger/20 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors flex-shrink-0">
                      Quitter
                    </button>
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
