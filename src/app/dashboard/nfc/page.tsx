'use client'

import { useEffect, useRef, useState } from 'react'
import {
  IconCreditCard, IconCheck, IconMapPin, IconDownload,
  IconQrcode, IconPalette, IconPencil, IconLoader2,
  IconPhoto, IconX,
} from '@tabler/icons-react'
import QRCode from 'react-qr-code'

/* ── Palette ───────────────────────────────────────────────── */
const PALETTE = [
  { id: 'violet',   from: '#2D1B8E', to: '#6C47FF', accent: '#C4B5FD' },
  { id: 'indigo',   from: '#1E3A8A', to: '#6366F1', accent: '#A5B4FC' },
  { id: 'obsidian', from: '#080808', to: '#1C1C1C', accent: '#C9A84C' },
  { id: 'midnight', from: '#0F0E1A', to: '#0F3460', accent: '#60A5FA' },
  { id: 'charcoal', from: '#111827', to: '#374151', accent: '#9CA3AF' },
  { id: 'gold',     from: '#6B3800', to: '#D4A843', accent: '#FDE68A' },
  { id: 'crimson',  from: '#7F0000', to: '#DC2626', accent: '#FCA5A5' },
  { id: 'emerald',  from: '#064E3B', to: '#10B981', accent: '#6EE7B7' },
  { id: 'teal',     from: '#134E4A', to: '#14B8A6', accent: '#5EEAD4' },
  { id: 'navy',     from: '#1E3A5F', to: '#2563EB', accent: '#93C5FD' },
  { id: 'orange',   from: '#7C2D12', to: '#EA580C', accent: '#FDBA74' },
  { id: 'rose',     from: '#881337', to: '#E11D48', accent: '#FDA4AF' },
] as const
type PaletteId = typeof PALETTE[number]['id']

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) }
}
function rgbToHex(r: number, g: number, b: number) {
  const c = (v: number) => Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')
  return '#' + c(r) + c(g) + c(b)
}
function darken(hex: string, f = 0.38) { const {r,g,b} = hexToRgb(hex); return rgbToHex(r*f,g*f,b*f) }
function lighten(hex: string, f = 1.3)  { const {r,g,b} = hexToRgb(hex); return rgbToHex(r*f,g*f,b*f) }

