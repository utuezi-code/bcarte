'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  IconPlus, IconX, IconCircleCheck, IconClock, IconCheck,
  IconLoader2, IconBriefcase, IconSchool, IconTrash,
  IconMapPin, IconArrowUpRight, IconCopy, IconShare, IconCamera,
} from '@tabler/icons-react'
import Image from 'next/image'
import { COUNTRIES } from '@/lib/constants'
import { computeCompletion } from '@/lib/completion'

type Tab = 'infos' | 'competences' | 'experiences' | 'formations'

const STATUS = {
  EN_ATTENTE: { label: 'En attente', cls: 'badge-pending',  Icon: IconClock       },
  CONFIRMEE:  { label: 'Confirmée',  cls: 'badge-verified', Icon: IconCircleCheck },
  REJETEE:    { label: 'Rejetée',    cls: 'badge-rejected', Icon: IconCircleCheck },
} as const

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}


const BLANK_EXP = { title: '', company: '', city: '', startDate: '', endDate: '', isCurrent: false }
const BLANK_EDU = { degree: '', field: '', startYear: '', endYear: '', isCurrent: false, orgSearch: '', orgId: '' }

export default function ProfilePage() {
  const [tab,       setTab]       = useState<Tab>('infos')
  const [profile,   setProfile]   = useState<any>(null)
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [skills,    setSkills]    = useState<string[]>([])
  const [newSkill,  setNewSkill]  = useState('')
  const [form,      setForm]      = useState({
    fullName: '', title: '', city: '', country: 'Sénégal', bio: '', phone: '', linkedin: '', slug: '',
  })
  const [slugError, setSlugError] = useState('')
  const [showExp,   setShowExp]   = useState(false)
  const [expForm,   setExpForm]   = useState(BLANK_EXP)
  const [addingExp, setAddingExp] = useState(false)
  const [showEdu,   setShowEdu]   = useState(false)
  const [eduForm,   setEduForm]   = useState(BLANK_EDU)
  const [addingEdu, setAddingEdu] = useState(false)
  const [orgResults,setOrgResults]= useState<any[]>([])
  const [searchOrg, setSearchOrg] = useState(false)
  const [copied,      setCopied]      = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [dirty,       setDirty]       = useState(false)
  const [autoSaving,  setAutoSaving]  = useState(false)
  const orgRef    = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload-avatar', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) setProfile((p: any) => ({ ...p, avatarUrl: data.url }))
    setUploadingAvatar(false)
    e.target.value = ''
  }

  /* load */
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
          slug:     d.slug     ?? '',
        })
      }
      setLoading(false)
    })
  }, [])

  /* org search */
  useEffect(() => {
    if (!eduForm.orgSearch || eduForm.orgId || eduForm.orgSearch.length < 2) { setOrgResults([]); return }
    const t = setTimeout(() => {
      setSearchOrg(true)
      fetch(`/api/orgs?search=${encodeURIComponent(eduForm.orgSearch)}`)
        .then(r => r.json()).then(d => { setOrgResults(d); setSearchOrg(false) })
    }, 300)
    return () => clearTimeout(t)
  }, [eduForm.orgSearch, eduForm.orgId])

  useEffect(() => {
    const h = (e: MouseEvent) => { if (orgRef.current && !orgRef.current.contains(e.target as Node)) setOrgResults([]) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  /* save */
  const handleSave = useCallback(async (isAuto = false) => {
    setSlugError('')
    if (isAuto) setAutoSaving(true); else setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, skills }),
    })
    if (isAuto) setAutoSaving(false); else setSaving(false)
    if (res.status === 409) { setSlugError('Ce lien est déjà pris, choisis-en un autre.'); return }
    if (!res.ok) {
      if (!isAuto) {
        const d = await res.json().catch(() => ({}))
        setSlugError(d.error ?? 'Erreur lors de l\'enregistrement.')
      }
      return
    }
    setDirty(false)
    if (!isAuto) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
  }, [form, skills])

  /* auto-save after 2s of inactivity */
  useEffect(() => {
    if (!dirty) return
    const t = setTimeout(() => handleSave(true), 2000)
    return () => clearTimeout(t)
  }, [form, skills, dirty, handleSave])

  const suggestSlug = () => {
    if (form.slug || !form.fullName) return
    const s = form.fullName.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    setForm(f => ({ ...f, slug: s }))
  }

  /* experience CRUD */
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

  /* education CRUD */
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

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !skills.includes(s) && skills.length < 15) { setSkills([...skills, s]); setNewSkill(''); setDirty(true) }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <IconLoader2 size={24} className="animate-spin text-primary" />
    </div>
  )

  const { pct } = computeCompletion({
    avatarUrl:   profile?.avatarUrl,
    fullName:    form.fullName,
    title:       form.title,
    bio:         form.bio,
    phone:       form.phone,
    linkedin:    form.linkedin,
    skills,
    experiences: profile?.experiences,
    educations:  profile?.educations,
  })

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'infos',       label: 'Informations' },
    { id: 'competences', label: 'Compétences',  count: skills.length                  || undefined },
    { id: 'experiences', label: 'Expériences',  count: profile?.experiences?.length   || undefined },
    { id: 'formations',  label: 'Formations',   count: profile?.educations?.length    || undefined },
  ]

  return (
    <div className="space-y-6">

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Mon profil</h1>
          <p className="page-subtitle">Gérez vos informations professionnelles</p>
        </div>
        <div className="flex items-center gap-3">
          {autoSaving && (
            <span className="text-xs text-text-tertiary flex items-center gap-1.5">
              <IconLoader2 size={12} className="animate-spin" /> Sauvegarde…
            </span>
          )}
          <button onClick={() => handleSave(false)} disabled={saving} className="btn-primary">
            {saving ? <IconLoader2 size={15} className="animate-spin" />
                    : saved  ? <IconCheck size={15} /> : null}
            {saved ? 'Enregistré !' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

        {/* ── LEFT — identity card (sticky) ──────────────────────────────── */}
        <div className="lg:sticky lg:top-8 space-y-3">

          {/* Identity card */}
          <div className="rounded-[14px] overflow-hidden shadow-card">

            {/* Gradient hero */}
            <div style={{ background: 'linear-gradient(145deg, #1A0E4E 0%, #3B1FA0 55%, #6C47FF 100%)' }}
              className="px-6 pt-7 pb-6 flex flex-col items-center text-center gap-3">

              {/* Avatar — cliquable pour uploader */}
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <button onClick={() => avatarRef.current?.click()} disabled={uploadingAvatar}
                className="relative w-[88px] h-[88px] rounded-2xl overflow-hidden border-2 border-white/30 flex-shrink-0 group">
                {profile?.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt="avatar" fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                    {initials(form.fullName)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploadingAvatar
                    ? <IconLoader2 size={20} className="text-white animate-spin" />
                    : <IconCamera size={20} className="text-white" />}
                </div>
              </button>

              {/* Name & meta */}
              <div className="space-y-0.5">
                <p className="text-white font-bold text-base leading-tight">
                  {form.fullName || 'Votre nom'}
                </p>
                <p className="text-white/70 text-sm">
                  {form.title || 'Titre non renseigné'}
                </p>
                <p className="text-white/45 text-xs flex items-center justify-center gap-1 mt-1">
                  <IconMapPin size={10} />
                  {[form.city, form.country].filter(Boolean).join(', ') || 'Localisation'}
                </p>
              </div>

              {/* Completion */}
              <div className="w-full mt-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white/45 text-[11px]">Profil complété</span>
                  <span className="text-white text-[11px] font-bold">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <div className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white grid grid-cols-3 divide-x divide-border">
              {[
                { label: 'Expériences',  value: profile?.experiences?.length ?? 0 },
                { label: 'Formations',   value: profile?.educations?.length  ?? 0 },
                { label: 'Compétences',  value: skills.length                     },
              ].map(s => (
                <div key={s.label} className="py-4 text-center">
                  <p className="text-2xl font-black text-text-primary leading-none">{s.value}</p>
                  <p className="text-[10px] text-text-tertiary mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio preview */}
          {form.bio && (
            <div className="card py-4">
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-4">{form.bio}</p>
            </div>
          )}

          {/* Share public profile */}
          {profile?.slug && (() => {
            const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${profile.slug}`
            const handleCopy = () => {
              navigator.clipboard.writeText(url)
              setCopied(true)
              setTimeout(() => setCopied(false), 2500)
            }
            const handleShare = () => {
              if (navigator.share) {
                navigator.share({ title: form.fullName, url })
              } else {
                handleCopy()
              }
            }
            return (
              <div className="card py-3 px-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <IconShare size={13} className="text-primary flex-shrink-0" />
                  <p className="text-xs font-semibold text-text-primary">Partager mon profil</p>
                </div>
                <div className="flex items-center gap-2 bg-[#F4F3FB] rounded-[8px] px-3 py-2 border border-border">
                  <span className="flex-1 text-[11px] text-text-secondary truncate font-mono">/p/{profile.slug}</span>
                  <button onClick={handleCopy}
                    className="flex-shrink-0 text-text-tertiary hover:text-primary transition-colors"
                    title="Copier le lien">
                    {copied ? <IconCheck size={13} className="text-success" /> : <IconCopy size={13} />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopy}
                    className="btn-secondary flex-1 justify-center text-xs h-8 px-3">
                    {copied ? <><IconCheck size={12} className="text-success" /> Copié !</> : <><IconCopy size={12} /> Copier le lien</>}
                  </button>
                  <Link href={`/p/${profile.slug}`} target="_blank"
                    className="btn-ghost h-8 px-3 text-xs">
                    <IconArrowUpRight size={12} /> Ouvrir
                  </Link>
                </div>
              </div>
            )
          })()}
        </div>

        {/* ── RIGHT — tabs + content ──────────────────────────────────────── */}
        <div className="min-w-0 space-y-4">

          {/* Tab nav */}
          <div className="card p-0 overflow-hidden">
            <div className="flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 relative py-3.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    tab === t.id
                      ? 'text-primary bg-primary-light/50'
                      : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-light'
                  }`}>
                  {t.label}
                  {t.count !== undefined && (
                    <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      tab === t.id ? 'bg-primary text-white' : 'bg-border-subtle text-text-tertiary'
                    }`}>{t.count}</span>
                  )}
                  {tab === t.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── INFORMATIONS ─────────────────────────────────────────────── */}
          {tab === 'infos' && (
            <div className="card space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { label: 'Nom complet',   key: 'fullName', placeholder: 'Prénom Nom',             type: 'text', onBlur: suggestSlug },
                  { label: 'Titre / Poste', key: 'title',    placeholder: 'ex: Ingénieur Logiciel', type: 'text' },
                  { label: 'Ville',         key: 'city',     placeholder: 'Dakar',                  type: 'text' },
                  { label: 'Téléphone',     key: 'phone',    placeholder: '+221 77 000 0000',        type: 'tel'  },
                  { label: 'LinkedIn',      key: 'linkedin', placeholder: 'linkedin.com/in/…',       type: 'url'  },
                ] as const).map(f => (
                  <div key={f.key}>
                    <label className="label">{f.label}</label>
                    <input type={f.type} className="input"
                      value={(form as any)[f.key]}
                      onChange={e => { setForm({ ...form, [f.key]: e.target.value }); setDirty(true) }}
                      onBlur={(f as any).onBlur}
                      placeholder={f.placeholder} />
                  </div>
                ))}
                <div>
                  <label className="label">Pays</label>
                  <select className="input" value={form.country}
                    onChange={e => { setForm({ ...form, country: e.target.value }); setDirty(true) }}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea rows={4} className="input resize-none leading-relaxed" value={form.bio}
                  onChange={e => { setForm({ ...form, bio: e.target.value }); setDirty(true) }}
                  placeholder="Présentez-vous en quelques lignes…" />
              </div>

              {/* Slug / lien public */}
              <div>
                <label className="label">Lien de votre profil public</label>
                <div className="flex gap-2">
                  <div className="flex flex-1 items-center border-[1.5px] rounded-[10px] overflow-hidden transition-all focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(108,71,255,0.10)]"
                    style={{ borderColor: slugError ? '#EF4444' : '#E2E0F0' }}>
                    <span className="pl-3 pr-1 text-sm text-text-tertiary whitespace-nowrap select-none">bcarte.io/p/</span>
                    <input
                      className="flex-1 h-[42px] bg-transparent text-sm text-text-primary outline-none pr-3"
                      placeholder="mon-slug"
                      value={form.slug}
                      onBlur={suggestSlug}
                      onChange={e => {
                        setSlugError('')
                        setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-') })
                        setDirty(true)
                      }}
                    />
                  </div>
                  {!form.slug && form.fullName && (
                    <button type="button" onClick={suggestSlug}
                      className="btn-secondary text-xs px-3 h-11 whitespace-nowrap">
                      Suggérer
                    </button>
                  )}
                </div>
                {slugError
                  ? <p className="text-xs text-red-500 mt-1.5">{slugError}</p>
                  : form.slug
                    ? <p className="text-xs text-text-tertiary mt-1.5">Votre profil sera accessible sur <span className="text-primary font-medium">bcarte.io/p/{form.slug}</span></p>
                    : <p className="text-xs text-text-tertiary mt-1.5">Choisissez un identifiant unique pour votre profil public (ex&nbsp;: mamadou-traore)</p>
                }
              </div>
            </div>
          )}

          {/* ── COMPÉTENCES ──────────────────────────────────────────────── */}
          {tab === 'competences' && (
            <div className="card space-y-5">
              {/* Quota */}
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
                    <button onClick={() => { setSkills(skills.filter(x => x !== s)); setDirty(true) }}
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
                <button onClick={addSkill}
                  disabled={!newSkill.trim() || skills.length >= 15}
                  className="btn-primary px-4 disabled:opacity-40">
                  <IconPlus size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── EXPÉRIENCES ──────────────────────────────────────────────── */}
          {tab === 'experiences' && (
            <div className="space-y-3">
              {(profile?.experiences ?? []).length === 0 && !showExp && (
                <div className="card text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mx-auto">
                    <IconBriefcase size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Aucune expérience</p>
                    <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
                      Ajoutez vos expériences professionnelles pour renforcer votre profil
                    </p>
                  </div>
                </div>
              )}

              {(profile?.experiences ?? []).map((exp: any) => {
                const st = STATUS[exp.status as keyof typeof STATUS]
                const start = exp.startDate
                  ? new Date(exp.startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : null
                const end = exp.isCurrent ? 'En cours'
                  : exp.endDate
                    ? new Date(exp.endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : null
                return (
                  <div key={exp.id}
                    className="card flex items-start gap-4 group hover:border-primary/20 transition-colors">
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
                        <span className={`mt-2 inline-flex items-center gap-1 ${st.cls}`}>
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
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-[14px] border-2 border-dashed border-border text-sm text-text-tertiary hover:border-primary hover:text-primary hover:bg-primary-light/40 transition-all">
                  <IconPlus size={16} /> Ajouter une expérience
                </button>
              )}
            </div>
          )}

          {/* ── FORMATIONS ───────────────────────────────────────────────── */}
          {tab === 'formations' && (
            <div className="space-y-3">
              {(profile?.educations ?? []).length === 0 && !showEdu && (
                <div className="card text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-border-subtle flex items-center justify-center mx-auto">
                    <IconSchool size={24} className="text-text-tertiary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Aucune formation</p>
                    <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
                      Ajoutez vos diplômes et certifications
                    </p>
                  </div>
                </div>
              )}

              {(profile?.educations ?? []).map((edu: any) => {
                const st = STATUS[edu.status as keyof typeof STATUS]
                return (
                  <div key={edu.id}
                    className="card flex items-start gap-4 group hover:border-primary/20 transition-colors">
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
                        <span className={`mt-2 inline-flex items-center gap-1 ${st.cls}`}>
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
                    <div className="sm:col-span-2 relative" ref={orgRef}>
                      <label className="label">École / Université *</label>
                      <input className="input" value={eduForm.orgSearch}
                        onChange={e => setEduForm({ ...eduForm, orgSearch: e.target.value, orgId: '' })}
                        placeholder="Rechercher une institution enregistrée…" />
                      {(orgResults.length > 0 || searchOrg) && !eduForm.orgId && (
                        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-card-hover overflow-hidden">
                          {searchOrg
                            ? <div className="flex justify-center py-3"><IconLoader2 size={16} className="animate-spin text-primary" /></div>
                            : orgResults.map((o: any) => (
                              <button key={o.id}
                                onClick={() => { setEduForm({ ...eduForm, orgSearch: o.name, orgId: o.id }); setOrgResults([]) }}
                                className="w-full text-left px-4 py-2.5 hover:bg-bg-light text-sm text-text-primary border-b border-border-subtle last:border-0 transition-colors">
                                <span className="font-medium">{o.name}</span>
                                {o.type && <span className="ml-2 text-xs text-text-tertiary">{o.type}</span>}
                              </button>
                            ))
                          }
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
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-[14px] border-2 border-dashed border-border text-sm text-text-tertiary hover:border-primary hover:text-primary hover:bg-primary-light/40 transition-all">
                  <IconPlus size={16} /> Ajouter une formation
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
