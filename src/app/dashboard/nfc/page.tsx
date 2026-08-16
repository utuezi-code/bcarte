'use client'

import { useEffect, useRef, useState } from 'react'
import {
  IconCreditCard, IconCheck, IconMapPin, IconDownload,
  IconQrcode, IconPalette, IconPencil, IconLoader2,
  IconPhoto, IconX, IconBuildingSkyscraper,
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

            {/* Company name */}
            {company && (
              <div style={{
                maxWidth:120,
                background:'rgba(255,255,255,0.12)',
                backdropFilter:'blur(12px)',
                border:'1.5px solid rgba(255,255,255,0.28)',
                borderRadius:10,
                padding:'5px 10px',
                boxShadow:'0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}>
                <span style={{
                  color:'white',fontWeight:800,fontSize:11,
                  letterSpacing:'0.01em',lineHeight:1.35,
                  display:'block',textAlign:'center',
                  whiteSpace:'normal',wordBreak:'break-word',
                  textShadow:'0 1px 6px rgba(0,0,0,0.3)',
                }}>{company}</span>
              </div>
            )}
          </div>

          {/* Name + title */}
          <div style={{ flex:1,marginTop:'0.55rem' }}>
            <p style={{ color:'white',fontWeight:800,fontSize:22,lineHeight:1.12,
              letterSpacing:'-0.035em',textShadow:'0 2px 12px rgba(0,0,0,0.25)' }}>
              {name || 'Votre Nom'}
            </p>
            {title && (
              <p style={{ color:accent,fontSize:10.5,fontWeight:700,
                marginTop:6,letterSpacing:'0.08em',textTransform:'uppercase',
                textShadow:'0 1px 6px rgba(0,0,0,0.2)' }}>{title}</p>
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

/* ── Section wrapper ────────────────────────────────────────── */
function Section({ icon, title, subtitle, action, children }: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between gap-3"
        style={{ background: 'linear-gradient(135deg,#FAFAFA 0%,#F5F3FF 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[9px] bg-primary-light flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            {subtitle && <p className="text-[11px] text-text-tertiary mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

/* ── Field ──────────────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder, type = 'text', icon }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; icon?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
            {icon}
          </div>
        )}
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input text-sm h-10 ${icon ? 'pl-9' : ''}`} />
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────── */
const PRICE = '29 000 FCFA'

export default function NFCPage() {
  const [profile,      setProfile]      = useState<any>(null)
  const [meEmail,      setMeEmail]      = useState('')
  const [origin,       setOrigin]       = useState('')
  const [name,         setName]         = useState('')
  const [title,        setTitle]        = useState('')
  const [email,        setEmail]        = useState('')
  const [phone,        setPhone]        = useState('')
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
    const savedLogo = localStorage.getItem('nfc-logo-url')
    if (savedLogo) setUploadedLogo(savedLogo)
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
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)' }}>
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
      {/* Page header */}
      <div>
        <h1 className="page-title">Carte NFC</h1>
        <p className="page-subtitle">Personnalisez et commandez votre carte de visite digitale</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

        {/* ── Left — card preview ── */}
        <div className="lg:sticky lg:top-6 space-y-4">
          {/* Card scene */}
          <div className="rounded-3xl overflow-hidden p-6 sm:p-10"
            style={{ background: 'linear-gradient(160deg,#0F0B2E 0%,#1A1040 40%,#0A1628 100%)' }}>
            <NFCCard
              name={name || 'Votre Nom'} title={title} email={email} phone={phone}
              company={company} companyLogoUrl={companyLogo}
              gradient={gradient} accent={accent} profileUrl={profileUrl}
              cardRef={cardRef}
            />
          </div>

          {/* QR + download */}
          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <IconQrcode size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Lien du profil</p>
                  {slug
                    ? <p className="text-[11px] font-mono text-primary truncate max-w-[200px]">{profileUrl}</p>
                    : <p className="text-[11px] text-amber-500">Configurez un slug dans votre profil</p>
                  }
                </div>
              </div>
              <button onClick={handleDownload} disabled={downloading}
                className="btn-primary gap-2 py-2 px-4 text-sm flex-shrink-0">
                {downloading
                  ? <><IconLoader2 size={14} className="animate-spin" /> Export…</>
                  : <><IconDownload size={14} /> Télécharger</>
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── Right — controls ── */}
        <div className="space-y-4">

          {/* Editable fields */}
          <Section
            icon={<IconPencil size={15} className="text-primary" />}
            title="Informations de la carte"
            subtitle="Ces données s'affichent sur votre carte"
            action={
              <button onClick={handleSave} disabled={saving}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  saved ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-primary text-white hover:bg-primary-hover'
                }`}>
                {saving ? <IconLoader2 size={12} className="animate-spin" />
                  : saved ? <IconCheck size={12} /> : null}
                {saving ? 'Enregistrement…' : saved ? 'Enregistré !' : 'Enregistrer'}
              </button>
            }>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Field label="Nom complet" value={name} onChange={setName} placeholder="Mamadou Moctar Traore" />
                </div>
                <div className="col-span-2">
                  <Field label="Fonction / titre" value={title} onChange={setTitle} placeholder="Architecte numérique" />
                </div>
                <Field label="Email pro" value={email} onChange={setEmail} placeholder="email@pro.com" type="email" />
                <Field label="Téléphone" value={phone} onChange={setPhone} placeholder="+221 77 …" type="tel" />
                <div className="col-span-2">
                  <Field label="Entreprise" value={company} onChange={setCompany}
                    placeholder="Nom de l'entreprise"
                    icon={<IconBuildingSkyscraper size={14} />} />
                </div>
              </div>
            </div>
          </Section>

          {/* Logo upload */}
          <Section
            icon={<IconPhoto size={15} className="text-primary" />}
            title="Logo entreprise"
            subtitle="Affiché en haut à droite de la carte"
            action={uploadedLogo ? (
              <button onClick={removeLogo}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold transition-colors">
                <IconX size={12} /> Retirer
              </button>
            ) : undefined}>
            <input ref={logoInput} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); e.target.value = '' }} />

            {uploadedLogo ? (
              <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-secondary border border-border">
                <div className="w-14 h-14 rounded-xl border border-border bg-white flex items-center justify-center p-1.5 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uploadedLogo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">Logo chargé</p>
                  <p className="text-xs text-text-tertiary mt-0.5">Visible en haut à droite de la carte</p>
                  <button onClick={() => logoInput.current?.click()}
                    className="mt-1 text-xs text-primary font-semibold hover:underline">
                    Changer →
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => logoInput.current?.click()} disabled={uploading}
                className="w-full border-2 border-dashed border-border rounded-xl py-6 flex flex-col items-center gap-2.5
                  hover:border-primary hover:bg-primary-light transition-all group">
                {uploading
                  ? <IconLoader2 size={24} className="text-primary animate-spin" />
                  : <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border flex items-center justify-center
                      group-hover:bg-primary-light group-hover:border-primary transition-all">
                      <IconPhoto size={18} className="text-text-tertiary group-hover:text-primary transition-colors" />
                    </div>
                }
                <div className="text-center">
                  <p className="text-sm font-semibold text-text-secondary group-hover:text-primary transition-colors">
                    {uploading ? 'Upload en cours…' : 'Cliquez pour choisir un logo'}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5">JPG, PNG, WebP, SVG · max 3 Mo</p>
                </div>
              </button>
            )}
            {uploadError && <p className="mt-2 text-xs text-red-600 font-medium">{uploadError}</p>}
          </Section>

          {/* Color picker */}
          <Section
            icon={<IconPalette size={15} className="text-primary" />}
            title="Couleur de la carte"
            subtitle="Choisissez un thème ou une couleur personnalisée"
            action={
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
            }>
            <div className="grid grid-cols-6 gap-2.5">
              {PALETTE.map(p => {
                const sel = paletteId === p.id
                return (
                  <button key={p.id} onClick={() => setPaletteId(p.id)} title={p.id}
                    className="relative aspect-square rounded-xl transition-all duration-150"
                    style={{
                      background: `linear-gradient(145deg,${p.from} 0%,${p.to} 100%)`,
                      boxShadow: sel ? '0 6px 16px rgba(0,0,0,0.28)' : '0 2px 6px rgba(0,0,0,0.08)',
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
          </Section>

          {/* Order section */}
          {!showOrder ? (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#12094A 0%,#2A1580 50%,#5E3FD8 100%)' }}>
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-white text-base leading-tight">Commander la carte physique</p>
                    <p className="text-white/55 text-xs mt-1.5">Carte NFC premium · Livraison 7–10 jours</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-white font-black text-xl">{PRICE}</span>
                  </div>
                </div>
                <button onClick={() => setShowOrder(true)}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all"
                  style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.22)' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                  onMouseOut={e  => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}>
                  Commander ma carte →
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <IconMapPin size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Adresse de livraison</p>
                  <p className="text-[11px] text-text-tertiary">Livraison sous 7–10 jours · {PRICE}</p>
                </div>
              </div>
              <input className="input text-sm" placeholder="Sacré-Cœur 3, Villa 25, Dakar"
                value={address} onChange={e => setAddress(e.target.value)} />
              <div className="flex gap-2.5">
                <button onClick={() => setShowOrder(false)} className="btn-secondary flex-1 justify-center text-sm">Annuler</button>
                <button onClick={() => setOrdered(true)} disabled={!address.trim()}
                  className="btn-primary flex-1 justify-center gap-1.5 text-sm disabled:opacity-50">
                  <IconCheck size={14} /> Confirmer la commande
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
