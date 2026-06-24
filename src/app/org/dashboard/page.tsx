'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IconCircleCheck, IconX, IconClock, IconUsers, IconBriefcase,
  IconExternalLink, IconPlus, IconTrash, IconEye, IconLoader2,
} from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

const TABS = ['Aperçu', 'Vérifications', 'Offres', 'Équipe', 'Profil']

export default function OrgDashboardPage() {
  const [tab, setTab]                   = useState(0)
  const [org, setOrg]                   = useState<any>(null)
  const [verifications, setVerifications] = useState<any[]>([])
  const [offers, setOffers]             = useState<any[]>([])
  const [team, setTeam]                 = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [newOffer, setNewOffer]         = useState({ title: '', location: '', type: 'CDI', description: '' })
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [orgForm, setOrgForm]           = useState<any>({})
  const [savingOrg, setSavingOrg]       = useState(false)
  const [savedOrg, setSavedOrg]         = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/org').then(r => r.ok ? r.json() : null),
      fetch('/api/org/verifications').then(r => r.ok ? r.json() : []),
      fetch('/api/org/offers').then(r => r.ok ? r.json() : []),
      fetch('/api/org/team').then(r => r.ok ? r.json() : []),
    ]).then(([o, v, of, t]) => {
      setOrg(o)
      setOrgForm({ name: o?.name ?? '', description: o?.description ?? '', sector: o?.sector ?? '', city: o?.city ?? '', country: o?.country ?? 'Sénégal', website: o?.website ?? '' })
      setVerifications(v ?? [])
      setOffers(of ?? [])
      setTeam(t ?? [])
      setLoading(false)
    })
  }, [])

  const handleVerif = async (id: string, status: string) => {
    await fetch('/api/org/verifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setVerifications(verifications.map(v => v.id === id ? { ...v, status } : v))
  }

  const handleAddOffer = async () => {
    const data = await fetch('/api/org/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOffer),
    }).then(r => r.json())
    setOffers([data, ...offers])
    setNewOffer({ title: '', location: '', type: 'CDI', description: '' })
    setShowOfferForm(false)
  }

  const handleDeleteOffer = async (id: string) => {
    await fetch('/api/org/offers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setOffers(offers.filter(o => o.id !== id))
  }

  const handleSaveOrg = async () => {
    setSavingOrg(true)
    await fetch('/api/org', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orgForm),
    })
    setSavingOrg(false)
    setSavedOrg(true)
    setTimeout(() => setSavedOrg(false), 3000)
  }

  const pending = verifications.filter(v => v.status === 'EN_ATTENTE')

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <IconLoader2 size={28} className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">

          {/* Header org */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: org?.logoColor ?? '#6C47FF' }}>
                {(org?.name ?? 'O').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-text-primary">{org?.name ?? 'Mon organisation'}</h1>
                  {org?.verified && (
                    <span className="flex items-center gap-1 text-xs text-success bg-success-light px-2 py-0.5 rounded-full">
                      <IconCircleCheck size={12} /> Vérifiée
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary">{org?.description ?? 'Complétez votre profil organisation'}</p>
              </div>
            </div>
            {org?.slug && (
              <Link href={`/org/${org.slug}`} className="btn-secondary text-sm flex items-center gap-2 px-4 py-2">
                <IconExternalLink size={15} /> Voir la page publique
              </Link>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-[#E5E7EB]">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === i ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}>
                {t}
                {t === 'Vérifications' && pending.length > 0 && (
                  <span className="ml-1.5 bg-primary text-white text-xs rounded-full px-1.5 py-0.5">{pending.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Aperçu */}
          {tab === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Membres',              value: team.length,                icon: IconUsers,   color: 'text-primary'   },
                  { label: 'Offres actives',        value: offers.filter(o=>o.isActive).length, icon: IconBriefcase, color: 'text-success' },
                  { label: 'Vérifications en attente', value: pending.length,         icon: IconClock,   color: 'text-[#D97706]' },
                  { label: 'Vues profil',           value: '—',                        icon: IconEye,     color: 'text-text-tertiary' },
                ].map(s => (
                  <div key={s.label} className="card">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-text-secondary">{s.label}</p>
                        <p className="text-2xl font-bold text-text-primary mt-1">{s.value}</p>
                      </div>
                      <s.icon size={20} className={s.color} />
                    </div>
                  </div>
                ))}
              </div>

              {pending.length > 0 && (
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-text-primary">Vérifications récentes</h2>
                    <button onClick={() => setTab(1)} className="text-sm text-primary">Tout traiter →</button>
                  </div>
                  {pending.slice(0, 3).map((v: any) => (
                    <div key={v.id} className="flex items-center justify-between py-3 border-b border-[#F3F4F6] last:border-0">
                      <div>
                        <span className="text-xs bg-[#F3F4F6] text-text-secondary px-2 py-0.5 rounded-full mr-2">{v.type}</span>
                        <span className="text-sm font-medium text-text-primary">{v.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleVerif(v.id, 'CONFIRMEE')} className="text-xs bg-success-light text-success px-3 py-1 rounded-lg font-medium">Confirmer</button>
                        <button onClick={() => handleVerif(v.id, 'REJETEE')} className="text-xs bg-red-50 text-danger px-3 py-1 rounded-lg font-medium">Rejeter</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Vérifications */}
          {tab === 1 && (
            <div className="space-y-3">
              {verifications.length === 0 ? (
                <div className="card text-center py-12">
                  <IconCircleCheck size={32} className="text-text-tertiary mx-auto mb-3" />
                  <p className="font-medium text-text-primary">Aucune demande de vérification</p>
                  <p className="text-sm text-text-secondary mt-1">Les demandes des membres apparaîtront ici</p>
                </div>
              ) : verifications.map((v: any) => (
                <div key={v.id} className="card flex items-center justify-between">
                  <div>
                    <span className="text-xs bg-[#F3F4F6] text-text-secondary px-2 py-0.5 rounded-full mr-2">{v.type}</span>
                    <span className="text-sm font-semibold text-text-primary">{v.label}</span>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {v.status === 'EN_ATTENTE' ? <span className="text-[#D97706]">En attente</span>
                       : v.status === 'CONFIRMEE' ? <span className="text-success">Confirmée</span>
                       : <span className="text-danger">Rejetée</span>}
                    </p>
                  </div>
                  {v.status === 'EN_ATTENTE' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleVerif(v.id, 'CONFIRMEE')} className="text-xs bg-success-light text-success px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"><IconCircleCheck size={12} /> Confirmer</button>
                      <button onClick={() => handleVerif(v.id, 'REJETEE')} className="text-xs bg-red-50 text-danger px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"><IconX size={12} /> Rejeter</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Offres */}
          {tab === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-text-primary">{offers.length} offre{offers.length !== 1 ? 's' : ''}</h2>
                <button onClick={() => setShowOfferForm(true)} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                  <IconPlus size={15} /> Publier une offre
                </button>
              </div>

              {showOfferForm && (
                <div className="card space-y-4 border-primary/20">
                  <h3 className="font-semibold text-text-primary">Nouvelle offre</h3>
                  {[
                    { label: 'Titre *', key: 'title', placeholder: 'Développeur Full Stack' },
                    { label: 'Localisation', key: 'location', placeholder: 'Dakar, Sénégal' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="label">{f.label}</label>
                      <input className="input" value={(newOffer as any)[f.key]} onChange={e => setNewOffer({...newOffer, [f.key]: e.target.value})} placeholder={f.placeholder} />
                    </div>
                  ))}
                  <div>
                    <label className="label">Type</label>
                    <select className="input" value={newOffer.type} onChange={e => setNewOffer({...newOffer, type: e.target.value})}>
                      {['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea className="input min-h-[80px] resize-none" value={newOffer.description} onChange={e => setNewOffer({...newOffer, description: e.target.value})} placeholder="Décrivez le poste…" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowOfferForm(false)} className="btn-secondary flex-1 py-2.5">Annuler</button>
                    <button onClick={handleAddOffer} className="btn-primary flex-1 py-2.5" disabled={!newOffer.title}>Publier</button>
                  </div>
                </div>
              )}

              {offers.length === 0 && !showOfferForm ? (
                <div className="card text-center py-12">
                  <IconBriefcase size={32} className="text-text-tertiary mx-auto mb-3" />
                  <p className="font-medium text-text-primary">Aucune offre publiée</p>
                  <p className="text-sm text-text-secondary mt-1">Publiez votre première offre d&apos;emploi</p>
                </div>
              ) : offers.map((o: any) => (
                <div key={o.id} className="card flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">{o.title}</p>
                    <p className="text-sm text-text-secondary">{o.location} · {o.type}</p>
                    <span className={`mt-1.5 inline-block text-xs px-2 py-0.5 rounded-full ${o.isActive ? 'bg-success-light text-success' : 'bg-[#F3F4F6] text-text-tertiary'}`}>
                      {o.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteOffer(o.id)} className="text-text-tertiary hover:text-danger transition-colors">
                    <IconTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Équipe */}
          {tab === 3 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-text-primary">{team.length} membre{team.length !== 1 ? 's' : ''}</h2>
              </div>
              {team.length === 0 ? (
                <div className="card text-center py-12">
                  <IconUsers size={32} className="text-text-tertiary mx-auto mb-3" />
                  <p className="font-medium text-text-primary">Aucun membre</p>
                  <p className="text-sm text-text-secondary mt-1">Les membres liés à votre organisation apparaîtront ici</p>
                </div>
              ) : team.map((m: any) => (
                <div key={m.id} className="card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                    {m.profile?.fullName?.slice(0, 2).toUpperCase() ?? '??'}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{m.profile?.fullName}</p>
                    <p className="text-sm text-text-secondary">{m.title ?? m.profile?.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Profil org */}
          {tab === 4 && (
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-text-primary">Profil de l&apos;organisation</h2>
                <button onClick={handleSaveOrg} disabled={savingOrg} className="btn-primary px-5 py-2.5 text-sm">
                  {savedOrg ? 'Enregistré !' : 'Enregistrer'}
                </button>
              </div>
              {[
                { label: 'Nom *', key: 'name', placeholder: 'Nom de l\'organisation' },
                { label: 'Secteur', key: 'sector', placeholder: 'Recrutement, Technologie…' },
                { label: 'Ville', key: 'city', placeholder: 'Dakar' },
                { label: 'Pays', key: 'country', placeholder: 'Sénégal' },
                { label: 'Site web', key: 'website', placeholder: 'https://…' },
              ].map(f => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <input className="input" value={orgForm[f.key] ?? ''} onChange={e => setOrgForm({...orgForm, [f.key]: e.target.value})} placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="label">Description</label>
                <textarea className="input min-h-[90px] resize-none" value={orgForm.description ?? ''} onChange={e => setOrgForm({...orgForm, description: e.target.value})} placeholder="Décrivez votre organisation…" />
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
