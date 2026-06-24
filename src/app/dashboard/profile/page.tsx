'use client'

import { useEffect, useState } from 'react'
import { IconPlus, IconTrash, IconCircleCheck, IconClock, IconCheck, IconLoader2 } from '@tabler/icons-react'
import { SECTORS, COUNTRIES, LANGUAGES } from '@/lib/constants'

const STATUS_COLORS: Record<string, string> = {
  EN_ATTENTE: 'text-[#D97706] bg-[#FFFBEB]',
  CONFIRMEE:  'text-success bg-success-light',
  REJETEE:    'text-danger bg-red-50',
}
const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE:  'Confirmée',
  REJETEE:    'Rejetée',
}

export default function ProfilePage() {
  const [profile, setProfile]   = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [skills, setSkills]     = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [form, setForm]         = useState({
    fullName: '', title: '', city: '', country: 'Sénégal', bio: '', phone: '', linkedin: '',
  })

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setProfile(d)
          setForm({
            fullName: d.fullName ?? '',
            title:    d.title    ?? '',
            city:     d.city     ?? '',
            country:  d.country  ?? 'Sénégal',
            bio:      d.bio      ?? '',
            phone:    d.phone    ?? '',
            linkedin: d.linkedin ?? '',
          })
        }
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !skills.includes(s) && skills.length < 10) {
      setSkills([...skills, s])
      setNewSkill('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <IconLoader2 size={24} className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Mon profil</h1>
          <p className="text-sm text-text-secondary mt-1">Gérez vos informations professionnelles</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary px-5 py-2.5 flex items-center gap-2">
          {saving && <IconLoader2 size={16} className="animate-spin" />}
          {saved  && <IconCheck size={16} />}
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      {/* Infos générales */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-text-primary">Informations générales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Nom complet *', key: 'fullName', placeholder: 'Prénom Nom' },
            { label: 'Titre / Poste', key: 'title',    placeholder: 'ex: Ingénieur Logiciel' },
            { label: 'Ville',         key: 'city',     placeholder: 'Dakar' },
            { label: 'Téléphone',     key: 'phone',    placeholder: '+221 77 000 0000' },
            { label: 'LinkedIn',      key: 'linkedin', placeholder: 'linkedin.com/in/…' },
          ].map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input
                className="input"
                value={(form as any)[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
              />
            </div>
          ))}
          <div>
            <label className="label">Pays</label>
            <select className="input" value={form.country} onChange={e => setForm({...form, country: e.target.value})}>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea className="input min-h-[90px] resize-none" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Présentez-vous en quelques lignes…" />
        </div>
      </div>

      {/* Compétences */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-text-primary">Compétences</h2>
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {skills.length === 0 && <p className="text-sm text-text-tertiary">Aucune compétence ajoutée</p>}
          {skills.map(s => (
            <span key={s} className="flex items-center gap-1.5 bg-primary-light text-primary text-sm px-3 py-1 rounded-full">
              {s}
              <button onClick={() => setSkills(skills.filter(x => x !== s))}><IconTrash size={12} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input flex-1" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="React, Finance, Leadership…" />
          <button onClick={addSkill} className="btn-primary px-4"><IconPlus size={16} /></button>
        </div>
      </div>

      {/* Expériences */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Expériences</h2>
          <button className="text-sm text-primary font-medium flex items-center gap-1"><IconPlus size={15} /> Ajouter</button>
        </div>
        {(profile?.experiences ?? []).length === 0 ? (
          <p className="text-sm text-text-tertiary text-center py-6">Aucune expérience — cliquez sur Ajouter</p>
        ) : profile.experiences.map((exp: any) => (
          <div key={exp.id} className="flex items-start gap-3 pb-4 border-b border-[#F3F4F6] last:border-0 last:pb-0">
            <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center text-xs font-bold text-text-secondary">
              {exp.company?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">{exp.title}</p>
              <p className="text-xs text-text-secondary">{exp.company}</p>
              <span className={`mt-1 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[exp.status] ?? 'text-text-tertiary bg-[#F3F4F6]'}`}>
                {exp.status === 'EN_ATTENTE' ? <IconClock size={10} /> : <IconCircleCheck size={10} />}
                {STATUS_LABELS[exp.status] ?? exp.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Formations */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Formations</h2>
          <button className="text-sm text-primary font-medium flex items-center gap-1"><IconPlus size={15} /> Ajouter</button>
        </div>
        {(profile?.educations ?? []).length === 0 ? (
          <p className="text-sm text-text-tertiary text-center py-6">Aucune formation — cliquez sur Ajouter</p>
        ) : profile.educations.map((edu: any) => (
          <div key={edu.id} className="flex items-start gap-3 pb-4 border-b border-[#F3F4F6] last:border-0 last:pb-0">
            <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center text-xs font-bold text-text-secondary">
              {(edu.organisation?.name ?? '??').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">{edu.degree}</p>
              <p className="text-xs text-text-secondary">{edu.organisation?.name ?? '—'} · {edu.field}</p>
              <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[edu.status] ?? 'text-text-tertiary bg-[#F3F4F6]'}`}>
                {STATUS_LABELS[edu.status] ?? edu.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
