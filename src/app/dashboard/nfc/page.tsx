'use client'

import { useEffect, useRef, useState } from 'react'
import { IconCreditCard, IconCheck, IconChevronRight, IconChevronLeft, IconMapPin } from '@tabler/icons-react'
import QRCode from 'react-qr-code'

/* ── Design tokens ─────────────────────────────────────────── */
const DESIGNS = {
  violet: {
    label: 'Violet',
    gradient: 'linear-gradient(135deg, #6C47FF 0%, #4528CC 60%, #2D1B8E 100%)',
    accent: '#A78BFA',
  },
  or: {
    label: 'Doré',
    gradient: 'linear-gradient(135deg, #B7881C 0%, #D4A843 50%, #F5C842 100%)',
    accent: '#FDE68A',
  },
  noir: {
    label: 'Noir',
    gradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
    accent: '#60A5FA',
  },
} as const

type Design = keyof typeof DESIGNS
const STEPS = ['Aperçu', 'Design', 'Commander']
const PRICE = '29 000 FCFA'

/* ── Carte 3D glass ────────────────────────────────────────── */
function NFCCard3D({
  name, title, phone, design, profileUrl,
}: {
  name: string; title: string; phone: string; design: Design; profileUrl: string
}) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const [rot, setRot]       = useState({ x: 0, y: 0 })
  const [shine, setShine]   = useState({ x: 50, y: 50 })
  const [active, setActive] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top)  / r.height
    setRot({ x: (py - 0.5) * -22, y: (px - 0.5) * 22 })
    setShine({ x: px * 100, y: py * 100 })
  }

  const onLeave = () => { setRot({ x: 0, y: 0 }); setShine({ x: 50, y: 50 }); setActive(false) }

  const d = DESIGNS[design]

  return (
    <div style={{ perspective: '1200px' }} className="w-full flex justify-center py-4">
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={onLeave}
        style={{
          width: '100%',
          maxWidth: 420,
          aspectRatio: '1.586',
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${active ? 1.04 : 1})`,
          transition: active
            ? 'transform 0.08s linear'
            : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
          transformStyle: 'preserve-3d',
          borderRadius: 24,
          background: d.gradient,
          boxShadow: active
            ? `0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.1)`
            : `0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.07)`,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Shine */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.18) 0%, transparent 65%)`,
          transition: active ? 'none' : 'opacity 0.5s',
          opacity: active ? 1 : 0.5,
          pointerEvents: 'none',
        }} />

        {/* Glass overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }} />

        {/* Bord supérieur lumineux */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Contenu */}
        <div style={{
          position: 'relative', zIndex: 1,
          height: '100%', display: 'flex', flexDirection: 'column',
          padding: '1.4rem 1.5rem',
          color: 'white',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconCreditCard size={15} style={{ opacity: 0.9 }} />
              <span style={{ fontWeight: 900, fontSize: 13, letterSpacing: '-0.02em' }}>bcarte</span>
            </div>
            {/* Puce simulée */}
            <div style={{
              width: 32, height: 24, borderRadius: 4,
              background: `linear-gradient(135deg, ${d.accent}66, ${d.accent}33)`,
              border: `1px solid ${d.accent}55`,
            }} />
          </div>

          {/* QR code + info */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
            {/* Info */}
            <div style={{ flex: 1, marginRight: 16 }}>
              <p style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {name}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 3 }}>{title}</p>
              {phone && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, marginTop: 8 }}>{phone}</p>}
            </div>

            {/* QR */}
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 10,
              padding: 6,
              flexShrink: 0,
              transform: 'translateZ(12px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}>
              <QRCode
                value={profileUrl || 'https://bcarte.app'}
                size={64}
                style={{ display: 'block' }}
                level="M"
                fgColor="#0C0A18"
                bgColor="transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Page principale ───────────────────────────────────────── */
