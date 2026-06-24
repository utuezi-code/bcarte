'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  IconBuilding, IconCircleCheck, IconExternalLink, IconEye,
  IconBriefcase, IconUsers, IconChartBar, IconPlus, IconTrash,
  IconPencil, IconMapPin, IconMail, IconBrandWhatsapp, IconWorld,
  IconCheck, IconX, IconArrowUpRight, IconSend, IconStack2,
  IconCalendar, IconFileText,
} from '@tabler/icons-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

const ORG = {
  slug: 'talent-africa-group',
  name: 'Talent Africa Group',
  initials: 'TA',
  tagline: 'Cabinet de recrutement spécialisé en Afrique de l\'Ouest',
  description: 'Talent Africa Group connecte les meilleurs talents tech, finance et management aux entreprises qui façonnent l\'avenir de l\'Afrique. Fondé à Dakar en 2019, le cabinet opère dans 8 pays et a réalisé plus de 340 placements.',
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
  completionPercent: 90,
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
    sector: 'Technologie',
    posted: '2025-06-20',
    description: 'Rejoignez une startup en forte croissance pour développer des solutions SaaS à destination des PME africaines.',
    applications: 12,
  },
  {
    id: 'o2',
    title: 'Responsable Marketing Digital',
    location: 'Abidjan, Côte d\'Ivoire',
    type: 'CDI',
    sector: 'Marketing',
    posted: '2025-06-15',
    description: 'Pilotez la stratégie digitale d\'un groupe bancaire panafricain. 5 ans d\'expérience minimum requis.',
    applications: 7,
  },
  {
    id: 'o3',
    title: 'Analyste Financier Senior',
    location: 'Paris, France · Remote possible',
    type: 'CDI',
    sector: 'Finance',
    posted: '2025-06-12',
    description: 'Pour un fonds d\'investissement focalisé sur l\'Afrique sub-saharienne. CFA ou équivalent requis.',
    applications: 4,
  },
]

const APPLICATIONS = [
  { id: 'a1', offerId: 'o1', offerTitle: 'Développeur Full Stack React / Node.js', name: 'Kofi Asante', title: 'Développeur Full Stack', city: 'Accra, Ghana', date: 'Il y a 1 jour', via: 'email' as const },
  { id: 'a2', offerId: 'o1', offerTitle: 'Développeur Full Stack React / Node.js', name: 'Fatou Mbaye', title: 'Lead Developer', city: 'Dakar, Sénégal', date: 'Il y a 2 jours', via: 'whatsapp' as const },
  { id: 'a3', offerId: 'o2', offerTitle: 'Responsable Marketing Digital', name: 'Aïssatou Camara', title: 'Chargée de communication', city: 'Conakry, Guinée', date: 'Il y a 3 jours', via: 'email' as const },
  { id: 'a4', offerId: 'o1', offerTitle: 'Développeur Full Stack React / Node.js', name: 'Moussa Traoré', title: 'Développeur Backend', city: 'Bamako, Mali', date: 'Il y a 4 jours', via: 'email' as const },
  { id: 'a5', offerId: 'o3', offerTitle: 'Analyste Financier Senior', name: 'Mariama Bah', title: 'Analyste Financière', city: 'Paris, France', date: 'Il y a 5 jours', via: 'whatsapp' as const },
]

