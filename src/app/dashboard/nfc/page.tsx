'use client'

import { useEffect, useRef, useState } from 'react'
import {
  IconCreditCard, IconCheck, IconMapPin, IconDownload,
  IconQrcode, IconPalette,
} from '@tabler/icons-react'
import QRCode from 'react-qr-code'

/* ── Palette ───────────────────────────────────────────────── */
const PALETTE = [
  { id: 'violet',   from: '#2D1B8E', to: '#6C47FF', accent: '#C4B5FD' },
  { id: 'indigo',   from: '#1E3A8A', to: '#6366F1', accent: '#A5B4FC' },
  { id: 'obsidian', from: '#050505', to: '#1C1C1C', accent: '#C9A84C' },
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
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}
function rgbToHex(r: number, g: number, b: number) {
  const clamp = (v: number) => Math.round(Math.max(0, Math.min(255, v)))
  return '#' + [r, g, b].map(v => clamp(v).toString(16).padStart(2, '0')).join('')
}
function darken(hex: string, f = 0.4)  { const { r, g, b } = hexToRgb(hex); return rgbToHex(r * f, g * f, b * f) }
function lighten(hex: string, f = 1.3) { const { r, g, b } = hexToRgb(hex); return rgbToHex(r * f, g * f, b * f) }

