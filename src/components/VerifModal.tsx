'use client'

import { useEffect, useState } from 'react'
import { IconX, IconSearch, IconShieldCheck, IconLoader2, IconCheck, IconBuilding } from '@tabler/icons-react'

interface Props {
  type:    'EXPÉRIENCE' | 'FORMATION'
  refId:   string
  label:   string
  onClose: () => void
  onDone:  () => void
}

export default function VerifModal({ type, refId, label, onClose, onDone }: Props) {
  const [search,    setSearch]    = useState('')
  const [orgs,      setOrgs]      = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [sending,   setSending]   = useState<string | null>(null)
  const [sent,      setSent]      = useState<string[]>([])
  const [error,     setError]     = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  useEffect(() => {
    if (!search || search.length < 2) { setOrgs([]); return }
    setSearching(true)
    const t = setTimeout(() => {
      fetch(`/api/orgs?search=${encodeURIComponent(search)}`)
        .then(r => r.json())
        .then(d => { setOrgs(d ?? []); setSearching(false) })
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const submit = async (org: any) => {
    setSending(org.id); setError('')
    const res = await fetch('/api/verifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organisationId: org.id, type, label, refId }),
    })
    const data = await res.json()
    setSending(null)
    if (!res.ok) {
      setError(data.error ?? 'Erreur lors de l\'envoi')
      return
    }
    setSent(s => [...s, org.id])
    onDone()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            <p className="font-bold text-text-primary">Demander une vérification</p>
            <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">{label}</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full bg-border-subtle hover:bg-border flex items-center justify-center transition-colors ml-3 flex-shrink-0">
            <IconX size={13} className="text-text-secondary" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-text-secondary">
            Recherchez l&apos;organisation (employeur, école…) à qui envoyer la demande. Elle devra confirmer votre {type === 'EXPÉRIENCE' ? 'expérience' : 'formation'}.
          </p>

          {/* Search */}
          <div className="relative">
            <IconSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            <input
              autoFocus
              className="input pl-9"
              placeholder="Nom de l'organisation…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-danger bg-red-50 border border-danger/15 rounded-xl px-3 py-2">{error}</p>
          )}

          {/* Results */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searching && (
              <div className="flex justify-center py-6">
                <IconLoader2 size={20} className="animate-spin text-primary" />
              </div>
            )}
            {!searching && search.length >= 2 && orgs.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-text-tertiary">Aucune organisation trouvée</p>
              </div>
            )}
            {!searching && orgs.map(org => {
              const isSent = sent.includes(org.id)
              const isLoading = sending === org.id
              return (
                <div key={org.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-bg-light transition-all">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: org.logoColor ?? '#6C47FF' }}>
                    {(org.name ?? '?').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{org.name}</p>
                    {org.city && <p className="text-xs text-text-tertiary">{org.city}</p>}
                  </div>
                  {isSent ? (
                    <span className="text-xs text-success font-semibold flex items-center gap-1 flex-shrink-0">
                      <IconCheck size={12} /> Envoyé
                    </span>
                  ) : (
                    <button onClick={() => submit(org)} disabled={!!sending || isLoading}
                      className="btn-primary text-xs px-3 py-1.5 gap-1 flex-shrink-0">
                      {isLoading
                        ? <IconLoader2 size={11} className="animate-spin" />
                        : <IconShieldCheck size={11} />}
                      Envoyer
                    </button>
                  )}
                </div>
              )
            })}
            {!search && (
              <div className="flex flex-col items-center py-6 gap-2 text-text-tertiary">
                <IconBuilding size={28} strokeWidth={1.5} />
                <p className="text-xs">Tapez le nom de l&apos;organisation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
