'use client'

import { useEffect, useState } from 'react'
import { IconPlus, IconX, IconCircleCheck, IconClock, IconCheck, IconLoader2, IconPencil } from '@tabler/icons-react'
import { COUNTRIES } from '@/lib/constants'

const STATUS: Record<string, { label: string; className: string }> = {
  EN_ATTENTE: { label: 'En attente',  className: 'badge-pending'   },
  CONFIRMEE:  { label: 'Confirmée',   className: 'badge-verified'  },
  REJETEE:    { label: 'Rejetée',     className: 'badge-rejected'  },
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
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
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => {
      if (d) {
        setProfile(d)
        setSkills(d.skills ?? [])
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
      body: JSON.stringify({ ...form, skills }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !skills.includes(s) && skills.length < 15) {
      setSkills([...skills, s])
      setNewSkill('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <IconLoader2 size={22} className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-5">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Mon profil</h1>
          <p className="page-subtitle">Gérez vos informations professionnelles</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <IconLoader2 size={15} className="animate-spin" /> : saved ? <IconCheck size={15} /> : null}
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      {/* Carte identité */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-xl font-black flex-shrink-0">
          {form.fullName ? initials(form.fullName) : '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-primary text-base">{form.fullName || 'Votre nom'}</p>
          <p className="text-sm text-text-secondary mt-0.5">{form.title || 'Titre non renseigné'}</p>
          <p className="text-xs text-text-tertiary mt-0.5">{[form.city, form.country].filter(Boolean).join(', ')}</p>
        </div>
        <button className="btn-ghost text-xs gap-1.5">
          <IconPencil size={13} /> Modifier la photo
        </button>
      </div>

      {/* Informations générales */}
      <div className="card space-y-5">
        <h2 className="font-semibold text-text-primary">Informations générales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Nom complet', key: 'fullName', placeholder: 'Prénom Nom' },
            { label: 'Titre / Poste', key: 'title',  placeholder: 'ex: Ingénieur Logiciel' },
            { label: 'Ville',         key: 'city',   placeholder: 'Dakar' },
            { label: 'Téléphone',     key: 'phone',  placeholder: '+221 77 000 0000' },
            { label: 'LinkedIn',      key: 'linkedin', placeholder: 'linkedin.com/in/…' },
          ].map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <input className="input" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} />
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
        <div className="flex flex-wrap gap-2 min-h-[36px]">
          {skills.length === 0
            ? <p className="text-sm text-text-tertiary">Aucune compétence ajoutée</p>
            : skills.map(s => (
              <span key={s} className="flex items-center gap-1.5 bg-primary-light text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                {s}
                <button onClick={() => setSkills(skills.filter(x => x !== s))} className="hover:text-primary-hover transition-colors">
                  <IconX size={11} />
                </button>
              </span>
            ))
          }
        </div>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="React, Finance, Leadership…"
          />
          <button onClick={addSkill} className="btn-primary px-4">
            <IconPlus size={15} />
          </button>
        </div>
      </div>

      {/* Expériences */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Expériences</h2>
          <button className="btn-ghost text-xs gap-1">
            <IconPlus size={13} /> Ajouter
          </button>
        </div>
        {(profile?.experiences ?? []).length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <p className="text-sm text-text-tertiary">Aucune expérience enregistrée</p>
            <p className="text-xs text-text-tertiary mt-1">Ajoutez vos expériences professionnelles</p>
          </div>
        ) : profile.experiences.map((exp: any, i: number) => {
          const st = STATUS[exp.status]
          return (
            <div key={exp.id} className={`flex items-start gap-4 ${i < profile.experiences.length - 1 ? 'pb-4 border-b border-border-subtle' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-border-subtle flex items-center justify-center text-xs font-bold text-text-secondary flex-shrink-0">
                {exp.company?.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{exp.title}</p>
                <p className="text-xs text-text-secondary mt-0.5">{exp.company}</p>
                {st && (
                  <span className={`mt-1.5 inline-flex items-center gap-1 ${st.className}`}>
                    {exp.status === 'EN_ATTENTE' ? <IconClock size={9} /> : <IconCircleCheck size={9} />}
                    {st.label}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Formations */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Formations</h2>
          <button className="btn-ghost text-xs gap-1">
            <IconPlus size={13} /> Ajouter
          </button>
        </div>
        {(profile?.educations ?? []).length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
            <p className="text-sm text-text-tertiary">Aucune formation enregistrée</p>
            <p className="text-xs text-text-tertiary mt-1">Ajoutez vos diplômes et certifications</p>
          </div>
        ) : profile.educations.map((edu: any, i: number) => {
          const st = STATUS[edu.status]
          return (
            <div key={edu.id} className={`flex items-start gap-4 ${i < profile.educations.length - 1 ? 'pb-4 border-b border-border-subtle' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-border-subtle flex items-center justify-center text-xs font-bold text-text-secondary flex-shrink-0">
                {(edu.organisation?.name ?? '??').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{edu.degree}</p>
                <p className="text-xs text-text-secondary mt-0.5">{edu.organisation?.name ?? '—'}{edu.field ? ` · ${edu.field}` : ''}</p>
                {st && <span className={`mt-1.5 inline-flex ${st.className}`}>{st.label}</span>}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
