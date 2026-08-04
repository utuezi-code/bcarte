'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  IconUser, IconFileText, IconCreditCard, IconCompass,
  IconBuilding, IconArrowUpRight, IconCircleCheck, IconClock, IconEye,
  IconCopy, IconCheck, IconShare,
} from '@tabler/icons-react'

export default function DashboardPage() {
  const [name,   setName]   = useState('')
  const [slug,   setSlug]   = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.name) setName(d.name.split(' ')[0])
      if (d?.slug) setSlug(d.slug)
    })
  }, [])

  const profileUrl = slug ? `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${slug}` : ''

  const handleCopy = () => {
    if (!profileUrl) return
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleShare = () => {
    if (navigator.share && profileUrl) {
      navigator.share({ title: name || 'Mon profil bcarte', url: profileUrl })
    } else {
      handleCopy()
    }
  }

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <p className="text-xs font-medium text-text-tertiary capitalize mb-1">{today}</p>
        <h1 className="text-2xl font-bold text-text-primary">
          Bonjour{name ? `, ${name}` : ''}
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">Votre espace professionnel bcarte</p>
      </div>

      {/* Share public profile */}
      {slug && (
        <div className="card flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#F0EDFF' }}>
            <IconShare size={15} style={{ color: '#6C47FF' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text-primary">Mon profil public</p>
            <p className="text-[11px] text-text-tertiary font-mono truncate mt-0.5">/p/{slug}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={handleCopy}
              className="btn-secondary h-8 px-3 text-xs gap-1.5">
              {copied
                ? <><IconCheck size={12} className="text-success" /> Copié !</>
                : <><IconCopy size={12} /> Copier</>}
            </button>
            <button onClick={handleShare}
              className="btn-primary h-8 px-3 text-xs gap-1.5">
              Partager
            </button>
          </div>
        </div>
      )}

      {/* Complétion du profil */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-sm text-text-primary">Complétez votre profil</p>
            <p className="text-xs text-text-secondary mt-0.5">Un profil complet augmente votre visibilité</p>
          </div>
          <span className="text-xl font-black text-primary">40%</span>
        </div>
        <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: '40%' }} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4">
          {[
            { label: 'Titre',         done: true  },
            { label: 'Expériences',   done: true  },
            { label: 'Photo',         done: false },
            { label: 'Bio',           done: false },
            { label: 'Compétences',   done: false },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.done ? 'bg-success' : 'bg-border'}`} />
              <span className={`text-xs ${item.done ? 'text-text-secondary' : 'text-text-tertiary'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Vues ce mois',   value: '—', icon: IconEye,          color: '#6C47FF', bg: '#F0EDFF' },
          { label: 'Vérifications',  value: '—', icon: IconCircleCheck,  color: '#059669', bg: '#ECFDF5' },
          { label: 'En attente',     value: '—', icon: IconClock,        color: '#D97706', bg: '#FFFBEB' },
        ].map(s => (
          <div key={s.label} className="card flex flex-col items-center py-4 gap-2 text-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
              <s.icon size={15} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-black text-text-primary leading-none">{s.value}</p>
              <p className="text-[11px] text-text-secondary mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Accès rapide */}
      <div>
        <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-3">Accès rapide</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/dashboard/profile', icon: IconUser,       label: 'Mon profil',    desc: 'Expériences & compétences',  color: '#6C47FF', bg: '#F0EDFF' },
            { href: '/dashboard/cv',      icon: IconFileText,   label: 'Générer un CV', desc: 'CV optimisé depuis votre profil', color: '#D97706', bg: '#FFFBEB' },
            { href: '/dashboard/nfc',     icon: IconCreditCard, label: 'Carte NFC',     desc: 'Votre carte de visite digitale',  color: '#059669', bg: '#ECFDF5' },
            { href: '/explore',           icon: IconCompass,    label: 'Explorer',      desc: 'Profils & organisations',     color: '#6B7280', bg: '#F3F4F6' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="card hover:shadow-card-hover transition-all group flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.bg }}>
                <a.icon size={16} style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{a.label}</p>
                <p className="text-xs text-text-tertiary mt-0.5 truncate">{a.desc}</p>
              </div>
              <IconArrowUpRight size={13} className="text-text-tertiary group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Organisation */}
      <div className="card flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-border-subtle flex items-center justify-center flex-shrink-0">
          <IconBuilding size={18} className="text-text-tertiary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">Liez-vous à une organisation</p>
          <p className="text-xs text-text-secondary mt-0.5">Rejoignez votre entreprise ou établissement</p>
        </div>
        <Link href="/dashboard/org"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors flex-shrink-0 whitespace-nowrap">
          Rejoindre <IconArrowUpRight size={12} />
        </Link>
      </div>

    </div>
  )
}
