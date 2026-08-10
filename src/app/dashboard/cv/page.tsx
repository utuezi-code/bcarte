'use client'

import { useEffect, useRef, useState } from 'react'
import {
  IconFileText, IconDownload, IconCopy, IconCheck,
  IconChevronRight, IconChevronLeft, IconLoader2,
  IconBriefcase, IconSchool, IconCode, IconMapPin,
  IconSparkles,
} from '@tabler/icons-react'

const STEPS = ["Offre d'emploi", 'Options', 'Résultat']

function initials(name: string) {
  return name?.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

export default function CVPage() {
  const [step,        setStep]        = useState(0)
  const [jobOffer,    setJobOffer]    = useState('')
  const [lang,        setLang]        = useState('fr')
  const [copied,      setCopied]      = useState(false)
  const [profile,     setProfile]     = useState<any>(null)
  const [generating,  setGenerating]  = useState(false)
  const [generatedCV, setGeneratedCV] = useState('')
  const [genError,    setGenError]    = useState('')
  const printRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    fetch('/api/profile').then(r => r.ok ? r.json() : null).then(d => { if (d) setProfile(d) })
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCV)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownloadPDF = () => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CV — ${profile?.fullName ?? ''}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; line-height: 1.65; color: #1a1a2e; padding: 40px 48px; max-width: 720px; margin: 0 auto; }
    pre { white-space: pre-wrap; font-family: inherit; font-size: 13px; line-height: 1.65; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body><pre>${generatedCV.replace(/</g, '&lt;')}</pre>
<script>window.onload=()=>{window.print();}<\/script>
</body></html>`)
    w.document.close()
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setGenError('')
    try {
      const res = await fetch('/api/cv/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerText: jobOffer, lang }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGenError(data.error ?? 'Erreur lors de la génération')
        return
      }
      setGeneratedCV(data.cv ?? '')
      setStep(2)
    } catch {
      setGenError('Erreur réseau, réessayez')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="page-title">Générer mon CV</h1>
        <p className="page-subtitle">CV adapté à chaque offre grâce à l&apos;IA</p>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

        {/* ── LEFT — profile snapshot (sticky) ───────────────────────────── */}
        <div className="lg:sticky lg:top-8 space-y-4">
          <div className="rounded-[14px] overflow-hidden shadow-card">

            {/* Gradient hero */}
            <div style={{ background: 'linear-gradient(145deg, #1A0E4E 0%, #3B1FA0 55%, #6C47FF 100%)' }}
              className="px-6 pt-6 pb-5 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black border border-white/20"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                {profile ? initials(profile.fullName) : '?'}
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight">
                  {profile?.fullName || 'Votre nom'}
                </p>
                <p className="text-white/70 text-sm mt-0.5">
                  {profile?.title || 'Titre non renseigné'}
                </p>
                <p className="text-white/45 text-xs mt-1 flex items-center justify-center gap-1">
                  <IconMapPin size={10} />
                  {[profile?.city, profile?.country].filter(Boolean).join(', ') || '—'}
                </p>
              </div>
            </div>

            {/* Data included */}
            <div className="bg-white divide-y divide-border">
              <div className="px-4 py-2.5">
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                  Données incluses
                </p>
              </div>
              {[
                { Icon: IconBriefcase, color: '#6C47FF', bg: '#F0EDFF', label: 'Expériences', value: profile?.experiences?.length ?? 0 },
                { Icon: IconSchool,    color: '#059669', bg: '#ECFDF5', label: 'Formations',  value: profile?.educations?.length ?? 0 },
                { Icon: IconCode,      color: '#D97706', bg: '#FFFBEB', label: 'Compétences', value: profile?.skills?.length ?? 0 },
              ].map(({ Icon, color, bg, label, value }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: bg }}>
                    <Icon size={13} style={{ color }} />
                  </div>
                  <p className="text-sm text-text-secondary flex-1">{label}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    value > 0 ? 'bg-primary-light text-primary' : 'bg-border-subtle text-text-tertiary'
                  }`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT — stepper + content ──────────────────────────────────── */}
        <div className="min-w-0 space-y-4">

          {/* Stepper */}
          <div className="card p-4">
            <div className="flex items-center">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      i < step  ? 'bg-primary text-white shadow-sm'
                      : i === step ? 'bg-primary text-white ring-4 ring-primary/15'
                      : 'bg-border-subtle text-text-tertiary'
                    }`}>
                      {i < step ? <IconCheck size={13} /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-semibold whitespace-nowrap ${
                      i === step ? 'text-primary' : i < step ? 'text-text-secondary' : 'text-text-tertiary'
                    }`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-3 mb-4 transition-colors ${i < step ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Étape 0 — Offre d'emploi ─────────────────────────────────── */}
          {step === 0 && (
            <div className="card space-y-4">
              <div>
                <p className="font-semibold text-text-primary">Offre d&apos;emploi</p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  Collez l&apos;offre pour que l&apos;IA adapte votre CV — ou ignorez cette étape
                </p>
              </div>
              <textarea
                className="input resize-none text-sm leading-relaxed"
                rows={8}
                placeholder="Collez le texte de l'offre d'emploi ici…"
                value={jobOffer}
                onChange={e => setJobOffer(e.target.value)}
              />
              <div className="flex items-center gap-3">
                {jobOffer && (
                  <button onClick={() => setJobOffer('')} className="btn-secondary gap-1.5 text-sm">
                    Vider
                  </button>
                )}
                <button onClick={() => setStep(1)} className="btn-primary flex-1 justify-center">
                  {jobOffer ? 'Continuer avec cette offre' : 'Passer cette étape'}
                  <IconChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── Étape 1 — Options ────────────────────────────────────────── */}
          {step === 1 && (
            <div className="card space-y-5">
              <div>
                <p className="font-semibold text-text-primary">Options du CV</p>
                <p className="text-xs text-text-tertiary mt-0.5">Choisissez la langue de génération</p>
              </div>

              <div>
                <label className="label">Langue du CV</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {[
                    { value: 'fr', label: 'Français', flag: '🇫🇷' },
                    { value: 'en', label: 'Anglais',  flag: '🇬🇧' },
                  ].map(l => (
                    <button key={l.value} onClick={() => setLang(l.value)}
                      className={`flex items-center gap-3 p-4 rounded-[10px] border-2 transition-all text-sm font-semibold ${
                        lang === l.value
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-border text-text-secondary hover:border-primary/40 hover:bg-bg-light'
                      }`}>
                      <span className="text-lg">{l.flag}</span>
                      {l.label}
                      {lang === l.value && <IconCheck size={14} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              {genError && (
                <p className="text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {genError}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep(0)} className="btn-secondary gap-2">
                  <IconChevronLeft size={15} /> Retour
                </button>
                <button onClick={handleGenerate} disabled={generating || !profile}
                  className="btn-primary flex-1 justify-center gap-2">
                  {generating
                    ? <><IconLoader2 size={15} className="animate-spin" /> Génération par l&apos;IA…</>
                    : <><IconSparkles size={15} /> Générer avec l&apos;IA</>}
                </button>
              </div>
            </div>
          )}

          {/* ── Étape 2 — Résultat ───────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-3">
              {/* Actions bar */}
              <div className="card flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-text-primary text-sm">Votre CV est prêt</p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {lang === 'fr' ? 'Français' : 'Anglais'} · Généré et adapté par l&apos;IA
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={handleCopy} className="btn-secondary gap-1.5 px-3 py-2 text-sm">
                    {copied ? <IconCheck size={14} className="text-success" /> : <IconCopy size={14} />}
                    {copied ? 'Copié !' : 'Copier'}
                  </button>
                  <button onClick={handleDownloadPDF} className="btn-primary gap-1.5 px-3 py-2 text-sm">
                    <IconDownload size={14} /> PDF
                  </button>
                </div>
              </div>

              {/* CV preview */}
              <div className="card p-0 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border bg-bg-light flex items-center gap-2">
                  <IconFileText size={13} className="text-text-tertiary" />
                  <span className="text-xs font-medium text-text-tertiary">Aperçu</span>
                </div>
                <pre ref={printRef}
                  className="p-6 text-xs text-text-secondary font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {generatedCV}
                </pre>
              </div>

              {/* Regenerate / reset */}
              <div className="flex items-center gap-4">
                <button onClick={() => { setStep(1); setGenError('') }}
                  className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                  <IconSparkles size={13} /> Regénérer
                </button>
                <button onClick={() => { setStep(0); setJobOffer(''); setGeneratedCV('') }}
                  className="text-sm text-text-tertiary font-medium hover:underline">
                  ← Recommencer avec une autre offre
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
