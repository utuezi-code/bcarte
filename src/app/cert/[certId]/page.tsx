'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { IconShieldCheck, IconLoader2, IconDownload, IconShare, IconCheck } from '@tabler/icons-react'

function fmtDate(d: string | null | undefined) {
  if (!d) return null
  try { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }
  catch { return d }
}

function fmtMonth(d: string | null | undefined) {
  if (!d) return null
  try { return new Date(d).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) }
  catch { return d }
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

export default function CertPage() {
  const { certId } = useParams<{ certId: string }>()
  const [cert, setCert] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/cert/${certId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setCert(d); setLoading(false) })
  }, [certId])

  const handlePrint = () => window.print()

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) navigator.share({ title: 'Certificat bcarte', url })
    else { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500) }
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <IconLoader2 size={24} className="animate-spin text-[#6C47FF]" />
    </div>
  )

  if (!cert) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <IconShieldCheck size={28} className="text-red-300" />
      </div>
      <p className="font-bold text-gray-900">Certificat introuvable</p>
      <p className="text-sm text-gray-400">Ce certificat n&apos;existe pas ou a été révoqué.</p>
      <Link href="/" className="text-sm text-[#6C47FF] font-semibold mt-2">← bcarte.io</Link>
    </div>
  )

  const org = cert.organisation
  const pro = cert.profile
  const item = cert.item

  let credential = cert.label
  let dateRange = ''
  if (item && cert.type === 'EXPÉRIENCE') {
    credential = `${item.title} — ${item.company}`
    const from = fmtMonth(item.startDate)
    const to = item.isCurrent ? 'en cours' : fmtMonth(item.endDate)
    if (from) dateRange = `${from}${to ? ` → ${to}` : ''}`
  } else if (item && cert.type === 'FORMATION') {
    credential = `${item.degree}${item.field ? ` · ${item.field}` : ''}`
    const school = item.organisation?.name || ''
    const years = `${item.startYear ?? ''}${item.endYear ? ` – ${item.endYear}` : item.isCurrent ? ' – présent' : ''}`
    if (years) dateRange = `${school}${years ? ` · ${years}` : ''}`
  }

  const issuedDate = fmtDate(cert.certIssuedAt)

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .cert-container { box-shadow: none !important; border: 1px solid #E5E7EB !important; }
        }
      `}</style>

      {/* Top bar — hidden on print */}
      <div className="no-print bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#6C47FF] flex items-center justify-center">
            <span className="text-white font-black text-[11px]">b</span>
          </div>
          <span className="font-black text-gray-900">bcarte</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={handleShare}
            className="flex items-center gap-2 h-9 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 transition-colors">
            {copied ? <><IconCheck size={14} className="text-green-500" /> Copié</> : <><IconShare size={14} /> Partager</>}
          </button>
          <button onClick={handlePrint}
            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#6C47FF] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            <IconDownload size={14} /> Télécharger PDF
          </button>
        </div>
      </div>

      {/* Certificate */}
      <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4 no-print-bg">
        <div className="cert-container w-full max-w-[680px] bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 8px 48px rgba(108,71,255,0.12), 0 2px 8px rgba(0,0,0,0.06)' }}>

          {/* Header band */}
          <div style={{ background: 'linear-gradient(135deg, #0F0B2E 0%, #1E1560 50%, #6C47FF 100%)', padding: '40px 48px 36px' }}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <span className="text-white font-black text-sm">b</span>
                </div>
                <span className="text-white font-black text-lg tracking-tight">bcarte</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                <IconShieldCheck size={14} className="text-[#A78BFA]" />
                <span className="text-[#A78BFA] text-xs font-bold uppercase tracking-widest">Certifié</span>
              </div>
            </div>
            <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
              {cert.type === 'EXPÉRIENCE' ? 'Certificat d\'Expérience Professionnelle' : 'Certificat de Formation'}
            </p>
            <h1 style={{ color: 'white', fontSize: 28, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.5px' }}>
              {credential}
            </h1>
            {dateRange && (
              <p className="text-white/55 text-sm mt-2 font-medium">{dateRange}</p>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: '36px 48px' }}>

            {/* Professional + Org */}
            <div className="flex items-center gap-6 mb-8">
              {/* Professional */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 bg-[#F0EDFF]">
                  {pro?.avatarUrl
                    ? <img src={pro.avatarUrl} alt={pro?.fullName} className="w-full h-full object-cover object-top" />
                    : <span className="text-[#6C47FF] font-black text-base">{initials(pro?.fullName ?? '')}</span>}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Professionnel</p>
                  <p className="font-bold text-gray-900 text-base">{pro?.fullName}</p>
                  {pro?.title && <p className="text-sm text-gray-500 mt-0.5">{pro.title}</p>}
                </div>
              </div>

              <div className="text-gray-200 font-light text-2xl select-none">·</div>

              {/* Organization */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: org?.logoColor ?? '#6C47FF' }}>
                  {org?.logoUrl
                    ? <img src={org.logoUrl} alt={org?.name} className="w-full h-full object-contain p-2" />
                    : <span className="text-white font-black text-base">{initials(org?.name ?? '')}</span>}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Organisation</p>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-gray-900 text-base">{org?.name}</p>
                    {org?.verified && <IconShieldCheck size={14} className="text-[#6C47FF]" />}
                  </div>
                  {(org?.city || org?.country) && (
                    <p className="text-sm text-gray-500 mt-0.5">{[org.city, org.country].filter(Boolean).join(', ')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-6" />

            {/* Footer: certId + date + verify notice */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Numéro de certificat</p>
                <p className="font-mono text-sm font-bold text-gray-800">{cert.certId}</p>
                {issuedDate && (
                  <p className="text-xs text-gray-400 mt-1">Émis le {issuedDate}</p>
                )}
              </div>

              {/* Seal */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0F0B2E 0%, #6C47FF 100%)', boxShadow: '0 2px 12px rgba(108,71,255,0.3)' }}>
                  <IconShieldCheck size={28} className="text-white" />
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Vérifié bcarte</p>
              </div>
            </div>

            {/* Verify URL notice */}
            <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
              <p className="text-[11px] text-gray-400">
                Vérifiez l&apos;authenticité de ce certificat sur{' '}
                <span className="font-mono text-[#6C47FF] font-semibold">
                  bcarte.io/cert/{cert.certId}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
