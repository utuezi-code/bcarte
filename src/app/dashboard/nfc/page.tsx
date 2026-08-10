'use client'

import { useEffect, useRef, useState } from 'react'
import {
  IconCreditCard, IconCheck, IconMapPin, IconUser, IconLink,
  IconPalette, IconDownload, IconQrcode, IconPlus, IconX, IconMail,
} from '@tabler/icons-react'
import QRCode from 'react-qr-code'

/* ── Palette ───────────────────────────────────────────────── */
const PALETTE = [
  { id: 'violet',   from: '#2D1B8E', to: '#6C47FF', accent: '#C4B5FD' },
  { id: 'indigo',   from: '#1E3A8A', to: '#6366F1', accent: '#A5B4FC' },
  { id: 'purple',   from: '#581C87', to: '#9333EA', accent: '#D8B4FE' },
  { id: 'obsidian', from: '#050505', to: '#1C1C1C', accent: '#C9A84C' },
  { id: 'midnight', from: '#0F0E1A', to: '#0F3460', accent: '#60A5FA' },
  { id: 'charcoal', from: '#111827', to: '#374151', accent: '#9CA3AF' },
  { id: 'gold',     from: '#6B3800', to: '#D4A843', accent: '#FDE68A' },
  { id: 'amber',    from: '#78350F', to: '#F59E0B', accent: '#FDE68A' },
  { id: 'bronze',   from: '#6B3A1F', to: '#D4845A', accent: '#FDDCB5' },
  { id: 'crimson',  from: '#7F0000', to: '#DC2626', accent: '#FCA5A5' },
  { id: 'rose',     from: '#881337', to: '#E11D48', accent: '#FDA4AF' },
  { id: 'pink',     from: '#831843', to: '#EC4899', accent: '#F9A8D4' },
  { id: 'emerald',  from: '#064E3B', to: '#10B981', accent: '#6EE7B7' },
  { id: 'teal',     from: '#134E4A', to: '#14B8A6', accent: '#5EEAD4' },
  { id: 'forest',   from: '#14532D', to: '#16A34A', accent: '#86EFAC' },
  { id: 'navy',     from: '#1E3A5F', to: '#2563EB', accent: '#93C5FD' },
  { id: 'sky',      from: '#075985', to: '#0EA5E9', accent: '#BAE6FD' },
  { id: 'cyan',     from: '#164E63', to: '#06B6D4', accent: '#67E8F9' },
  { id: 'orange',   from: '#7C2D12', to: '#EA580C', accent: '#FDBA74' },
  { id: 'sunset',   from: '#92400E', to: '#F97316', accent: '#FED7AA' },
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
function darken(hex: string, f = 0.45) { const { r, g, b } = hexToRgb(hex); return rgbToHex(r * f, g * f, b * f) }
function lighten(hex: string, f = 1.35) { const { r, g, b } = hexToRgb(hex); return rgbToHex(r * f, g * f, b * f) }
function customGradient(hex: string) {
  return `linear-gradient(135deg, ${darken(hex, 0.4)} 0%, ${hex} 55%, ${lighten(hex, 1.25)} 100%)`
}
function getStyle(selectedId: PaletteId | null, customColor: string) {
  if (!selectedId) return { gradient: customGradient(customColor), accent: lighten(customColor, 1.5) }
  const p = PALETTE.find(x => x.id === selectedId)!
  return { gradient: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`, accent: p.accent }
}

const PRICE = '29 000 FCFA'

/* ── Carte ─────────────────────────────────────────────────── */
function NFCCard({
  name, title, email, phone, customLines, gradient, accent, profileUrl, cardRef,
}: {
  name: string; title: string; email: string; phone: string
  customLines: string[]
  gradient: string; accent: string; profileUrl: string
  cardRef?: React.RefObject<HTMLDivElement>
}) {
  const ref       = useRef<HTMLDivElement>(null)
  const [rot, setRot]     = useState({ x: 0, y: 0 })
  const [shine, setShine] = useState({ x: 50, y: 50 })
  const [on, setOn]       = useState(false)

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top)  / r.height
    setRot({ x: (py - 0.5) * -22, y: (px - 0.5) * 22 })
    setShine({ x: px * 100, y: py * 100 })
  }
  const leave = () => { setRot({ x: 0, y: 0 }); setShine({ x: 50, y: 50 }); setOn(false) }

  // visible contact lines (non-empty)
  const contacts = [
    email, phone, ...customLines,
  ].filter(Boolean)

  return (
    <div style={{ perspective: '1200px' }} ref={cardRef}>
      <div
        ref={ref}
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
        {/* shine */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.22) 0%, transparent 60%)`,
          opacity: on ? 1 : 0.45, transition: on ? 'none' : 'opacity 0.55s',
        }} />
        {/* glass overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)',
        }} />
        {/* top highlight line */}
        <div style={{
          position: 'absolute', top: 0, left: '8%', right: '8%', height: 1, pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
        }} />

        {/* content */}
        <div style={{
          position: 'relative', zIndex: 1, height: '100%',
          display: 'flex', flexDirection: 'column',
          padding: '1.1rem 1.3rem',
        }}>

          {/* ── Top bar ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconCreditCard size={11} color="white" />
              </div>
              <span style={{ fontWeight: 900, fontSize: 11, color: 'white', opacity: 0.9, letterSpacing: '-0.01em' }}>bcarte</span>
            </div>
            {/* chip */}
            <div style={{
              width: 32, height: 24, borderRadius: 5,
              background: `linear-gradient(135deg, ${accent}99, ${accent}44)`,
              border: `1px solid ${accent}55`,
              boxShadow: `0 2px 8px ${accent}33`,
            }} />
          </div>

          {/* ── Identity ── */}
          <div style={{ marginTop: '0.7rem', flex: 1 }}>
            <p style={{
              color: 'white', fontWeight: 800, fontSize: 17,
              lineHeight: 1.2, letterSpacing: '-0.025em',
              textShadow: '0 1px 8px rgba(0,0,0,0.25)',
            }}>{name}</p>
            <p style={{
              color: `${accent}`, fontSize: 10, fontWeight: 700,
              marginTop: 3, letterSpacing: '0.04em', textTransform: 'uppercase',
              opacity: 0.9,
            }}>{title}</p>
          </div>

          {/* ── Bottom: contacts + QR ── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>

            {/* contacts */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {contacts.slice(0, 4).map((line, i) => (
                <p key={i} style={{
                  color: 'rgba(255,255,255,0.6)', fontSize: 9,
                  fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{line}</p>
              ))}
            </div>

            {/* QR code — large */}
            <div style={{
              background: 'rgba(255,255,255,0.97)',
              borderRadius: 10, padding: 6,
              flexShrink: 0,
              boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
              transform: 'translateZ(12px)',
            }}>
              <QRCode
                value={profileUrl || 'https://bcarte.app'}
                size={78}
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
export default function NFCPage() {
  const [selectedId,   setSelectedId]   = useState<PaletteId | null>('violet')
  const [customColor,  setCustomColor]  = useState('#6C47FF')
  const [address,      setAddress]      = useState('')
  const [showOrder,    setShowOrder]    = useState(false)
  const [ordered,      setOrdered]      = useState(false)
  const [profile,      setProfile]      = useState<any>(null)
  const [origin,       setOrigin]       = useState('')
  const [downloading,  setDownloading]  = useState(false)
  const [customLines,  setCustomLines]  = useState<string[]>([])
  const [newLine,      setNewLine]      = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
  }, [])

  const name       = profile?.fullName  ?? 'Votre Nom'
  const title      = profile?.title     ?? 'Votre titre'
  const email      = profile?.emailPro  ?? profile?.email ?? ''
  const phone      = profile?.phone     ?? ''
  const slug       = profile?.slug      ?? ''
  const profileUrl = slug ? `${origin}/p/${slug}` : `${origin}`
  const { gradient, accent } = getStyle(selectedId, customColor)

  const addLine = () => {
    const v = newLine.trim()
    if (!v || customLines.length >= 4) return
    setCustomLines(prev => [...prev, v])
    setNewLine('')
  }

  const removeLine = (i: number) => setCustomLines(prev => prev.filter((_, idx) => idx !== i))

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
          <div className="w-14 h-14 bg-success-light rounded-full flex items-center justify-center mx-auto">
            <IconCheck size={26} className="text-success" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Commande confirmée !</h2>
          <p className="text-sm text-text-secondary">Livraison sous <strong>7–10 jours</strong>.</p>
        </div>
        <NFCCard name={name} title={title} email={email} phone={phone} customLines={customLines}
          gradient={gradient} accent={accent} profileUrl={profileUrl} />
        <div className="card space-y-2.5">
          {[{ label: 'Prix', value: PRICE }, { label: 'Adresse', value: address || '—' }].map(r => (
            <div key={r.label} className="flex justify-between text-sm">
              <span className="text-text-secondary">{r.label}</span>
              <span className="font-medium text-text-primary">{r.value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setOrdered(false); setShowOrder(false) }} className="btn-secondary w-full justify-center">
          Nouvelle commande
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Carte NFC</h1>
        <p className="page-subtitle">Carte de visite connectée avec QR code vers votre profil</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

        {/* ── Gauche — carte ── */}
        <div className="lg:sticky lg:top-6 space-y-3">
          <NFCCard
            name={name} title={title} email={email} phone={phone}
            customLines={customLines} gradient={gradient} accent={accent}
            profileUrl={profileUrl} cardRef={cardRef}
          />
          <p className="text-center text-xs text-text-tertiary">
            Survolez pour l&apos;effet 3D · Mise à jour en temps réel
          </p>

          {/* QR info + download */}
          <div className="card space-y-3">
            <div className="flex items-center gap-2">
              <IconQrcode size={14} className="text-primary" />
              <p className="text-sm font-semibold text-text-primary">QR Code</p>
            </div>
            <p className="text-xs text-text-secondary break-all">
              {slug
                ? <><span className="text-text-tertiary">Lien : </span><span className="font-mono text-primary">{profileUrl}</span></>
                : <span className="text-amber-600">Configure un slug dans ton profil pour activer le QR code</span>
              }
            </p>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary w-full justify-center gap-2 text-sm"
            >
              {downloading
                ? <><span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" /> Export…</>
                : <><IconDownload size={14} /> Télécharger en JPEG</>
              }
            </button>
          </div>
        </div>

        {/* ── Droite — contrôles ── */}
        <div className="space-y-4">

          {/* Infos du profil */}
          <div className="card space-y-3">
            <h2 className="font-semibold text-sm text-text-primary">Informations affichées</h2>
            <div className="space-y-2">
              {[
                { icon: IconUser,  label: name  || '—', sub: 'Nom' },
                { icon: IconCreditCard, label: title || '—', sub: 'Poste' },
                { icon: IconMail,  label: email || '—', sub: 'Email' },
                { icon: IconLink,  label: slug ? `/p/${slug}` : 'Profil non configuré', sub: 'URL' },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <row.icon size={13} className="text-text-tertiary flex-shrink-0" />
                  <span className="text-text-secondary truncate flex-1">{row.label}</span>
                  <span className="text-[10px] text-text-tertiary">{row.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Informations personnalisées */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-text-primary">Infos personnalisées</h2>
              <span className="text-[10px] text-text-tertiary">{customLines.length}/4</span>
            </div>
            <p className="text-xs text-text-tertiary">Ajoutez ce que vous voulez : LinkedIn, site web, entreprise…</p>

            {/* existing lines */}
            {customLines.map((line, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-bg-light border border-border text-sm">
                <span className="flex-1 text-text-secondary truncate">{line}</span>
                <button onClick={() => removeLine(i)} className="text-text-tertiary hover:text-red-500 transition-colors flex-shrink-0">
                  <IconX size={13} />
                </button>
              </div>
            ))}

            {/* add new line */}
            {customLines.length < 4 && (
              <div className="flex gap-2">
                <input
                  className="input flex-1 text-sm"
                  placeholder="ex: linkedin.com/in/moctar"
                  value={newLine}
                  onChange={e => setNewLine(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addLine()}
                  maxLength={40}
                />
                <button
                  onClick={addLine}
                  disabled={!newLine.trim()}
                  className="btn-primary px-3 disabled:opacity-40"
                >
                  <IconPlus size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Couleur */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-text-primary">Couleur</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-tertiary">Personnalisée</span>
                <label className="relative cursor-pointer">
                  <input type="color" value={customColor}
                    onChange={e => { setCustomColor(e.target.value); setSelectedId(null) }}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                  <div className="w-7 h-7 rounded-lg border-2 transition-all flex items-center justify-center"
                    style={{
                      background: selectedId === null ? customColor : '#F3F4F6',
                      borderColor: selectedId === null ? customColor : '#E5E7EB',
                    }}>
                    {selectedId !== null && <IconPalette size={13} className="text-text-tertiary" />}
                  </div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {PALETTE.map(p => {
                const isSelected = selectedId === p.id
                return (
                  <button key={p.id} onClick={() => setSelectedId(p.id)} title={p.id}
                    style={{
                      background: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)`,
                      borderRadius: 10, aspectRatio: '1',
                      border: isSelected ? '2.5px solid white' : '2.5px solid transparent',
                      outline: isSelected ? '2.5px solid #6C47FF' : 'none',
                      outlineOffset: 1,
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.25)' : '0 2px 6px rgba(0,0,0,0.12)',
                      transition: 'all 0.15s ease',
                      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                      cursor: 'pointer',
                    }} />
                )
              })}
            </div>
          </div>

          {/* Commander */}
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