const TABS = ['Aperçu', 'Profil', 'Équipe', 'Offres', 'Candidatures']

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function OrgDashboardPage() {
  const [tab, setTab] = useState(0)
  const [saved, setSaved] = useState(false)
  const [members, setMembers] = useState(INIT_MEMBERS)
  const [offers, setOffers] = useState(INIT_OFFERS)
  const [inviteEmail, setInviteEmail] = useState('')
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState<string | null>(null)
  const [newOffer, setNewOffer] = useState({ title: '', location: '', type: 'CDI', sector: '', description: '' })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    const parts = inviteEmail.split('@')[0].split('.')
    const name = parts.map(p => p[0]?.toUpperCase() + p.slice(1)).join(' ')
    setMembers(prev => [...prev, {
      id: `m${Date.now()}`,
      name,
      title: 'Nouveau membre',
      email: inviteEmail,
      initials: parts.map(p => p[0]?.toUpperCase()).join('').slice(0, 2),
      role: 'member' as const,
      verified: false,
    }])
    setInviteEmail('')
  }

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  const addOffer = () => {
    if (!newOffer.title.trim()) return
    setOffers(prev => [{
      id: `o${Date.now()}`,
      ...newOffer,
      posted: new Date().toISOString().split('T')[0],
      applications: 0,
    }, ...prev])
    setNewOffer({ title: '', location: '', type: 'CDI', sector: '', description: '' })
    setShowOfferForm(false)
  }

  const removeOffer = (id: string) => setOffers(prev => prev.filter(o => o.id !== id))

  const totalApplications = offers.reduce((acc, o) => acc + o.applications, 0)

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0C0A18] flex items-center justify-center flex-shrink-0">
                <span className="text-base font-extrabold text-white tracking-tight">{ORG.initials}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-text-primary">{ORG.name}</h1>
                  {ORG.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success-light border border-[#A7F3D0] px-2 py-0.5 rounded-badge">
                      <IconCircleCheck size={11} />
                      Vérifiée
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
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  tab === i ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* ── APERÇU ── */}
          {tab === 0 && (
            <div className="space-y-5">

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: IconEye, label: 'Vues cette semaine', value: '143', color: 'text-primary', bg: 'bg-primary-light' },
                  { icon: IconFileText, label: 'Candidatures reçues', value: String(totalApplications), color: 'text-secondary', bg: 'bg-[#FEF9EE]' },
                  { icon: IconBriefcase, label: 'Offres actives', value: String(offers.length), color: 'text-success', bg: 'bg-success-light' },
                  { icon: IconUsers, label: 'Membres équipe', value: String(members.length), color: 'text-text-primary', bg: 'bg-bg-light' },
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

              {/* Completion */}
              <div className="card space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">Complétude du profil</p>
                  <span className="text-sm font-bold text-primary">{ORG.completionPercent}%</span>
                </div>
                <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${ORG.completionPercent}%` }} />
                </div>
                <p className="text-xs text-text-tertiary">Ajoutez une description détaillée et vos réseaux sociaux pour atteindre 100%.</p>
              </div>

              {/* Quick actions */}
              <div className="grid sm:grid-cols-3 gap-3">
                <button onClick={() => setTab(3)} className="card p-4 flex items-center gap-3 hover:border-primary hover:border transition-colors text-left group">
                  <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconPlus size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">Publier une offre</p>
                    <p className="text-xs text-text-tertiary">Trouver un talent</p>
                  </div>
                </button>
                <button onClick={() => setTab(2)} className="card p-4 flex items-center gap-3 hover:border-primary hover:border transition-colors text-left group">
                  <div className="w-9 h-9 bg-[#FEF9EE] rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconUsers size={18} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">Inviter un membre</p>
                    <p className="text-xs text-text-tertiary">{members.length} membres actuels</p>
                  </div>
                </button>
                <button onClick={() => setTab(4)} className="card p-4 flex items-center gap-3 hover:border-primary hover:border transition-colors text-left group">
                  <div className="w-9 h-9 bg-success-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconChartBar size={18} className="text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">Voir candidatures</p>
                    <p className="text-xs text-text-tertiary">{totalApplications} reçues</p>
                  </div>
                </button>
              </div>

              {/* Recent applications */}
              {APPLICATIONS.length > 0 && (
                <div className="card space-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-text-primary text-sm">Candidatures récentes</p>
                    <button onClick={() => setTab(4)} className="text-xs text-primary hover:underline font-medium">Tout voir →</button>
                  </div>
                  {APPLICATIONS.slice(0, 3).map(app => (
                    <div key={app.id} className="flex items-center gap-3 py-3 border-b border-[#F3F4F6] last:border-0">
                      <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                        {app.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{app.name}</p>
                        <p className="text-xs text-text-tertiary truncate">{app.offerTitle}</p>
                      </div>
                      <span className="text-xs text-text-tertiary flex-shrink-0">{app.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PROFIL ── */}
          {tab === 1 && (
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
                  <div>
                    <p className="text-xs text-text-tertiary mb-2">Logo de l&apos;organisation</p>
                    <button className="text-xs font-semibold text-primary border border-primary/30 bg-primary-light px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors">
                      Changer le logo
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nom de l&apos;organisation</label>
                    <input className="input" defaultValue={ORG.name} />
                  </div>
                  <div>
                    <label className="label">Secteur d&apos;activité</label>
                    <input className="input" defaultValue={ORG.sector} />
                  </div>
                </div>

                <div>
                  <label className="label">Accroche</label>
                  <input className="input" defaultValue={ORG.tagline} />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea className="input resize-none" rows={4} defaultValue={ORG.description} />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Ville</label>
                    <input className="input" defaultValue={ORG.city} />
                  </div>
                  <div>
                    <label className="label">Pays</label>
                    <input className="input" defaultValue={ORG.country} />
                  </div>
                  <div>
                    <label className="label">Année de fondation</label>
                    <input className="input" defaultValue={ORG.founded} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Taille</label>
                    <select className="input">
                      <option>1–10 employés</option>
                      <option selected>10–50 employés</option>
                      <option>50–200 employés</option>
                      <option>200–1000 employés</option>
                      <option>+1000 employés</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Site web</label>
                    <input className="input" type="url" defaultValue={ORG.websiteUrl} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email de contact</label>
                    <input className="input" type="email" defaultValue={ORG.email} />
                  </div>
                  <div>
                    <label className="label">WhatsApp</label>
                    <input className="input" type="tel" defaultValue={ORG.whatsapp} />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSave} className="btn-primary">
                    {saved ? <><IconCheck size={15} /> Enregistré</> : 'Enregistrer les modifications'}
                  </button>
                </div>
              </div>

              {/* Verification status */}
              <div className="card space-y-3">
                <h2 className="font-semibold text-text-primary flex items-center gap-2 text-sm">
                  <IconCircleCheck size={17} className="text-success" />
                  Statut de vérification
                </h2>
                <div className="flex items-center gap-3 py-3 px-4 bg-success-light border border-[#A7F3D0] rounded-xl">
                  <IconCircleCheck size={20} className="text-success flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-success">Organisation vérifiée</p>
                    <p className="text-xs text-success/80 mt-0.5">Votre domaine email a été confirmé par l&apos;équipe bcarte.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ÉQUIPE ── */}
          {tab === 2 && (
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
                        {member.role === 'admin' && (
                          <span className="text-[10px] font-semibold text-primary bg-primary-light px-1.5 py-0.5 rounded-badge">Admin</span>
                        )}
                      </div>
                      <p className="text-xs text-text-tertiary truncate">{member.title} · {member.email}</p>
                    </div>
                    {member.role !== 'admin' && (
                      <button
                        onClick={() => removeMember(member.id)}
                        className="w-7 h-7 rounded-lg bg-[#F3F4F6] hover:bg-red-50 flex items-center justify-center text-text-tertiary hover:text-danger transition-colors flex-shrink-0"
                        aria-label="Retirer le membre"
                      >
                        <IconX size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Invite */}
              <div className="card space-y-3">
                <h2 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                  <IconSend size={15} className="text-primary" />
                  Inviter un membre
                </h2>
                <p className="text-xs text-text-tertiary">
                  Le membre recevra un email d&apos;invitation. Son compte bcarte sera lié à votre organisation après confirmation.
                </p>
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    type="email"
                    placeholder="prenom.nom@organisation.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                  />
                  <button onClick={handleInvite} className="btn-primary px-4">
                    Inviter
                  </button>
                </div>
                <p className="text-[11px] text-text-tertiary">
                  Idéalement, utilisez une adresse email du domaine <span className="font-mono font-semibold">@talentagricagroup.com</span> pour une vérification automatique.
                </p>
              </div>
            </div>
          )}

          {/* ── OFFRES ── */}
          {tab === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-secondary"><span className="font-semibold text-text-primary">{offers.length}</span> offres actives</p>
                <button onClick={() => setShowOfferForm(v => !v)} className="btn-primary">
                  <IconPlus size={15} />
                  Nouvelle offre
                </button>
              </div>

              {/* Create form */}
              {showOfferForm && (
                <div className="card space-y-4 border-primary/30">
                  <h2 className="font-semibold text-text-primary text-sm">Créer une offre d&apos;emploi</h2>
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
                        <option>CDI</option>
                        <option>CDD</option>
                        <option>Freelance</option>
                        <option>Stage</option>
                        <option>Alternance</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea className="input resize-none" rows={3} placeholder="Décrivez le poste, les missions et les prérequis..." value={newOffer.description} onChange={e => setNewOffer(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setShowOfferForm(false)} className="btn-secondary">Annuler</button>
                    <button onClick={addOffer} className="btn-primary">Publier l&apos;offre</button>
                  </div>
                </div>
              )}

              {/* Offers list */}
              <div className="space-y-3">
                {offers.map(offer => (
                  <div key={offer.id} className="card space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary">{offer.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs text-text-tertiary flex items-center gap-1">
                            <IconMapPin size={12} />
                            {offer.location}
                          </span>
                          <span className="text-[#E5E7EB]">·</span>
                          <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-badge">{offer.type}</span>
                          <span className="text-[#E5E7EB]">·</span>
                          <span className="text-xs text-text-tertiary">{fmtDate(offer.posted)}</span>
                        </div>
                        <p className="text-sm text-text-secondary mt-2 leading-relaxed">{offer.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="flex items-center gap-1 text-xs font-semibold text-success bg-success-light px-2 py-1 rounded-lg">
                          <IconFileText size={12} />
                          {offer.applications} candidature{offer.applications > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-[#F3F4F6]">
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-text-primary bg-[#F3F4F6] hover:bg-primary-light hover:text-primary px-3 py-2 rounded-lg transition-colors">
                        <IconPencil size={13} />
                        Modifier
                      </button>
                      <button
                        onClick={() => removeOffer(offer.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-danger hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <IconTrash size={13} />
                        Supprimer
                      </button>
                      <Link
                        href={`/org/${ORG.slug}`}
                        target="_blank"
                        className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary px-3 py-2 rounded-lg transition-colors"
                      >
                        <IconArrowUpRight size={13} />
                        Voir en public
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CANDIDATURES ── */}
          {tab === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">{APPLICATIONS.length}</span> candidatures reçues
              </p>
              <div className="card space-y-1">
                {APPLICATIONS.map(app => (
                  <div key={app.id} className="flex items-center gap-3 py-4 border-b border-[#F3F4F6] last:border-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {app.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">{app.name}</p>
                      <p className="text-xs text-text-secondary">{app.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-text-tertiary flex items-center gap-1">
                          <IconMapPin size={11} />
                          {app.city}
                        </span>
                        <span className="text-[#E5E7EB]">·</span>
                        <span className="text-xs text-text-tertiary">{app.offerTitle}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-xs text-text-tertiary">{app.date}</span>
                      <div className="flex gap-1.5">
                        {app.via === 'whatsapp' ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-whatsapp bg-[#ECFDF5] px-2 py-0.5 rounded-badge">
                            <IconBrandWhatsapp size={11} />
                            WhatsApp
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-text-secondary bg-[#F3F4F6] px-2 py-0.5 rounded-badge">
                            <IconMail size={11} />
                            Email
                          </span>
                        )}
                      </div>
                    </div>
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
