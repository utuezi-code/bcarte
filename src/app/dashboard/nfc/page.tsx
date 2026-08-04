'use client'

import { useEffect, useRef, useState } from 'react'
import { IconCreditCard, IconCheck, IconMapPin, IconUser, IconLink } from '@tabler/icons-react'
import QRCode from 'react-qr-code'

/* ── Designs ───────────────────────────────────────────────── */
const DESIGNS = {
  violet: {
    label: 'Violet',
    gradient: 'linear-gradient(135deg, #6C47FF 0%, #4528CC 55%, #2D1B8E 100%)',
    accent: '#A78BFA',
  },
  or: {
    label: 'Doré',
    gradient: 'linear-gradient(135deg, #92620A 0%, #C4921F 50%, #F5C842 100%)',
    accent: '#FDE68A',
  },
  noir: {
    label: 'Minuit',
    gradient: 'linear-gradient(135deg, #0F0E1A 0%, #1A1A2E 50%, #0F3460 100%)',
    accent: '#60A5FA',
  },
} as const
type Design = keyof typeof DESIGNS
const PRICE = '29 000 FCFA'

/* ── Composant carte 3D ────────────────────────────────────── */
function NFCCard3D({
  name, title, phone, design, profileUrl,
}: {
  name: string; title: string; phone: string; design: Design; profileUrl: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [rot, setRot]     = useState({ x: 0, y: 0 })
  const [shine, setShine] = useState({ x: 50, y: 50 })
  const [on, setOn]       = useState(false)

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top)  / r.height
    setRot({ x: (py - 0.5) * -24, y: (px - 0.5) * 24 })
    setShine({ x: px * 100, y: py * 100 })
  }

  const leave = () => { setRot({ x: 0, y: 0 }); setShine({ x: 50, y: 50 }); setOn(false) }

  const d = DESIGNS[design]

  return (
    <div style={{ perspective: '1200px' }}>
      <div
        ref={ref}
        onMouseMove={move}
        onMouseEnter={() => setOn(true)}
        onMouseLeave={leave}
        style={{
          width: '100%',
          aspectRatio: '1.586',
          background: d.gradient,
          borderRadius: 20,
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${on ? 1.03 : 1})`,
          transition: on ? 'transform 0.07s linear' : 'transform 0.55s cubic-bezier(0.23,1,0.32,1)',
          transformStyle: 'preserve-3d',
          boxShadow: on
            ? '0 50px 100px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.1)'
            : '0 20px 60px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.07)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Shine spot */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
          opacity: on ? 1 : 0.45,
          transition: on ? 'none' : 'opacity 0.55s',
        }} />

        {/* Glass sheen */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)',
        }} />

        {/* Top edge highlight */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1, height: '100%',
          display: 'flex', flexDirection: 'column',
          padding: '1.25rem 1.4rem', color: 'white',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconCreditCard size={14} style={{ opacity: 0.85 }} />
              <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: '-0.01em', opacity: 0.9 }}>bcarte</span>
            </div>
            {/* Puce */}
            <div style={{
              width: 30, height: 22, borderRadius: 4,
              background: `linear-gradient(135deg, ${d.accent}88, ${d.accent}33)`,
              border: `1px solid ${d.accent}44`,
            }} />
          </div>

          {/* Bas */}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            {/* Infos */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                {name}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 4 }}>{title}</p>
              {phone && (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, marginTop: 8 }}>{phone}</p>
              )}
            </div>

            {/* QR code */}
            <div style={{
              background: 'rgba(255,255,255,0.97)',
              borderRadius: 8, padding: 5,
              flexShrink: 0,
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              transform: 'translateZ(10px)',
            }}>
              <QRCode
                value={profileUrl || 'https://bcarte.app'}
                size={60}
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
  const [design, setDesign]     = useState<Design>('violet')
  const [address, setAddress]   = useState('')
  const [showOrder, setShowOrder] = useState(false)
  const [ordered, setOrdered]   = useState(false)
  const [profile, setProfile]   = useState<any>(null)
  const [origin, setOrigin]     = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
  }, [])

  const name       = profile?.fullName ?? 'Votre Nom'
  const title      = profile?.title    ?? 'Votre titre'
  const phone      = profile?.phone    ?? ''
  const slug       = profile?.slug     ?? ''
  const profileUrl = slug ? `${origin}/p/${slug}` : `${origin}/p/profil`

  /* Confirmation */
  if (ordered) {
    return (
      <div className="max-w-md mx-auto py-16 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-success-light rounded-full flex items-center justify-center mx-auto">
            <IconCheck size={26} className="text-success" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Commande confirmée !</h2>
          <p className="text-sm text-text-secondary">
            Votre carte NFC est en fabrication. Livraison sous <strong>7–10 jours</strong>.
          </p>
        </div>

        <NFCCard3D name={name} title={title} phone={phone} design={design} profileUrl={profileUrl} />

        <div className="card space-y-2.5">
          {[
            { label: 'Design',   value: DESIGNS[design].label },
            { label: 'Prix',     value: PRICE },
            { label: 'Adresse',  value: address || '—' },
          ].map(r => (
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

      {/* En-tête */}
      <div>
        <h1 className="page-title">Carte NFC</h1>
        <p className="page-subtitle">Carte de visite connectée avec QR code vers votre profil public</p>
      </div>

      {/* Layout 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* Gauche — carte sticky */}
        <div className="lg:sticky lg:top-6 space-y-3">
          <NFCCard3D name={name} title={title} phone={phone} design={design} profileUrl={profileUrl} />
          <p className="text-center text-xs text-text-tertiary">
            Survolez la carte pour l&apos;effet 3D · Mise à jour en temps réel
          </p>
        </div>

        {/* Droite — contrôles */}
        <div className="space-y-4">

          {/* Infos du profil */}
          <div className="card space-y-3">
            <h2 className="font-semibold text-sm text-text-primary">Vos informations</h2>
            <div className="space-y-2">
              {[
                { icon: IconUser,  label: name  || '—' },
                { icon: IconCreditCard, label: title || '—' },
                { icon: IconLink,  label: slug ? `/p/${slug}` : 'Profil non configuré' },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <row.icon size={13} className="text-text-tertiary flex-shrink-0" />
                  <span className="text-text-secondary truncate">{row.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Choix du design */}
          <div className="card space-y-3">
            <h2 className="font-semibold text-sm text-text-primary">Design</h2>
            <div className="space-y-2">
              {(Object.entries(DESIGNS) as [Design, typeof DESIGNS[Design]][]).map(([key, d]) => (
                <button
                  key={key}
                  onClick={() => setDesign(key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    design === key
                      ? 'border-primary bg-primary-light'
                      : 'border-border hover:border-primary-border'
                  }`}
                >
                  <div className="w-10 h-7 rounded-lg flex-shrink-0" style={{ background: d.gradient }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">{d.label}</p>
                    <p className="text-xs text-text-tertiary">{PRICE}</p>
                  </div>
                  {design === key && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <IconCheck size={11} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Commander */}
          {!showOrder ? (
            <button
              onClick={() => setShowOrder(true)}
              className="btn-primary w-full justify-center py-3 text-sm"
            >
              Commander — {PRICE}
            </button>
          ) : (
            <div className="card space-y-4">
              <h2 className="font-semibold text-sm text-text-primary">Livraison</h2>
              <div>
                <label className="label">Adresse complète</label>
                <div className="relative">
                  <IconMapPin size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                  <input
                    className="input pl-9"
                    placeholder="Sacré-Cœur 3, Villa 25, Dakar"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowOrder(false)} className="btn-secondary flex-1 justify-center text-sm">
                  Annuler
                </button>
                <button
                  onClick={() => setOrdered(true)}
                  disabled={!address.trim()}
                  className="btn-primary flex-1 justify-center text-sm disabled:opacity-50"
                >
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
