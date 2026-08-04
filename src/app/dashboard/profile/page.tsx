'use client'

import { useEffect, useRef, useState } from 'react'
import {
  IconPlus, IconX, IconCircleCheck, IconClock, IconCheck,
  IconLoader2, IconBriefcase, IconSchool, IconTrash, IconMapPin,
} from '@tabler/icons-react'
import { COUNTRIES } from '@/lib/constants'

type Tab = 'infos' | 'competences' | 'experiences' | 'formations'

const STATUS = {
  EN_ATTENTE: { label: 'En attente', cls: 'badge-pending',  Icon: IconClock        },
  CONFIRMEE:  { label: 'Confirmée',  cls: 'badge-verified', Icon: IconCircleCheck  },
  REJETEE:    { label: 'Rejetée',    cls: 'badge-rejected', Icon: IconCircleCheck  },
} as const

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

function completionPct(form: Record<string, string>, skills: string[], profile: any) {
  const checks = [
    !!form.fullName, !!form.title, !!form.city, !!form.bio,
    !!form.phone, !!form.linkedin,
    skills.length > 0,
    (profile?.experiences?.length ?? 0) > 0,
    (profile?.educations?.length  ?? 0) > 0,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

const BLANK_EXP  = { title: '', company: '', city: '', startDate: '', endDate: '', isCurrent: false }
const BLANK_EDU  = { degree: '', field: '', startYear: '', endYear: '', isCurrent: false, orgSearch: '', orgId: '' }

export default function ProfilePage() {
  const [tab,      setTab]      = useState<Tab>('infos')
  const [profile,  setProfile]  = useState<any>(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [skills,   setSkills]   = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [form,     setForm]     = useState({
    fullName: '', title: '', city: '', country: 'Sénégal', bio: '', phone: '', linkedin: '',
  })

  // Experience form
  const [showExp,  setShowExp]  = useState(false)
  const [expForm,  setExpForm]  = useState(BLANK_EXP)
  const [addingExp,setAddingExp]= useState(false)

  // Education form
  const [showEdu,  setShowEdu]  = useState(false)
  const [eduForm,  setEduForm]  = useState(BLANK_EDU)
  const [addingEdu,setAddingEdu]= useState(false)
  const [orgResults,setOrgResults]=useState<any[]>([])
  const [searchOrg,setSearchOrg]=useState(false)
  const orgRef = useRef<HTMLDivElement>(null)

  /* ── Load profile ──────────────────────────────────────────────────────── */
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

  /* ── Org search (education form) ───────────────────────────────────────── */
  useEffect(() => {
    if (!eduForm.orgSearch || eduForm.orgId) { setOrgResults([]); return }
    if (eduForm.orgSearch.length < 2) { setOrgResults([]); return }
    const t = setTimeout(() => {
      setSearchOrg(true)
      fetch(`/api/orgs?search=${encodeURIComponent(eduForm.orgSearch)}`)
        .then(r => r.json()).then(d => { setOrgResults(d); setSearchOrg(false) })
    }, 300)
    return () => clearTimeout(t)
  }, [eduForm.orgSearch, eduForm.orgId])

  /* ── Dismiss org dropdown on click outside ─────────────────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (orgRef.current && !orgRef.current.contains(e.target as Node)) setOrgResults([])
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── Save profile ──────────────────────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, skills }),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  /* ── Experience CRUD ───────────────────────────────────────────────────── */
  const addExp = async () => {
    if (!expForm.title || !expForm.company) return
    setAddingExp(true)
    const res = await fetch('/api/experiences', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expForm),
    })
    if (res.ok) {
      const d = await fetch('/api/profile').then(r => r.json())
      setProfile(d); setShowExp(false); setExpForm(BLANK_EXP)
    }
    setAddingExp(false)
  }
  const delExp = async (id: string) => {
    await fetch(`/api/experiences/${id}`, { method: 'DELETE' })
    setProfile((p: any) => ({ ...p, experiences: p.experiences.filter((e: any) => e.id !== id) }))
  }

  /* ── Education CRUD ────────────────────────────────────────────────────── */
  const addEdu = async () => {
    if (!eduForm.degree || !eduForm.orgId) return
    setAddingEdu(true)
    const res = await fetch('/api/educations', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        degree: eduForm.degree, field: eduForm.field || null,
        organisationId: eduForm.orgId,
        startYear: eduForm.startYear ? parseInt(eduForm.startYear) : null,
        endYear:   eduForm.endYear && !eduForm.isCurrent ? parseInt(eduForm.endYear) : null,
        isCurrent: eduForm.isCurrent,
      }),
    })
    if (res.ok) {
      const d = await fetch('/api/profile').then(r => r.json())
      setProfile(d); setShowEdu(false); setEduForm(BLANK_EDU); setOrgResults([])
    }
    setAddingEdu(false)
  }
  const delEdu = async (id: string) => {
    await fetch(`/api/educations/${id}`, { method: 'DELETE' })
    setProfile((p: any) => ({ ...p, educations: p.educations.filter((e: any) => e.id !== id) }))
  }

  /* ── Skills ────────────────────────────────────────────────────────────── */
  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !skills.includes(s) && skills.length < 15) { setSkills([...skills, s]); setNewSkill('') }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <IconLoader2 size={24} className="animate-spin text-primary" />
    </div>
  )

  const pct = completionPct(form, skills, profile)

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'infos',        label: 'Informations' },
    { id: 'competences',  label: 'Compétences',  count: skills.length          || undefined },
    { id: 'experiences',  label: 'Expériences',  count: profile?.experiences?.length || undefined },
    { id: 'formations',   label: 'Formations',   count: profile?.educations?.length  || undefined },
  ]

  return (
    <div className="max-w-2xl space-y-4">

      {/* ── Hero card ──────────────────────────────────────────────────────── */}
      <div className="rounded-[14px] overflow-hidden shadow-card">

        {/* Gradient banner */}
        <div style={{ background: 'linear-gradient(135deg, #1A0E4E 0%, #3B1FA0 50%, #6C47FF 100%)' }}
          className="px-6 pt-6 pb-5">

          <div className="flex items-start justify-between gap-4">
            {/* Avatar + identity */}
            <div className="flex items-center gap-4">
              <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0 border border-white/25"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                {initials(form.fullName)}
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">
                  {form.fullName || 'Votre nom'}
                </p>
                <p className="text-white/70 text-sm mt-0.5">
                  {form.title || 'Titre non renseigné'}
                </p>
                <p className="text-white/50 text-xs mt-1 flex items-center gap-1">
                  <IconMapPin size={10} />
                  {[form.city, form.country].filter(Boolean).join(', ') || 'Localisation'}
                </p>
              </div>
            </div>

            {/* Save button */}
            <button onClick={handleSave} disabled={saving}
              className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-[10px] transition-all disabled:opacity-60"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}>
              {saving ? <IconLoader2 size={14} className="animate-spin" /> : saved ? <IconCheck size={14} /> : null}
              {saved ? 'Enregistré !' : 'Enregistrer'}
            </button>
          </div>

          {/* Completion bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-white/50 text-xs">Profil complété</p>
              <p className="text-white text-xs font-bold">{pct}%</p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.18)' }}>
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white border-b border-border flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 relative px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                tab === t.id ? 'text-primary' : 'text-text-tertiary hover:text-text-secondary'
              }`}>
              {t.label}
              {t.count !== undefined && (
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  tab === t.id ? 'bg-primary-light text-primary' : 'bg-border-subtle text-text-tertiary'
                }`}>{t.count}</span>
              )}
              {tab === t.id && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── INFORMATIONS ───────────────────────────────────────────────────── */}
      {tab === 'infos' && (
        <div className="card space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { label: 'Nom complet',   key: 'fullName', placeholder: 'Prénom Nom',              type: 'text'  },
              { label: 'Titre / Poste', key: 'title',    placeholder: 'ex: Ingénieur Logiciel',  type: 'text'  },
              { label: 'Ville',         key: 'city',     placeholder: 'Dakar',                   type: 'text'  },
              { label: 'Téléphone',     key: 'phone',    placeholder: '+221 77 000 0000',         type: 'tel'   },
              { label: 'LinkedIn',      key: 'linkedin', placeholder: 'linkedin.com/in/…',        type: 'url'   },
            ] as const).map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input type={f.type} className="input"
                  value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder} />
              </div>
            ))}
            <div>
              <label className="label">Pays</label>
              <select className="input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea rows={4} className="input resize-none leading-relaxed" value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="Présentez-vous en quelques lignes…" />
          </div>
        </div>
      )}

      {/* ── COMPÉTENCES ────────────────────────────────────────────────────── */}
      {tab === 'competences' && (
        <div className="card space-y-5">
          {/* Quota bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(skills.length / 15) * 100}%` }} />
            </div>
            <span className="text-xs text-text-tertiary font-medium flex-shrink-0">{skills.length} / 15</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 min-h-[44px]">
            {skills.length === 0 ? (
              <p className="text-sm text-text-tertiary self-center">Aucune compétence ajoutée</p>
            ) : skills.map(s => (
              <span key={s}
                className="group flex items-center gap-1.5 bg-primary-light text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                {s}
                <button onClick={() => setSkills(skills.filter(x => x !== s))}
                  className="opacity-40 group-hover:opacity-100 transition-opacity hover:text-danger">
                  <IconX size={10} />
                </button>
              </span>
            ))}
          </div>

          {/* Add input */}
          <div className="flex gap-2">
            <input className="input flex-1" value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
              placeholder="React, Finance, Leadership… puis Entrée" />
            <button onClick={addSkill} disabled={!newSkill.trim() || skills.length >= 15}
              className="btn-primary px-4 disabled:opacity-40">
              <IconPlus size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── EXPÉRIENCES ────────────────────────────────────────────────────── */}
      {tab === 'experiences' && (
        <div className="space-y-3">
          {/* Empty state */}
          {(profile?.experiences ?? []).length === 0 && !showExp && (
            <div className="card text-center py-14 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center mx-auto">
                <IconBriefcase size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Aucune expérience</p>
                <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
                  Ajoutez vos expériences professionnelles pour renforcer votre profil
                </p>
              </div>
            </div>
          )}

          {/* List */}
          {(profile?.experiences ?? []).map((exp: any) => {
            const st = STATUS[exp.status as keyof typeof STATUS]
            const start = exp.startDate
              ? new Date(exp.startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : null
            const end   = exp.isCurrent ? 'En cours'
              : exp.endDate
                ? new Date(exp.endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : null
            return (
              <div key={exp.id} className="card flex items-start gap-4 group hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                  {exp.company?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{exp.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {exp.company}{exp.city ? ` · ${exp.city}` : ''}
                  </p>
                  {(start || end) && (
                    <p className="text-xs text-text-tertiary mt-0.5">
                      {[start, end].filter(Boolean).join(' — ')}
                    </p>
                  )}
                  {st && (
                    <span className={`mt-1.5 inline-flex items-center gap-1 ${st.cls}`}>
                      <st.Icon size={9} /> {st.label}
                    </span>
                  )}
                </div>
                <button onClick={() => delExp(exp.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-red-50">
                  <IconTrash size={14} />
                </button>
              </div>
            )
          })}

          {/* Add form */}
          {showExp ? (
            <div className="card space-y-4">
              <p className="font-semibold text-text-primary text-sm">Nouvelle expérience</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="label">Poste / Titre *</label>
                  <input className="input" value={expForm.title}
                    onChange={e => setExpForm({ ...expForm, title: e.target.value })}
                    placeholder="Développeur Frontend" />
                </div>
                <div>
                  <label className="label">Entreprise *</label>
                  <input className="input" value={expForm.company}
                    onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                    placeholder="Google" />
                </div>
                <div>
                  <label className="label">Ville</label>
                  <input className="input" value={expForm.city}
                    onChange={e => setExpForm({ ...expForm, city: e.target.value })}
                    placeholder="Dakar" />
                </div>
                <div>
                  <label className="label">Date de début</label>
                  <input type="month" className="input" value={expForm.startDate}
                    onChange={e => setExpForm({ ...expForm, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="label">Date de fin</label>
                  <input type="month" className="input" value={expForm.endDate}
                    disabled={expForm.isCurrent}
                    onChange={e => setExpForm({ ...expForm, endDate: e.target.value })} />
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={expForm.isCurrent}
                  onChange={e => setExpForm({ ...expForm, isCurrent: e.target.checked, endDate: '' })}
                  className="w-4 h-4 rounded accent-primary" />
                <span className="text-sm text-text-secondary">Poste actuel</span>
              </label>
              <div className="flex gap-2 pt-1">
                <button onClick={() => { setShowExp(false); setExpForm(BLANK_EXP) }}
                  className="btn-secondary flex-1 justify-center">Annuler</button>
                <button onClick={addExp}
                  disabled={!expForm.title || !expForm.company || addingExp}
                  className="btn-primary flex-1 justify-center">
                  {addingExp ? <IconLoader2 size={14} className="animate-spin" /> : <IconPlus size={14} />}
                  Ajouter
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowExp(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] border-2 border-dashed border-border text-sm text-text-tertiary hover:border-primary hover:text-primary hover:bg-primary-light/40 transition-all duration-150">
              <IconPlus size={16} /> Ajouter une expérience
            </button>
          )}
        </div>
      )}

      {/* ── FORMATIONS ─────────────────────────────────────────────────────── */}
      {tab === 'formations' && (
        <div className="space-y-3">
          {/* Empty state */}
          {(profile?.educations ?? []).length === 0 && !showEdu && (
            <div className="card text-center py-14 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-border-subtle flex items-center justify-center mx-auto">
                <IconSchool size={22} className="text-text-tertiary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Aucune formation</p>
                <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
                  Ajoutez vos diplômes et certifications
                </p>
              </div>
            </div>
          )}

          {/* List */}
          {(profile?.educations ?? []).map((edu: any) => {
            const st = STATUS[edu.status as keyof typeof STATUS]
            return (
              <div key={edu.id} className="card flex items-start gap-4 group hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-border-subtle flex items-center justify-center text-xs font-bold text-text-secondary flex-shrink-0">
                  {(edu.organisation?.name ?? '??').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{edu.degree}</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {edu.organisation?.name ?? '—'}{edu.field ? ` · ${edu.field}` : ''}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {edu.startYear ?? ''}
                    {edu.isCurrent ? ' — Présent' : edu.endYear ? ` — ${edu.endYear}` : ''}
                  </p>
                  {st && (
                    <span className={`mt-1.5 inline-flex items-center gap-1 ${st.cls}`}>
                      <st.Icon size={9} /> {st.label}
                    </span>
                  )}
                </div>
                <button onClick={() => delEdu(edu.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-red-50">
                  <IconTrash size={14} />
                </button>
              </div>
            )
          })}

          {/* Add form */}
          {showEdu ? (
            <div className="card space-y-4">
              <p className="font-semibold text-text-primary text-sm">Nouvelle formation</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="label">Diplôme / Certification *</label>
                  <input className="input" value={eduForm.degree}
                    onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
                    placeholder="Master en Informatique" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Domaine / Spécialité</label>
                  <input className="input" value={eduForm.field}
                    onChange={e => setEduForm({ ...eduForm, field: e.target.value })}
                    placeholder="Génie Logiciel, Finance, Droit…" />
                </div>

                {/* Org search */}
                <div className="sm:col-span-2 relative" ref={orgRef}>
                  <label className="label">École / Université *</label>
                  <input className="input" value={eduForm.orgSearch}
                    onChange={e => setEduForm({ ...eduForm, orgSearch: e.target.value, orgId: '' })}
                    placeholder="Rechercher une institution enregistrée…" />
                  {(orgResults.length > 0 || searchOrg) && !eduForm.orgId && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-card-hover overflow-hidden">
                      {searchOrg ? (
                        <div className="flex justify-center py-3">
                          <IconLoader2 size={16} className="animate-spin text-primary" />
                        </div>
                      ) : orgResults.map((o: any) => (
                        <button key={o.id}
                          onClick={() => { setEduForm({ ...eduForm, orgSearch: o.name, orgId: o.id }); setOrgResults([]) }}
                          className="w-full text-left px-4 py-2.5 hover:bg-bg-light text-sm text-text-primary border-b border-border-subtle last:border-0 transition-colors">
                          <span className="font-medium">{o.name}</span>
                          {o.type && <span className="ml-2 text-xs text-text-tertiary">{o.type}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {eduForm.orgId && (
                    <p className="text-xs text-success mt-1.5 flex items-center gap-1">
                      <IconCheck size={11} /> {eduForm.orgSearch} sélectionné
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Année début</label>
                  <input type="number" min="1950" max="2030" className="input"
                    value={eduForm.startYear}
                    onChange={e => setEduForm({ ...eduForm, startYear: e.target.value })}
                    placeholder="2020" />
                </div>
                <div>
                  <label className="label">Année fin</label>
                  <input type="number" min="1950" max="2030" className="input"
                    value={eduForm.endYear} disabled={eduForm.isCurrent}
                    onChange={e => setEduForm({ ...eduForm, endYear: e.target.value })}
                    placeholder="2023" />
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={eduForm.isCurrent}
                  onChange={e => setEduForm({ ...eduForm, isCurrent: e.target.checked, endYear: '' })}
                  className="w-4 h-4 rounded accent-primary" />
                <span className="text-sm text-text-secondary">Formation en cours</span>
              </label>
              <div className="flex gap-2 pt-1">
                <button onClick={() => { setShowEdu(false); setEduForm(BLANK_EDU); setOrgResults([]) }}
                  className="btn-secondary flex-1 justify-center">Annuler</button>
                <button onClick={addEdu}
                  disabled={!eduForm.degree || !eduForm.orgId || addingEdu}
                  className="btn-primary flex-1 justify-center">
                  {addingEdu ? <IconLoader2 size={14} className="animate-spin" /> : <IconPlus size={14} />}
                  Ajouter
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowEdu(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] border-2 border-dashed border-border text-sm text-text-tertiary hover:border-primary hover:text-primary hover:bg-primary-light/40 transition-all duration-150">
              <IconPlus size={16} /> Ajouter une formation
            </button>
          )}
        </div>
      )}

    </div>
  )
}
