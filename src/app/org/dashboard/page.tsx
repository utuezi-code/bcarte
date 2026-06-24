'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  IconCircleCheck, IconX, IconClock, IconUsers, IconBuilding,
  IconBriefcase, IconExternalLink, IconPlus, IconTrash, IconPencil,
  IconMapPin, IconCheck, IconArrowUpRight, IconFileText,
  IconEye, IconChartBar, IconSend, IconStack2,
} from '@tabler/icons-react'
import { MOCK_VERIFICATION_REQUESTS, MOCK_PROFILES } from '@/lib/mock-data'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

const ORG = {
  slug: 'talent-africa-group',
  name: 'Talent Africa Group',
  initials: 'TA',
  tagline: 'Cabinet de recrutement spécialisé en Afrique de l\'Ouest',
  description: 'Talent Africa Group connecte les meilleurs talents tech, finance et management aux entreprises qui façonnent l\'avenir de l\'Afrique.',
  city: 'Dakar',
  country: 'Sénégal',
  website: 'talentagricagroup.com',
  websiteUrl: 'https://talentagricagroup.com',
  email: 'contact@talentagricagroup.com',
  whatsapp: '+221 33 123 4567',
  verified: true,
  sector: 'Recrutement & RH',
  size: '10–50 employés',
  founded: '2019',
}

const INIT_MEMBERS = [
  { id: 'm1', name: 'Ibrahima Sow', title: 'DG & Fondateur', email: 'i.sow@talentagricagroup.com', initials: 'IS', role: 'admin' as const, verified: true },
  { id: 'm2', name: 'Khadija Fall', title: 'Responsable recrutement tech', email: 'k.fall@talentagricagroup.com', initials: 'KF', role: 'member' as const, verified: true },
  { id: 'm3', name: 'Moussa Dieng', title: 'Consultant senior', email: 'm.dieng@talentagricagroup.com', initials: 'MD', role: 'member' as const, verified: false },
]

const INIT_OFFERS = [
  {
    id: 'o1',
    title: 'Développeur Full Stack React / Node.js',
    location: 'Dakar, Sénégal',
    type: 'CDI',
    posted: '2025-06-20',
    description: 'Rejoignez une startup en forte croissance pour développer des solutions SaaS à destination des PME africaines.',
    applications: 12,
  },
  {
    id: 'o2',
    title: 'Responsable Marketing Digital',
    location: 'Abidjan, Côte d\'Ivoire',
    type: 'CDI',
    posted: '2025-06-15',
    description: 'Pilotez la stratégie digitale d\'un groupe bancaire panafricain.',
    applications: 7,
  },
  {
    id: 'o3',
    title: 'Analyste Financier Senior',
    location: 'Paris, France · Remote possible',
    type: 'CDI',
    posted: '2025-06-12',
    description: 'Pour un fonds d\'investissement focalisé sur l\'Afrique sub-saharienne.',
    applications: 4,
  },
]

const STATUS_MAP = {
  confirmée:    { label: 'Confirmée',    cls: 'text-success bg-success-light' },
  rejetée:      { label: 'Rejetée',      cls: 'text-danger bg-red-50' },
  en_attente:   { label: 'En attente',   cls: 'text-[#D97706] bg-[#FFFBEB]' },
  non_demandée: { label: 'Non demandée', cls: 'text-text-tertiary bg-[#F3F4F6]' },
}

