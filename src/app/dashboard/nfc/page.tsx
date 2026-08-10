'use client'

import { useEffect, useRef, useState } from 'react'
import {
  IconCreditCard, IconCheck, IconMapPin, IconDownload, IconQrcode,
  IconPlus, IconX, IconPalette, IconBriefcase, IconSchool,
  IconChevronLeft, IconChevronRight,
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

function orgInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
}
function orgColor(name: string) {
  const COLORS = ['#6C47FF', '#059669', '#2563EB', '#D97706', '#DC2626', '#0891B2', '#7C3AED']
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return COLORS[Math.abs(h) % COLORS.length]
}
function formatPeriod(start: string | number, end: string | number | null, current: boolean) {
  if (!start) return ''
  const s = String(start).slice(0, 4)
  if (current) return `${s} – présent`
  if (!end) return s
  return `${s} – ${String(end).slice(0, 4)}`
}

/* ── Types ─────────────────────────────────────────────────── */
interface Experience {
  id: string; title: string; company: string; city?: string
  startDate: string; endDate?: string; isCurrent: boolean
}
interface Education {
  id: string; degree: string; field?: string; startYear: string | number; endYear?: string | number; isCurrent: boolean
  organisation?: { name: string; slug: string; logoUrl?: string }
}

type HighlightItem =
  | { type: 'experience'; data: Experience }
  | { type: 'education';  data: Education  }

type CardSlot = {
  itemId: string | null
  itemType: 'experience' | 'education' | null
  paletteId: PaletteId | null
  customColor: string
  customLines: string[]
}

const DEFAULT_SLOT: CardSlot = {
  itemId: null, itemType: null,
  paletteId: 'violet', customColor: '#6C47FF', customLines: [],
}

const PRICE = '29 000 FCFA'