function getStyle(id: PaletteId | null, custom: string) {
  if (!id) {
    return {
      gradient: `linear-gradient(135deg, ${darken(custom)} 0%, ${custom} 55%, ${lighten(custom)} 100%)`,
      accent: lighten(custom, 1.5),
    }
  }
  const p = PALETTE.find(x => x.id === id)!
  return { gradient: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`, accent: p.accent }
}

function companyInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
}
function companyColor(name: string) {
  const COLORS = ['#6C47FF', '#059669', '#2563EB', '#D97706', '#DC2626', '#0891B2', '#7C3AED']
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return COLORS[Math.abs(h) % COLORS.length]
}

/* ── NFCCard ────────────────────────────────────────────────── */
function NFCCard({
  name, title, email, phone, company, companyLogoUrl,
  gradient, accent, profileUrl, cardRef,
}: {
  name: string; title: string; email: string; phone: string
  company: string; companyLogoUrl: string
  gradient: string; accent: string; profileUrl: string
  cardRef?: React.RefObject<HTMLDivElement>
}) {
  const domRef = useRef<HTMLDivElement>(null)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const [shine, setShine] = useState({ x: 50, y: 50 })
  const [on, setOn] = useState(false)

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = domRef.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top)  / r.height
    setRot({ x: (py - 0.5) * -22, y: (px - 0.5) * 22 })
    setShine({ x: px * 100, y: py * 100 })
  }
  const leave = () => { setRot({ x: 0, y: 0 }); setShine({ x: 50, y: 50 }); setOn(false) }

  return (
    <div style={{ perspective: '1200px' }} ref={cardRef}>
      <div
        ref={domRef}
        onMouseMove={move}
        onMouseEnter={() => setOn(true)}
        onMouseLeave={leave}
        style={{
          width: '100%', aspectRatio: '1.586',
          background: gradient, borderRadius: 22,
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${on ? 1.03 : 1})`,
          transition: on ? 'transform 0.07s linear' : 'transform 0.55s cubic-bezier(0.23,1,0.32,1)',
          transformStyle: 'preserve-3d',
          boxShadow: on
            ? '0 50px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)'
            : '0 24px 64px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.07)',
          position: 'relative', overflow: 'hidden',
          cursor: 'pointer', userSelect: 'none',
        }}
      >
        {/* shine overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.22) 0%, transparent 60%)`,
          opacity: on ? 1 : 0.45, transition: on ? 'none' : 'opacity 0.55s',
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: '8%', right: '8%', height: 1, pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
        }} />

        {/* content */}
        <div style={{
          position: 'relative', zIndex: 1, height: '100%',
          display: 'flex', flexDirection: 'column',
          padding: '1rem 1.1rem', boxSizing: 'border-box',
        }}>

          {/* ── Top: bcarte label + company logo ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 5,
                background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconCreditCard size={9} color="white" />
              </div>
              <span style={{ fontWeight: 900, fontSize: 9, color: 'rgba(255,255,255,0.75)', letterSpacing: '-0.01em' }}>bcarte</span>
            </div>

            {/* Company logo — large and prominent */}
            {company && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                {companyLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={companyLogoUrl} alt={company} style={{
                    width: 54, height: 54, borderRadius: 13, objectFit: 'cover',
                    background: 'rgba(255,255,255,0.97)',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
                    border: '1.5px solid rgba(255,255,255,0.45)',
                  }} />
                ) : (
                  <div style={{
                    width: 54, height: 54, borderRadius: 13,
                    background: companyColor(company),
                    boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: 19, letterSpacing: '-0.03em',
                  }}>
                    {companyInitials(company)}
                  </div>
                )}
                <span style={{
                  color: 'rgba(255,255,255,0.65)', fontSize: 7.5, fontWeight: 600,
                  maxWidth: 66, textAlign: 'center', lineHeight: 1.2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{company}</span>
              </div>
            )}
          </div>

          {/* ── Name + title ── */}
          <div style={{ marginTop: '0.65rem', flex: 1 }}>
            <p style={{
              color: 'white', fontWeight: 800, fontSize: 17,
              lineHeight: 1.2, letterSpacing: '-0.025em',
              textShadow: '0 1px 8px rgba(0,0,0,0.25)',
            }}>{name || 'Votre Nom'}</p>
            {title && (
              <p style={{
                color: accent, fontSize: 9.5, fontWeight: 700,
                marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.92,
              }}>{title}</p>
            )}
          </div>

          {/* ── Bottom: email + phone + QR ── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {email && (
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 8.5, fontWeight: 500 }}>{email}</p>
              )}
              {phone && (
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 8.5, fontWeight: 500 }}>{phone}</p>
              )}
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.97)',
              borderRadius: 10, padding: 5, flexShrink: 0,
              boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
            }}>
              <QRCode
                value={profileUrl || 'https://bcarte.app'}
                size={80}
                fgColor="#0C0A18"
                bgColor="transparent"
                level="M"
                style={{ display: 'block' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────── */
const PRICE = '29 000 FCFA'

export default function NFCPage() {
  const [profile,     setProfile]     = useState<any>(null)
  const [meEmail,     setMeEmail]     = useState('')
  const [origin,      setOrigin]      = useState('')
  const [paletteId,   setPaletteId]   = useState<PaletteId | null>('violet')
  const [customColor, setCustomColor] = useState('#6C47FF')
  const [downloading, setDownloading] = useState(false)
  const [showOrder,   setShowOrder]   = useState(false)
  const [ordered,     setOrdered]     = useState(false)
  const [address,     setAddress]     = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(d => { if (d?.email) setMeEmail(d.email) })
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
  }, [])

  const name       = profile?.fullName ?? ''
  const title      = profile?.title ?? ''
  const email      = profile?.emailPro || meEmail
  const phone      = profile?.phone ?? ''
  const slug       = profile?.slug ?? ''
  const profileUrl = slug ? `${origin}/p/${slug}` : origin

  // Most recent / current experience for company
  const currentExp     = (profile?.experiences ?? []).find((e: any) => e.isCurrent) ?? profile?.experiences?.[0]
  const company        = currentExp?.company ?? ''

  // If a linked org has a logo, use it
  const linkedOrgLogo  = (profile?.educations ?? []).find((e: any) => e.organisation?.logoUrl)?.organisation?.logoUrl ?? ''
  const companyLogoUrl = linkedOrgLogo

  const { gradient, accent } = getStyle(paletteId, customColor)

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, useCORS: true, backgroundColor: null, logging: false,
      })
      const link = document.createElement('a')
      link.download = `bcarte-${slug || 'carte'}.jpeg`
      link.href = canvas.toDataURL('image/jpeg', 0.95)
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  if (ordered) {
    return (
      <div className="max-w-md mx-auto py-16 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto">
            <IconCheck size={26} className="text-[#059669]" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Commande confirmée !</h2>
          <p className="text-sm text-text-secondary">Livraison sous <strong>7–10 jours</strong>.</p>
        </div>
        <NFCCard name={name} title={title} email={email} phone={phone}
          company={company} companyLogoUrl={companyLogoUrl}
          gradient={gradient} accent={accent} profileUrl={profileUrl} />
        <div className="card space-y-2.5">
          {[{ label: 'Prix', value: PRICE }, { label: 'Adresse', value: address || '—' }].map(r => (
            <div key={r.label} className="flex justify-between text-sm">
              <span className="text-text-secondary">{r.label}</span>
              <span className="font-medium text-text-primary">{r.value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setOrdered(false); setShowOrder(false) }}
          className="btn-secondary w-full justify-center">Retour</button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Carte NFC</h1>
        <p className="page-subtitle">Votre carte de visite digitale</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── Left — aperçu ── */}
        <div className="lg:sticky lg:top-6 space-y-3">
          <NFCCard
            name={name} title={title} email={email} phone={phone}
            company={company} companyLogoUrl={companyLogoUrl}
            gradient={gradient} accent={accent} profileUrl={profileUrl}
            cardRef={cardRef}
          />
          <p className="text-center text-xs text-text-tertiary">Survolez pour l&apos;effet 3D</p>

          <div className="card space-y-3">
            <div className="flex items-center gap-2">
              <IconQrcode size={14} className="text-primary" />
              <p className="text-sm font-semibold text-text-primary">QR Code</p>
            </div>
            {slug
              ? <p className="text-xs font-mono text-primary break-all">{profileUrl}</p>
              : <p className="text-xs text-amber-600">Configure un slug dans ton profil pour activer le QR</p>
            }
            <button onClick={handleDownload} disabled={downloading}
              className="btn-primary w-full justify-center gap-2 text-sm">
              {downloading
                ? <><span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" /> Export…</>
                : <><IconDownload size={14} /> Télécharger en JPEG</>
              }
            </button>
          </div>
        </div>

        {/* ── Right — infos + couleur + commande ── */}
        <div className="space-y-4">

          {/* Infos affichées */}
          <div className="card space-y-2">
            <p className="font-semibold text-sm text-text-primary">Informations affichées</p>
            <p className="text-xs text-text-tertiary">
              Modifiez-les dans <a href="/dashboard/profile" className="text-primary underline">votre profil</a>
            </p>
            <div className="divide-y divide-border-subtle">
              {[
                { label: 'Nom',        value: name  || '—' },
                { label: 'Fonction',   value: title || '—' },
                { label: 'Email',      value: email || '—' },
                { label: 'Téléphone',  value: phone || '—' },
                { label: 'Entreprise', value: company || '—' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2">
                  <span className="text-xs text-text-tertiary w-24 flex-shrink-0">{r.label}</span>
                  <span className={`text-xs font-medium truncate ${r.value === '—' ? 'text-text-tertiary' : 'text-text-primary'}`}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-text-primary">Couleur</h2>
              <label className="relative cursor-pointer flex items-center gap-1.5">
                <span className="text-xs text-text-tertiary">Personnalisée</span>
                <input type="color" value={customColor}
                  onChange={e => { setCustomColor(e.target.value); setPaletteId(null) }}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                <div className="w-7 h-7 rounded-lg border-2 flex items-center justify-center"
                  style={{
                    background: paletteId === null ? customColor : '#F3F4F6',
                    borderColor: paletteId === null ? customColor : '#E5E7EB',
                  }}>
                  {paletteId !== null && <IconPalette size={13} className="text-text-tertiary" />}
                </div>
              </label>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {PALETTE.map(p => {
                const sel = paletteId === p.id
                return (
                  <button key={p.id} onClick={() => setPaletteId(p.id)} title={p.id}
                    style={{
                      background: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`,
                      borderRadius: 9, aspectRatio: '1',
                      border: sel ? '2.5px solid white' : '2.5px solid transparent',
                      outline: sel ? '2.5px solid #6C47FF' : 'none',
                      outlineOffset: 1,
                      boxShadow: sel ? '0 4px 12px rgba(0,0,0,0.25)' : '0 2px 6px rgba(0,0,0,0.12)',
                      transform: sel ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.15s ease', cursor: 'pointer',
                    }} />
                )
              })}
            </div>
          </div>

          {/* Commande */}
          {!showOrder ? (
            <button onClick={() => setShowOrder(true)} className="btn-primary w-full justify-center py-3 text-sm">
              Commander la carte physique — {PRICE}
            </button>
          ) : (
            <div className="card space-y-4">
              <h2 className="font-semibold text-sm text-text-primary">Livraison</h2>
              <div>
                <label className="label">Adresse complète</label>
                <div className="relative">
                  <IconMapPin size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                  <input className="input pl-9" placeholder="Sacré-Cœur 3, Villa 25, Dakar"
                    value={address} onChange={e => setAddress(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowOrder(false)} className="btn-secondary flex-1 justify-center text-sm">Annuler</button>
                <button onClick={() => setOrdered(true)} disabled={!address.trim()}
                  className="btn-primary flex-1 justify-center text-sm disabled:opacity-50">
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