const TABS = ['Aperçu', 'Vérifications', 'Offres', 'Équipe', 'Profil']

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function OrgDashboardPage() {
  const [tab, setTab] = useState(0)
  const [saved, setSaved] = useState(false)
  const [members, setMembers] = useState(INIT_MEMBERS)
  const [offers, setOffers] = useState(INIT_OFFERS)
  const [requests, setRequests] = useState(MOCK_VERIFICATION_REQUESTS)
  const [inviteEmail, setInviteEmail] = useState('')
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [newOffer, setNewOffer] = useState({ title: '', location: '', type: 'CDI', description: '' })

  const pending = requests.filter(r => r.status === 'en_attente')
  const history = requests.filter(r => r.status !== 'en_attente')
  const totalApplications = offers.reduce((acc, o) => acc + o.applications, 0)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const handleVerif = (id: string, action: 'confirmée' | 'rejetée') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action, resolvedAt: '2026-06-24' } : r))
  }

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    const parts = inviteEmail.split('@')[0].split('.')
    const name = parts.map(p => p[0]?.toUpperCase() + p.slice(1)).join(' ')
    setMembers(prev => [...prev, {
      id: `m${Date.now()}`, name, title: 'Nouveau membre', email: inviteEmail,
      initials: parts.map(p => p[0]?.toUpperCase()).join('').slice(0, 2),
      role: 'member' as const, verified: false,
    }])
    setInviteEmail('')
  }

  const addOffer = () => {
    if (!newOffer.title.trim()) return
    setOffers(prev => [{ id: `o${Date.now()}`, ...newOffer, posted: new Date().toISOString().split('T')[0], applications: 0 }, ...prev])
    setNewOffer({ title: '', location: '', type: 'CDI', description: '' })
    setShowOfferForm(false)
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0C0A18] flex items-center justify-center flex-shrink-0">
                <span className="text-base font-extrabold text-white">{ORG.initials}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-text-primary">{ORG.name}</h1>
                  {ORG.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-2 py-0.5 rounded-badge">
                      <IconCircleCheck size={11} /> Vérifiée
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mt-0.5">{ORG.tagline}</p>
              </div>
            </div>
            <Link
              href={`/org/${ORG.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary bg-white border border-[#E5E7EB] px-3 py-2 rounded-lg hover:text-primary hover:border-primary transition-colors"
            >
              <IconExternalLink size={13} />
              Voir la page publique
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
            {TABS.map((t, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                className={`relative px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  tab === i ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {t}
                {i === 1 && pending.length > 0 && (
                  <span className="ml-1.5 text-[10px] bg-[#D97706] text-white px-1.5 py-0.5 rounded-badge">{pending.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── APERÇU ── */}
          {tab === 0 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: IconEye, label: 'Vues cette semaine', value: '143', color: 'text-primary', bg: 'bg-primary-light' },
                  { icon: IconFileText, label: 'Candidatures', value: String(totalApplications), color: 'text-secondary', bg: 'bg-[#FEF9EE]' },
                  { icon: IconBriefcase, label: 'Offres actives', value: String(offers.length), color: 'text-success', bg: 'bg-success-light' },
                  { icon: IconClock, label: 'Vérifications en attente', value: String(pending.length), color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]' },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <div key={label} className="card p-4">
                    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                      <Icon size={18} className={color} />
                    </div>
                    <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                    <p className="text-xs text-text-secondary mt-0.5 font-medium">{label}</p>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <button onClick={() => setTab(1)} className="card p-4 flex items-center gap-3 hover:border-primary transition-colors text-left group">
                  <div className="w-9 h-9 bg-[#FFFBEB] rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconCircleCheck size={18} className="text-[#D97706]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">Vérifications</p>
                    <p className="text-xs text-text-tertiary">{pending.length} en attente</p>
                  </div>
                </button>
                <button onClick={() => setTab(2)} className="card p-4 flex items-center gap-3 hover:border-primary transition-colors text-left group">
                  <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconPlus size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">Publier une offre</p>
                    <p className="text-xs text-text-tertiary">{offers.length} actives</p>
                  </div>
                </button>
                <button onClick={() => setTab(3)} className="card p-4 flex items-center gap-3 hover:border-primary transition-colors text-left group">
                  <div className="w-9 h-9 bg-[#FEF9EE] rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconUsers size={18} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">Équipe</p>
                    <p className="text-xs text-text-tertiary">{members.length} membres</p>
                  </div>
                </button>
              </div>

              {/* Recent verif requests */}
              {pending.length > 0 && (
                <div className="card space-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-text-primary text-sm">Demandes de vérification récentes</p>
                    <button onClick={() => setTab(1)} className="text-xs text-primary font-medium hover:underline">Tout traiter →</button>
                  </div>
                  {pending.slice(0, 2).map(req => (
                    <div key={req.id} className="flex items-center gap-3 py-3 border-b border-[#F3F4F6] last:border-0">
                      <div className={`text-xs font-semibold px-2 py-0.5 rounded-badge flex-shrink-0 ${req.type === 'experience' ? 'bg-primary-light text-primary' : 'bg-secondary-light text-secondary'}`}>
                        {req.type === 'experience' ? 'Expérience' : 'Formation'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{req.itemTitle}</p>
                        <p className="text-xs text-text-tertiary">{req.profileName}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleVerif(req.id, 'confirmée')} className="text-xs font-semibold text-success bg-success-light hover:bg-[#D1FAE5] px-2.5 py-1.5 rounded-lg transition-colors">Confirmer</button>
                        <button onClick={() => handleVerif(req.id, 'rejetée')} className="text-xs font-semibold text-danger bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors">Rejeter</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── VÉRIFICATIONS ── */}
          {tab === 1 && (
            <div className="space-y-4">
              <div className="flex gap-3 border-b border-[#F3F4F6] pb-1">
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold text-[#D97706]">{pending.length}</span> en attente ·{' '}
                  <span className="font-semibold text-text-primary">{history.length}</span> traitées
                </p>
              </div>

              {/* Pending */}
              {pending.length === 0 ? (
                <div className="text-center py-12">
                  <IconCircleCheck size={40} className="mx-auto mb-3 text-success" />
                  <p className="font-medium text-text-primary">Aucune demande en attente</p>
                  <p className="text-sm text-text-tertiary mt-1">Toutes les demandes ont été traitées</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-text-tertiary uppercase tracking-[0.1em]">En attente</p>
                  {pending.map(req => (
                    <div key={req.id} className="card border-l-4 border-l-[#D97706]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-badge ${req.type === 'experience' ? 'bg-primary-light text-primary' : 'bg-secondary-light text-secondary'}`}>
                              {req.type === 'experience' ? 'Expérience' : 'Formation'}
                            </span>
                            <span className="text-xs text-text-tertiary flex items-center gap-1">
                              <IconClock size={11} /> Envoyé le {req.sentAt}
                            </span>
                          </div>
                          <p className="font-semibold text-text-primary mt-2">{req.itemTitle}</p>
                          <p className="text-sm text-text-secondary mt-1">
                            Demandé par <span className="font-medium">{req.profileName}</span>
                            <span className="text-text-tertiary"> · {req.profileTitle}</span>
                          </p>
                          <p className="text-xs text-text-tertiary mt-1">{req.institutionEmail}</p>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button onClick={() => handleVerif(req.id, 'confirmée')} className="flex items-center gap-1.5 text-sm font-semibold text-success bg-success-light hover:bg-[#D1FAE5] px-3 py-2 rounded-btn transition-colors">
                            <IconCircleCheck size={15} /> Confirmer
                          </button>
                          <button onClick={() => handleVerif(req.id, 'rejetée')} className="flex items-center gap-1.5 text-sm font-semibold text-danger bg-red-50 hover:bg-red-100 px-3 py-2 rounded-btn transition-colors">
                            <IconX size={15} /> Rejeter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* History */}
              {history.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-text-tertiary uppercase tracking-[0.1em] mt-2">Historique</p>
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
                        {history.map(req => {
                          const s = STATUS_MAP[req.status]
                          return (
                            <tr key={req.id}>
                              <td className="py-3 pr-4 font-medium text-text-primary">{req.profileName}</td>
                              <td className="py-3 pr-4 text-text-secondary max-w-[180px] truncate">{req.itemTitle}</td>
                              <td className="py-3 pr-4 text-text-tertiary">{req.resolvedAt ?? '—'}</td>
                              <td className="py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-badge ${s.cls}`}>{s.label}</span></td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── OFFRES ── */}
          {tab === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary"><span className="font-semibold text-text-primary">{offers.length}</span> offres actives</p>
                <button onClick={() => setShowOfferForm(v => !v)} className="btn-primary">
                  <IconPlus size={15} /> Nouvelle offre
                </button>
              </div>

              {showOfferForm && (
                <div className="card space-y-4 border-primary/30">
                  <p className="font-semibold text-text-primary text-sm">Créer une offre</p>
                  <div>
                    <label className="label">Intitulé du poste</label>
                    <input className="input" placeholder="ex. Développeur Full Stack" value={newOffer.title} onChange={e => setNewOffer(p => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Localisation</label>
                      <input className="input" placeholder="ex. Dakar, Sénégal" value={newOffer.location} onChange={e => setNewOffer(p => ({ ...p, location: e.target.value }))} />
                    </div>
                    <div>
                      <label className="label">Type de contrat</label>
                      <select className="input" value={newOffer.type} onChange={e => setNewOffer(p => ({ ...p, type: e.target.value }))}>
                        <option>CDI</option><option>CDD</option><option>Freelance</option><option>Stage</option><option>Alternance</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea className="input resize-none" rows={3} placeholder="Missions et prérequis..." value={newOffer.description} onChange={e => setNewOffer(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowOfferForm(false)} className="btn-secondary">Annuler</button>
                    <button onClick={addOffer} className="btn-primary">Publier</button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {offers.map(offer => (
                  <div key={offer.id} className="card space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary">{offer.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs text-text-tertiary flex items-center gap-1"><IconMapPin size={12} />{offer.location}</span>
                          <span className="text-[#E5E7EB]">·</span>
                          <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-badge">{offer.type}</span>
                          <span className="text-[#E5E7EB]">·</span>
                          <span className="text-xs text-text-tertiary">{fmtDate(offer.posted)}</span>
                        </div>
                        <p className="text-sm text-text-secondary mt-2 leading-relaxed">{offer.description}</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-semibold text-success bg-success-light px-2 py-1 rounded-lg flex-shrink-0">
                        <IconFileText size={12} />{offer.applications} candidature{offer.applications > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-[#F3F4F6]">
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-text-primary bg-[#F3F4F6] hover:bg-primary-light hover:text-primary px-3 py-2 rounded-lg transition-colors">
                        <IconPencil size={13} />Modifier
                      </button>
                      <button onClick={() => setOffers(prev => prev.filter(o => o.id !== offer.id))} className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-danger hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                        <IconTrash size={13} />Supprimer
                      </button>
                      <Link href={`/org/${ORG.slug}`} target="_blank" className="ml-auto flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary px-3 py-2 rounded-lg transition-colors">
                        <IconArrowUpRight size={13} />Voir en public
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ÉQUIPE ── */}
          {tab === 3 && (
            <div className="space-y-4">
              <div className="card space-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-text-primary flex items-center gap-2">
                    <IconUsers size={17} className="text-primary" />
                    Membres de l&apos;équipe
                  </h2>
                  <span className="text-xs text-text-tertiary">{members.length} membres</span>
                </div>
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-3 py-3 border-b border-[#F3F4F6] last:border-0">
                    <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-text-primary">{member.name}</p>
                        {member.verified && <IconCircleCheck size={13} className="text-success flex-shrink-0" />}
                        {member.role === 'admin' && <span className="text-[10px] font-semibold text-primary bg-primary-light px-1.5 py-0.5 rounded-badge">Admin</span>}
                      </div>
                      <p className="text-xs text-text-tertiary truncate">{member.title} · {member.email}</p>
                    </div>
                    {member.role !== 'admin' && (
                      <button onClick={() => setMembers(prev => prev.filter(m => m.id !== member.id))} className="w-7 h-7 rounded-lg bg-[#F3F4F6] hover:bg-red-50 flex items-center justify-center text-text-tertiary hover:text-danger transition-colors flex-shrink-0" aria-label="Retirer">
                        <IconX size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="card space-y-3">
                <p className="font-semibold text-text-primary text-sm flex items-center gap-2">
                  <IconSend size={15} className="text-primary" />
                  Inviter un membre
                </p>
                <p className="text-xs text-text-tertiary">
                  Le membre recevra un email d&apos;invitation. Utilisez une adresse <span className="font-mono font-semibold">@talentagricagroup.com</span> pour une vérification automatique.
                </p>
                <div className="flex gap-2">
                  <input className="input flex-1" type="email" placeholder="prenom.nom@organisation.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInvite()} />
                  <button onClick={handleInvite} className="btn-primary px-4">Inviter</button>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFIL ── */}
          {tab === 4 && (
            <div className="space-y-4">
              <div className="card space-y-5">
                <h2 className="font-semibold text-text-primary flex items-center gap-2">
                  <IconBuilding size={17} className="text-primary" />
                  Identité de l&apos;organisation
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0C0A18] flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-extrabold text-white">{ORG.initials}</span>
                  </div>
                  <button className="text-xs font-semibold text-primary border border-primary/30 bg-primary-light px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors">
                    Changer le logo
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Nom</label><input className="input" defaultValue={ORG.name} /></div>
                  <div><label className="label">Secteur</label><input className="input" defaultValue={ORG.sector} /></div>
                </div>
                <div><label className="label">Accroche</label><input className="input" defaultValue={ORG.tagline} /></div>
                <div><label className="label">Description</label><textarea className="input resize-none" rows={4} defaultValue={ORG.description} /></div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div><label className="label">Ville</label><input className="input" defaultValue={ORG.city} /></div>
                  <div><label className="label">Pays</label><input className="input" defaultValue={ORG.country} /></div>
                  <div><label className="label">Fondée en</label><input className="input" defaultValue={ORG.founded} /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Taille</label>
                    <select className="input">
                      <option>1–10 employés</option>
                      <option defaultValue="10–50 employés">10–50 employés</option>
                      <option>50–200 employés</option>
                      <option>200–1000 employés</option>
                      <option>+1000 employés</option>
                    </select>
                  </div>
                  <div><label className="label">Site web</label><input className="input" type="url" defaultValue={ORG.websiteUrl} /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="label">Email</label><input className="input" type="email" defaultValue={ORG.email} /></div>
                  <div><label className="label">WhatsApp</label><input className="input" type="tel" defaultValue={ORG.whatsapp} /></div>
                </div>
                <div className="flex justify-end">
                  <button onClick={handleSave} className="btn-primary">
                    {saved ? <><IconCheck size={15} /> Enregistré</> : 'Enregistrer'}
                  </button>
                </div>
              </div>

              <div className="card space-y-3">
                <p className="font-semibold text-text-primary text-sm flex items-center gap-2">
                  <IconCircleCheck size={17} className="text-success" />
                  Statut de vérification
                </p>
                <div className="flex items-center gap-3 py-3 px-4 bg-success-light border border-[#A7F3D0] rounded-xl">
                  <IconCircleCheck size={20} className="text-success flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-success">Organisation vérifiée</p>
                    <p className="text-xs text-success/80 mt-0.5">Votre domaine email a été confirmé par bcarte.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <BottomNav />
    </div>
  )
}