/* ── NFCCard ────────────────────────────────────────────────── */
function NFCCard({
  name, highlight, gradient, accent, profileUrl, customLines, cardRef,
}: {
  name: string
  highlight: HighlightItem | null
  gradient: string; accent: string; profileUrl: string
  customLines: string[]
  cardRef?: React.RefObject<HTMLDivElement>
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
    setRot({ x: (py - 0.5) * -22, y: (px - 0.5) * 22 })
    setShine({ x: px * 100, y: py * 100 })
  }
  const leave = () => { setRot({ x: 0, y: 0 }); setShine({ x: 50, y: 50 }); setOn(false) }

  // Derive display values from highlight
  let orgName = ''
  let orgLogoUrl = ''
  let role = ''
  let period = ''

  if (highlight?.type === 'experience') {
    const d = highlight.data
    orgName = d.company
    role    = d.title
    period  = formatPeriod(d.startDate, d.endDate ?? null, d.isCurrent)
  } else if (highlight?.type === 'education') {
    const d = highlight.data
    orgName = d.organisation?.name ?? ''
    orgLogoUrl = d.organisation?.logoUrl ?? ''
    role    = [d.degree, d.field].filter(Boolean).join(' · ')
    period  = formatPeriod(d.startYear, d.endYear ?? null, d.isCurrent)
  }

  const contacts = [...customLines].filter(Boolean)

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
          padding: '1rem 1.15rem',
          boxSizing: 'border-box',
        }}>

          {/* ── Top bar: bcarte brand + org logo ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            {/* bcarte chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 5,
                background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <IconCreditCard size={10} color="white" />
              </div>
              <span style={{ fontWeight: 900, fontSize: 10, color: 'white', opacity: 0.85, letterSpacing: '-0.01em' }}>bcarte</span>
            </div>

            {/* Org logo — prominent */}
            {orgName && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                {orgLogoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={orgLogoUrl}
                    alt={orgName}
                    style={{
                      width: 52, height: 52, borderRadius: 12, objectFit: 'cover',
                      background: 'rgba(255,255,255,0.97)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      border: '1.5px solid rgba(255,255,255,0.4)',
                    }}
                  />
                ) : (
                  <div style={{
                    width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                    background: orgColor(orgName),
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em',
                  }}>
                    {orgInitials(orgName)}
                  </div>
                )}
                <span style={{
                  color: 'rgba(255,255,255,0.75)', fontSize: 8, fontWeight: 600,
                  maxWidth: 64, textAlign: 'center', lineHeight: 1.2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{orgName}</span>
              </div>
            )}

            {/* NFC chip (shown when no org) */}
            {!orgName && (
              <div style={{
                width: 32, height: 24, borderRadius: 5,
                background: `linear-gradient(135deg, ${accent}99, ${accent}44)`,
                border: `1px solid ${accent}55`,
                boxShadow: `0 2px 8px ${accent}33`,
              }} />
            )}
          </div>

          {/* ── Identity ── */}
          <div style={{ marginTop: '0.55rem', flex: 1, minHeight: 0 }}>
            <p style={{
              color: 'white', fontWeight: 800, fontSize: 16,
              lineHeight: 1.2, letterSpacing: '-0.025em',
              textShadow: '0 1px 8px rgba(0,0,0,0.25)',
            }}>{name || 'Votre Nom'}</p>
            {role && (
              <p style={{
                color: accent, fontSize: 9.5, fontWeight: 700,
                marginTop: 3, letterSpacing: '0.03em', textTransform: 'uppercase', opacity: 0.9,
              }}>{role}</p>
            )}
            {period && (
              <p style={{
                color: 'rgba(255,255,255,0.5)', fontSize: 8.5, fontWeight: 500, marginTop: 2,
              }}>{period}</p>
            )}
          </div>

          {/* ── Bottom: contacts + QR ── */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
            {/* contacts */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {contacts.slice(0, 4).map((line, i) => (
                <p key={i} style={{
                  color: 'rgba(255,255,255,0.6)', fontSize: 8.5,
                  fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{line}</p>
              ))}
            </div>

            {/* QR code */}
            <div style={{
              background: 'rgba(255,255,255,0.97)',
              borderRadius: 10, padding: 5,
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
  const [activeSlot, setActiveSlot]   = useState(0)
  const [slots, setSlots]             = useState<CardSlot[]>([DEFAULT_SLOT, DEFAULT_SLOT, DEFAULT_SLOT])
  const [profile,   setProfile]       = useState<any>(null)
  const [origin,    setOrigin]        = useState('')
  const [downloading, setDownloading] = useState(false)
  const [newLine, setNewLine]         = useState('')
  const [showOrder, setShowOrder]     = useState(false)
  const [ordered, setOrdered]         = useState(false)
  const [address, setAddress]         = useState('')
  const cardRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]

  useEffect(() => {
    setOrigin(window.location.origin)
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
  }, [])

  const slot = slots[activeSlot]
  const updateSlot = (patch: Partial<CardSlot>) => {
    setSlots(prev => prev.map((s, i) => i === activeSlot ? { ...s, ...patch } : s))
  }

  const name       = profile?.fullName ?? 'Votre Nom'
  const slug       = profile?.slug ?? ''
  const profileUrl = slug ? `${origin}/p/${slug}` : origin
  const { gradient, accent } = getStyle(slot.paletteId, slot.customColor)

  const experiences: Experience[] = profile?.experiences ?? []
  const educations:  Education[]  = profile?.educations  ?? []

  // Resolve the highlighted item for current slot
  const highlight: HighlightItem | null = (() => {
    if (!slot.itemId || !slot.itemType) return null
    if (slot.itemType === 'experience') {
      const d = experiences.find(e => e.id === slot.itemId)
      return d ? { type: 'experience', data: d } : null
    }
    if (slot.itemType === 'education') {
      const d = educations.find(e => e.id === slot.itemId)
      return d ? { type: 'education', data: d } : null
    }
    return null
  })()

  const addLine = () => {
    const v = newLine.trim()
    if (!v || slot.customLines.length >= 4) return
    updateSlot({ customLines: [...slot.customLines, v] })
    setNewLine('')
  }
  const removeLine = (i: number) => updateSlot({ customLines: slot.customLines.filter((_, idx) => idx !== i) })

  const handleDownload = async () => {
    const ref = cardRefs[activeSlot]
    if (!ref.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(ref.current, {
        scale: 3, useCORS: true, backgroundColor: null, logging: false,
      })
      const link = document.createElement('a')
      link.download = `bcarte-${activeSlot + 1}-${slug || 'carte'}.jpeg`
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
        <NFCCard name={name} highlight={highlight} gradient={gradient} accent={accent}
          profileUrl={profileUrl} customLines={slot.customLines} />
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
        <p className="page-subtitle">3 cartes indépendantes, chacune liée à une expérience ou formation</p>
      </div>

      {/* ── Slot tabs ── */}
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <button key={i} onClick={() => setActiveSlot(i)}
            className={`flex-1 py-2.5 rounded-[10px] text-sm font-semibold transition-all border-2 ${
              activeSlot === i
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'border-border text-text-secondary hover:border-primary/40 hover:bg-bg-light'
            }`}>
            Carte {i + 1}
            {slots[i].itemId && (
              <span className={`ml-1.5 inline-block w-1.5 h-1.5 rounded-full align-middle ${
                activeSlot === i ? 'bg-white/70' : 'bg-primary'
              }`} />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

        {/* ── Left — card preview ── */}
        <div className="lg:sticky lg:top-6 space-y-3">
          <NFCCard
            name={name} highlight={highlight} gradient={gradient} accent={accent}
            profileUrl={profileUrl} customLines={slot.customLines}
            cardRef={cardRefs[activeSlot]}
          />
          <p className="text-center text-xs text-text-tertiary">
            Survolez pour l&apos;effet 3D · Carte {activeSlot + 1}
          </p>

          {/* QR + download */}
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
            <button onClick={handleDownload} disabled={downloading}
              className="btn-primary w-full justify-center gap-2 text-sm">
              {downloading
                ? <><span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" /> Export…</>
                : <><IconDownload size={14} /> Télécharger en JPEG</>
              }
            </button>
          </div>
        </div>

        {/* ── Right — controls ── */}
        <div className="space-y-4">

          {/* Selector: experience or education */}
          <div className="card space-y-3">
            <h2 className="font-semibold text-sm text-text-primary">Expérience ou formation à mettre en avant</h2>
            <p className="text-xs text-text-tertiary">Choisissez ce que vous souhaitez afficher sur cette carte</p>

            {/* Experiences */}
            {experiences.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-1.5">
                  <IconBriefcase size={10} /> Expériences
                </p>
                {experiences.map(exp => {
                  const isSelected = slot.itemId === exp.id && slot.itemType === 'experience'
                  return (
                    <button key={exp.id}
                      onClick={() => updateSlot({ itemId: exp.id, itemType: 'experience' })}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-[9px] border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-light'
                          : 'border-border hover:border-primary/40 hover:bg-bg-light'
                      }`}>
                      <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                        style={{ background: orgColor(exp.company) }}>
                        {orgInitials(exp.company)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                          {exp.title}
                        </p>
                        <p className="text-xs text-text-tertiary truncate">{exp.company}</p>
                      </div>
                      {isSelected && <IconCheck size={14} className="text-primary flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Educations */}
            {educations.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-1.5">
                  <IconSchool size={10} /> Formations
                </p>
                {educations.map(edu => {
                  const isSelected = slot.itemId === edu.id && slot.itemType === 'education'
                  const orgName = edu.organisation?.name ?? 'Formation'
                  const logoUrl = edu.organisation?.logoUrl
                  return (
                    <button key={edu.id}
                      onClick={() => updateSlot({ itemId: edu.id, itemType: 'education' })}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-[9px] border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-light'
                          : 'border-border hover:border-primary/40 hover:bg-bg-light'
                      }`}>
                      {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoUrl} alt={orgName}
                          className="w-9 h-9 rounded-[8px] object-cover flex-shrink-0 border border-border" />
                      ) : (
                        <div className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                          style={{ background: orgColor(orgName) }}>
                          {orgInitials(orgName)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                          {edu.degree}{edu.field ? ` · ${edu.field}` : ''}
                        </p>
                        <p className="text-xs text-text-tertiary truncate">{orgName}</p>
                      </div>
                      {isSelected && <IconCheck size={14} className="text-primary flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            )}

            {experiences.length === 0 && educations.length === 0 && (
              <p className="text-sm text-text-tertiary text-center py-4">
                Ajoutez des expériences ou formations dans votre profil
              </p>
            )}

            {slot.itemId && (
              <button onClick={() => updateSlot({ itemId: null, itemType: null })}
                className="text-xs text-text-tertiary hover:text-red-500 transition-colors flex items-center gap-1">
                <IconX size={11} /> Effacer la sélection
              </button>
            )}
          </div>

          {/* Custom info lines */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-text-primary">Infos personnalisées</h2>
              <span className="text-[10px] text-text-tertiary">{slot.customLines.length}/4</span>
            </div>
            <p className="text-xs text-text-tertiary">LinkedIn, site web, email, téléphone…</p>

            {slot.customLines.map((line, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-bg-light border border-border text-sm">
                <span className="flex-1 text-text-secondary truncate">{line}</span>
                <button onClick={() => removeLine(i)} className="text-text-tertiary hover:text-red-500 transition-colors flex-shrink-0">
                  <IconX size={13} />
                </button>
              </div>
            ))}

            {slot.customLines.length < 4 && (
              <div className="flex gap-2">
                <input
                  className="input flex-1 text-sm"
                  placeholder="ex: linkedin.com/in/moctar"
                  value={newLine}
                  onChange={e => setNewLine(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addLine()}
                  maxLength={40}
                />
                <button onClick={addLine} disabled={!newLine.trim()} className="btn-primary px-3 disabled:opacity-40">
                  <IconPlus size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Color */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-text-primary">Couleur</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-tertiary">Personnalisée</span>
                <label className="relative cursor-pointer">
                  <input type="color" value={slot.customColor}
                    onChange={e => updateSlot({ customColor: e.target.value, paletteId: null })}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                  <div className="w-7 h-7 rounded-lg border-2 transition-all flex items-center justify-center"
                    style={{
                      background: slot.paletteId === null ? slot.customColor : '#F3F4F6',
                      borderColor: slot.paletteId === null ? slot.customColor : '#E5E7EB',
                    }}>
                    {slot.paletteId !== null && <IconPalette size={13} className="text-text-tertiary" />}
                  </div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {PALETTE.map(p => {
                const isSelected = slot.paletteId === p.id
                return (
                  <button key={p.id} onClick={() => updateSlot({ paletteId: p.id })} title={p.id}
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

          {/* Order */}
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