function getStyle(id: PaletteId | null, custom: string) {
  if (!id) return {
    gradient: `linear-gradient(135deg, ${darken(custom)} 0%, ${custom} 55%, ${lighten(custom)} 100%)`,
    accent: lighten(custom, 1.55),
  }
  const p = PALETTE.find(x => x.id === id)!
  return { gradient: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`, accent: p.accent }
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
}
function nameColor(name: string) {
  const C = ['#6C47FF','#059669','#2563EB','#D97706','#DC2626','#0891B2','#7C3AED']
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return C[Math.abs(h) % C.length]
}

/* ── NFCCard ────────────────────────────────────────────────── */
function NFCCard({ name, title, email, phone, company, companyLogoUrl, gradient, accent, profileUrl, cardRef }: {
  name: string; title: string; email: string; phone: string
  company: string; companyLogoUrl: string
  gradient: string; accent: string; profileUrl: string
  cardRef?: React.RefObject<HTMLDivElement>
}) {
  const domRef = useRef<HTMLDivElement>(null)
  const [rot,   setRot]   = useState({ x: 0, y: 0 })
  const [shine, setShine] = useState({ x: 50, y: 50 })
  const [on,    setOn]    = useState(false)

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = domRef.current?.getBoundingClientRect(); if (!r) return
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top)  / r.height
    setRot({ x: (py - 0.5) * -20, y: (px - 0.5) * 20 })
    setShine({ x: px * 100, y: py * 100 })
  }
  const leave = () => { setRot({ x: 0, y: 0 }); setShine({ x: 50, y: 50 }); setOn(false) }

  return (
    <div style={{ perspective: '1200px' }} ref={cardRef}>
      <div ref={domRef} onMouseMove={move} onMouseEnter={() => setOn(true)} onMouseLeave={leave}
        style={{
          width: '100%', aspectRatio: '1.586', background: gradient, borderRadius: 24,
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${on ? 1.025 : 1})`,
          transition: on ? 'transform 0.07s linear' : 'transform 0.55s cubic-bezier(0.23,1,0.32,1)',
          transformStyle: 'preserve-3d',
          boxShadow: on
            ? '0 48px 96px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,255,255,0.12)'
            : '0 20px 60px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.08)',
          position: 'relative', overflow: 'hidden', cursor: 'pointer', userSelect: 'none',
        }}>
        <div style={{ position:'absolute',top:0,left:'6%',right:'6%',height:1,
          background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',inset:0,pointerEvents:'none',
          background:`radial-gradient(ellipse at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.2) 0%, transparent 65%)`,
          opacity: on ? 1 : 0.5, transition: on ? 'none' : 'opacity 0.5s' }} />
        <div style={{ position:'absolute',inset:0,pointerEvents:'none',
          background:'linear-gradient(135deg,rgba(255,255,255,0.13) 0%,rgba(255,255,255,0.02) 50%,transparent 100%)' }} />

        <div style={{ position:'relative',zIndex:1,height:'100%',display:'flex',flexDirection:'column',
          padding:'1rem 1.1rem',boxSizing:'border-box' }}>

          {/* Top row: brand left, logo right */}
          <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between' }}>
            <div style={{ display:'flex',alignItems:'center',gap:5 }}>
              <div style={{ width:18,height:18,borderRadius:5,flexShrink:0,
                background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.25)',
                display:'flex',alignItems:'center',justifyContent:'center' }}>
                <IconCreditCard size={9} color="white" />
              </div>
              <span style={{ fontWeight:900,fontSize:9,color:'rgba(255,255,255,0.65)',letterSpacing:'0.03em' }}>bcarte</span>
            </div>

            {company && (
              <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:3 }}>
                {companyLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <div style={{
                    width:58,height:58,borderRadius:13,
                    background:'white',boxShadow:'0 4px 16px rgba(0,0,0,0.35)',
                    border:'2px solid rgba(255,255,255,0.55)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    padding:5,
                  }}>
                    <img src={companyLogoUrl} alt={company} style={{
                      width:'100%',height:'100%',objectFit:'contain',display:'block',
                    }} />
                  </div>
                ) : (
                  <div style={{ width:52,height:52,borderRadius:13,background:nameColor(company),
                    boxShadow:'0 4px 16px rgba(0,0,0,0.35)',border:'2px solid rgba(255,255,255,0.2)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    color:'white',fontWeight:800,fontSize:18,letterSpacing:'-0.02em' }}>
                    {initials(company)}
                  </div>
                )}
                <span style={{ color:'rgba(255,255,255,0.75)',fontSize:9,fontWeight:700,
                  maxWidth:66,textAlign:'center',lineHeight:1.2,
                  overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{company}</span>
              </div>
            )}
          </div>

          {/* Name + title */}
          <div style={{ flex:1,marginTop:'0.6rem' }}>
            <p style={{ color:'white',fontWeight:800,fontSize:21,lineHeight:1.15,
              letterSpacing:'-0.03em',textShadow:'0 2px 10px rgba(0,0,0,0.2)' }}>
              {name || 'Votre Nom'}
            </p>
            {title && (
              <p style={{ color:accent,fontSize:11,fontWeight:700,
                marginTop:5,letterSpacing:'0.06em',textTransform:'uppercase' }}>{title}</p>
            )}
          </div>

          {/* Bottom: contacts + QR */}
          <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:10 }}>
            <div style={{ display:'flex',flexDirection:'column',gap:5 }}>
              {email && <p style={{ color:'rgba(255,255,255,0.85)',fontSize:11,fontWeight:600 }}>{email}</p>}
              {phone && <p style={{ color:'rgba(255,255,255,0.85)',fontSize:11,fontWeight:600 }}>{phone}</p>}
            </div>
            <div style={{ background:'white',borderRadius:10,padding:5,flexShrink:0,
              boxShadow:'0 8px 24px rgba(0,0,0,0.3)' }}>
              <QRCode value={profileUrl || 'https://bcarte.app'} size={76}
                fgColor="#0C0A18" bgColor="transparent" level="M" style={{ display:'block' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Field ──────────────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} className="input text-sm h-10" />
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────── */
const PRICE = '29 000 FCFA'

export default function NFCPage() {
  const [profile,     setProfile]     = useState<any>(null)
  const [meEmail,     setMeEmail]     = useState('')
  const [origin,      setOrigin]      = useState('')
  const [name,        setName]        = useState('')
  const [title,       setTitle]       = useState('')
  const [email,       setEmail]       = useState('')
  const [phone,       setPhone]       = useState('')
  const [company,      setCompany]      = useState('')
  const [uploadedLogo, setUploadedLogo] = useState('')
  const [uploading,    setUploading]    = useState(false)
  const [uploadError,  setUploadError]  = useState('')
  const [paletteId,    setPaletteId]    = useState<PaletteId | null>('violet')
  const [customColor,  setCustomColor]  = useState('#6C47FF')
  const [downloading,  setDownloading]  = useState(false)
  const [saving,       setSaving]       = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [showOrder,    setShowOrder]    = useState(false)
  const [ordered,      setOrdered]      = useState(false)
  const [address,      setAddress]      = useState('')
  const cardRef   = useRef<HTMLDivElement>(null)
  const logoInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
    const saved = localStorage.getItem('nfc-logo-url')
    if (saved) setUploadedLogo(saved)
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(d => { if (d?.email) setMeEmail(d.email) })
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => {
      if (!d) return
      setProfile(d)
      setName(d.fullName ?? '')
      setTitle(d.title ?? '')
      setEmail(d.emailPro ?? '')
      setPhone(d.phone ?? '')
      const exp = (d.experiences ?? []).find((e: any) => e.isCurrent) ?? d.experiences?.[0]
      setCompany(exp?.company ?? '')
    })
  }, [])

  useEffect(() => {
    if (meEmail) setEmail(prev => prev || meEmail)
  }, [meEmail])

  const handleLogoUpload = async (file: File) => {
    setUploading(true); setUploadError('')
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload-logo', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setUploadError(data.error ?? 'Erreur upload'); return }
      setUploadedLogo(data.url)
      localStorage.setItem('nfc-logo-url', data.url)
    } finally { setUploading(false) }
  }

  const removeLogo = () => {
    setUploadedLogo('')
    localStorage.removeItem('nfc-logo-url')
  }

  const slug        = profile?.slug ?? ''
  const profileUrl  = slug ? `${origin}/p/${slug}` : origin
  const linkedLogo  = (profile?.educations ?? []).find((e: any) => e.organisation?.logoUrl)?.organisation?.logoUrl ?? ''
  const companyLogo = uploadedLogo || linkedLogo
  const { gradient, accent } = getStyle(paletteId, customColor)

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name, title, emailPro: email, phone,
          city: profile?.city, country: profile?.country,
          bio: profile?.bio, linkedin: profile?.linkedin,
          slug: profile?.slug, skills: profile?.skills,
        }),
      })
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } finally { setSaving(false) }
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null, logging: false })
      const link = document.createElement('a')
      link.download = `bcarte-${slug || 'carte'}.jpeg`
      link.href = canvas.toDataURL('image/jpeg', 0.95)
      link.click()
    } finally { setDownloading(false) }
  }

  if (ordered) {
    return (
      <div className="max-w-md mx-auto py-16 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-[#ECFDF5]">
            <IconCheck size={28} className="text-[#059669]" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Commande confirmée !</h2>
          <p className="text-sm text-text-secondary">Livraison sous <strong>7–10 jours</strong>.</p>
        </div>
        <NFCCard name={name} title={title} email={email} phone={phone}
          company={company} companyLogoUrl={companyLogo}
          gradient={gradient} accent={accent} profileUrl={profileUrl} />
        <div className="card divide-y divide-border-subtle">
          {[{ label: 'Prix', value: PRICE }, { label: 'Adresse', value: address || '—' }].map(r => (
            <div key={r.label} className="flex justify-between py-3 text-sm">
              <span className="text-text-secondary">{r.label}</span>
              <span className="font-semibold text-text-primary">{r.value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setOrdered(false); setShowOrder(false) }} className="btn-secondary w-full justify-center">
          Retour
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Carte NFC</h1>
        <p className="page-subtitle">Personnalisez et téléchargez votre carte de visite digitale</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

        {/* ── Left — card preview ── */}
        <div className="lg:sticky lg:top-6 space-y-5">
          <NFCCard
            name={name || 'Votre Nom'} title={title} email={email} phone={phone}
            company={company} companyLogoUrl={companyLogo}
            gradient={gradient} accent={accent} profileUrl={profileUrl}
            cardRef={cardRef}
          />

          <div className="rounded-2xl overflow-hidden border border-border"
            style={{ background: 'linear-gradient(145deg,#FAFAFA 0%,#F3F4F6 100%)' }}>
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-[9px] bg-primary-light flex items-center justify-center flex-shrink-0">
                <IconQrcode size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">QR Code du profil</p>
                {slug
                  ? <p className="text-[11px] font-mono text-primary truncate mt-0.5">{profileUrl}</p>
                  : <p className="text-[11px] text-amber-600 mt-0.5">Configurez un slug dans votre profil</p>
                }
              </div>
            </div>
            <div className="p-4">
              <button onClick={handleDownload} disabled={downloading}
                className="btn-primary w-full justify-center gap-2.5 py-3">
                {downloading
                  ? <><IconLoader2 size={15} className="animate-spin" /> Export en cours…</>
                  : <><IconDownload size={15} /> Télécharger en JPEG</>
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── Right — controls ── */}
        <div className="space-y-5">

          {/* Editable fields */}
          <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg,#F8F7FF 0%,#F0EDFF 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[9px] bg-primary-light flex items-center justify-center flex-shrink-0">
                  <IconPencil size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Informations</p>
                  <p className="text-[11px] text-text-tertiary">Modifiées ici et dans votre profil</p>
                </div>
              </div>
              <button onClick={handleSave} disabled={saving}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  saved ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-primary text-white hover:bg-primary-hover'
                }`}>
                {saving ? <IconLoader2 size={12} className="animate-spin" /> : saved ? <IconCheck size={12} /> : null}
                {saving ? 'Enregistrement…' : saved ? 'Enregistré !' : 'Enregistrer'}
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <Field label="Nom complet"            value={name}    onChange={setName}    placeholder="Mamadou Moctar Traore" />
              <Field label="Fonction / titre"        value={title}   onChange={setTitle}   placeholder="Architecte numérique" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Email"     value={email} onChange={setEmail} placeholder="email@pro.com" type="email" />
                <Field label="Téléphone" value={phone} onChange={setPhone} placeholder="+221 77 000 00 00" type="tel" />
              </div>
              <Field label="Entreprise / organisation" value={company} onChange={setCompany} placeholder="Nom de l'entreprise" />
            </div>
          </div>

          {/* Logo upload */}
          <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg,#F8F7FF 0%,#F0EDFF 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[9px] bg-primary-light flex items-center justify-center flex-shrink-0">
                  <IconPhoto size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Logo</p>
                  <p className="text-[11px] text-text-tertiary">Logo de l&apos;entreprise sur la carte</p>
                </div>
              </div>
              {uploadedLogo && (
                <button onClick={removeLogo}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors">
                  <IconX size={12} /> Supprimer
                </button>
              )}
            </div>
            <div className="p-4">
              <input ref={logoInput} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); e.target.value = '' }} />

              {uploadedLogo ? (
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="w-16 h-16 rounded-xl border border-border bg-white flex items-center justify-center p-1.5">
                    <img src={uploadedLogo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-text-primary">Logo chargé</p>
                    <p className="text-xs text-text-tertiary">Il apparaît en haut à droite de la carte</p>
                    <button onClick={() => logoInput.current?.click()}
                      className="text-xs text-primary font-semibold hover:underline">
                      Changer →
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => logoInput.current?.click()} disabled={uploading}
                  className="w-full border-2 border-dashed border-border rounded-xl py-5 flex flex-col items-center gap-2
                    hover:border-primary hover:bg-primary-light transition-all group">
                  {uploading ? (
                    <IconLoader2 size={22} className="text-primary animate-spin" />
                  ) : (
                    <IconPhoto size={22} className="text-text-tertiary group-hover:text-primary transition-colors" />
                  )}
                  <p className="text-sm font-semibold text-text-secondary group-hover:text-primary transition-colors">
                    {uploading ? 'Upload en cours…' : 'Cliquez pour choisir un logo'}
                  </p>
                  <p className="text-xs text-text-tertiary">JPG, PNG, WebP, SVG · max 3 Mo</p>
                </button>
              )}
              {uploadError && (
                <p className="mt-2 text-xs text-red-600 font-medium">{uploadError}</p>
              )}
            </div>
          </div>

          {/* Color picker */}
          <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg,#F8F7FF 0%,#F0EDFF 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[9px] bg-primary-light flex items-center justify-center flex-shrink-0">
                  <IconPalette size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Couleur</p>
                  <p className="text-[11px] text-text-tertiary">Thème de votre carte</p>
                </div>
              </div>
              <label className="relative cursor-pointer">
                <input type="color" value={customColor}
                  onChange={e => { setCustomColor(e.target.value); setPaletteId(null) }}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all"
                  style={{
                    background: paletteId === null ? customColor : 'white',
                    borderColor: paletteId === null ? customColor : '#E5E7EB',
                    color: paletteId === null ? 'white' : '#6B7280',
                  }}>
                  <span className="w-3 h-3 rounded-full border border-white/40 flex-shrink-0"
                    style={{ background: customColor }} />
                  Perso.
                </div>
              </label>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-6 gap-2.5">
                {PALETTE.map(p => {
                  const sel = paletteId === p.id
                  return (
                    <button key={p.id} onClick={() => setPaletteId(p.id)} title={p.id}
                      className="relative aspect-square rounded-xl transition-all duration-150"
                      style={{
                        background: `linear-gradient(145deg,${p.from} 0%,${p.to} 100%)`,
                        boxShadow: sel ? '0 6px 16px rgba(0,0,0,0.28)' : '0 2px 6px rgba(0,0,0,0.1)',
                        transform: sel ? 'scale(1.12)' : 'scale(1)',
                        outline: sel ? '2.5px solid #6C47FF' : 'none', outlineOffset: 2,
                      }}>
                      {sel && <span className="absolute inset-0 flex items-center justify-center">
                        <IconCheck size={12} color="white" strokeWidth={3} />
                      </span>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order */}
          {!showOrder ? (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#1A0E4E 0%,#3B1FA0 50%,#6C47FF 100%)' }}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-white text-base">Commander la carte physique</p>
                    <p className="text-white/60 text-xs mt-1">Carte NFC premium, livrée sous 7–10 jours</p>
                  </div>
                  <span className="text-white font-black text-lg flex-shrink-0">{PRICE}</span>
                </div>
                <button onClick={() => setShowOrder(true)}
                  className="mt-4 w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all"
                  style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.25)' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
                  onMouseOut={e  => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}>
                  Commander →
                </button>
              </div>
            </div>
          ) : (
            <div className="card space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[9px] bg-primary-light flex items-center justify-center flex-shrink-0">
                  <IconMapPin size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Adresse de livraison</p>
                  <p className="text-[11px] text-text-tertiary">Livraison sous 7–10 jours · {PRICE}</p>
                </div>
              </div>
              <input className="input text-sm" placeholder="Sacré-Cœur 3, Villa 25, Dakar"
                value={address} onChange={e => setAddress(e.target.value)} />
              <div className="flex gap-2.5">
                <button onClick={() => setShowOrder(false)} className="btn-secondary flex-1 justify-center text-sm">Annuler</button>
                <button onClick={() => setOrdered(true)} disabled={!address.trim()}
                  className="btn-primary flex-1 justify-center gap-1.5 text-sm disabled:opacity-50">
                  <IconCheck size={14} /> Confirmer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