export default function NFCPage() {
  const [step, setStep]       = useState(0)
  const [design, setDesign]   = useState<Design>('violet')
  const [address, setAddress] = useState('')
  const [ordered, setOrdered] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [origin, setOrigin]   = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
  }, [])

  const name       = profile?.fullName ?? 'Votre Nom'
  const title      = profile?.title    ?? 'Votre titre'
  const phone      = profile?.phone    ?? ''
  const slug       = profile?.slug     ?? ''
  const profileUrl = slug ? `${origin}/p/${slug}` : `${origin}/p/profil`

  if (ordered) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-5">
        <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto">
          <IconCheck size={28} className="text-success" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">Commande confirmée !</h2>
          <p className="text-sm text-text-secondary mt-1">
            Votre carte NFC est en fabrication. Livraison sous <strong>7–10 jours</strong>.
          </p>
        </div>
        <NFCCard3D name={name} title={title} phone={phone} design={design} profileUrl={profileUrl} />
        <div className="card text-left space-y-3">
          {[
            { label: 'Design',   value: DESIGNS[design].label },
            { label: 'Prix',     value: PRICE },
            { label: 'Adresse',  value: address || '—' },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-text-secondary">{row.label}</span>
              <span className="font-medium text-text-primary">{row.value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setOrdered(false); setStep(0) }} className="btn-secondary w-full justify-center">
          Nouvelle commande
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5">

      {/* En-tête */}
      <div>
        <h1 className="page-title">Carte NFC</h1>
        <p className="page-subtitle">Votre carte de visite connectée — avec QR code vers votre profil</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step  ? 'bg-primary text-white' :
                i === step ? 'bg-primary text-white ring-4 ring-primary/15' :
                'bg-border-subtle text-text-tertiary'
              }`}>
                {i < step ? <IconCheck size={12} /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === step ? 'text-text-primary' : 'text-text-tertiary'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`mx-3 h-px w-8 transition-colors ${i < step ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* Carte 3D — toujours visible, mise à jour en temps réel */}
      <NFCCard3D name={name} title={title} phone={phone} design={design} profileUrl={profileUrl} />

      {/* Étape 1 — Aperçu */}
      {step === 0 && (
        <div className="card space-y-4">
          <div>
            <p className="text-xs text-text-tertiary">
              Survolez la carte pour voir l&apos;effet 3D · Le QR code redirige vers{' '}
              <span className="text-primary font-medium">/p/{slug || 'votre-profil'}</span>
            </p>
          </div>
          <div className="space-y-2 pt-1">
            {[
              { label: 'Nom',       value: name  },
              { label: 'Titre',     value: title },
              { label: 'Téléphone', value: phone  || '—' },
            ].map(row => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-text-secondary">{row.label}</span>
                <span className="font-medium text-text-primary">{row.value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="btn-primary w-full justify-center gap-2 py-2.5">
            Choisir le design <IconChevronRight size={15} />
          </button>
        </div>
      )}

      {/* Étape 2 — Design */}
      {step === 1 && (
        <div className="card space-y-5">
          <div>
            <h2 className="font-semibold text-text-primary">Choisissez votre design</h2>
            <p className="text-xs text-text-tertiary mt-0.5">La carte s&apos;actualise en temps réel ci-dessus</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(DESIGNS) as [Design, typeof DESIGNS[Design]][]).map(([key, d]) => (
              <button
                key={key}
                onClick={() => setDesign(key)}
                className={`rounded-xl p-3 border-2 transition-all text-left ${
                  design === key ? 'border-primary shadow-sm' : 'border-border hover:border-primary-border'
                }`}
              >
                <div className="h-10 rounded-lg mb-2.5" style={{ background: d.gradient }} />
                <p className="text-xs font-semibold text-text-primary">{d.label}</p>
                <p className="text-[10px] text-text-tertiary mt-0.5">{PRICE}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary flex-1 justify-center gap-2">
              <IconChevronLeft size={15} /> Retour
            </button>
            <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center gap-2">
              Commander <IconChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 — Commander */}
      {step === 2 && (
        <div className="card space-y-5">
          <h2 className="font-semibold text-text-primary">Récapitulatif de la commande</h2>
          <div className="space-y-2">
            {[
              { label: 'Design', value: DESIGNS[design].label },
              { label: 'Prix',   value: PRICE },
            ].map(row => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-text-secondary">{row.label}</span>
                <span className="font-semibold text-text-primary">{row.value}</span>
              </div>
            ))}
          </div>
          <div>
            <label className="label">Adresse de livraison</label>
            <div className="relative">
              <IconMapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
              <input
                className="input pl-9"
                placeholder="Ex: Sacré-Cœur 3, Villa 25, Dakar"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center gap-2">
              <IconChevronLeft size={15} /> Retour
            </button>
            <button onClick={() => setOrdered(true)} className="btn-primary flex-1 justify-center gap-2 py-2.5">
              <IconCheck size={15} /> Confirmer la commande
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
