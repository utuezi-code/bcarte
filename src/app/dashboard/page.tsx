'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconUser, IconFileText, IconCreditCard, IconEye, IconCircleCheck, IconClock, IconArrowRight, IconShieldCheck, IconBriefcase } from '@tabler/icons-react'

export default function DashboardPage() {
  const [name, setName] = useState('')

  useEffect(() => {
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.name) setName(d.name.split(' ')[0])
    })
  }, [])

  return (
    <div className="space-y-7">

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-black text-text-primary tracking-tight">
          Bonjour{name ? `, ${name}` : ''} 👋
        </h1>
        <p className="text-[14px] text-text-secondary mt-1">Votre espace professionnel bcarte</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Vues ce mois',  value: '—', icon: IconEye,         color: '#6C47FF', bg: '#F0EDFF' },
          { label: 'Vérifications', value: '—', icon: IconCircleCheck, color: '#059669', bg: '#ECFDF5' },
          { label: 'CV générés',    value: '—', icon: IconFileText,    color: '#D97706', bg: '#FFFBEB' },
          { label: 'En attente',    value: '—', icon: IconClock,       color: '#6B7280', bg: '#F3F4F6' },
        ].map(s => (
          <div key={s.label} className="card flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg }}>
              <s.icon size={17} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-text-secondary">{s.label}</p>
              <p className="text-[22px] font-black text-text-primary mt-0.5 leading-none">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions rapides */}
      <div>
        <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mb-3">Actions rapides</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/dashboard/profile', icon: IconUser,       label: 'Mon profil',    desc: 'Gérez vos expériences et formations',  color: '#6C47FF', bg: '#F0EDFF' },
            { href: '/dashboard/cv',      icon: IconFileText,   label: 'Générer un CV', desc: 'Créez un CV depuis votre profil',        color: '#D97706', bg: '#FFFBEB' },
            { href: '/dashboard/nfc',     icon: IconCreditCard, label: 'Carte NFC',     desc: 'Votre carte de visite digitale',         color: '#059669', bg: '#ECFDF5' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="card hover:shadow-card-hover transition-all group flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: a.bg }}>
                <a.icon size={19} style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text-primary">{a.label}</p>
                <p className="text-[12px] text-text-secondary mt-0.5 truncate">{a.desc}</p>
              </div>
              <IconArrowRight size={15} className="text-text-tertiary group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* CTA completer profil */}
      <div className="rounded-card-lg p-5 flex items-center gap-5"
        style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #9B7BFF 100%)' }}>
        <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <IconShieldCheck size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white text-[15px]">Complétez votre profil</p>
          <p className="text-[13px] text-white/70 mt-0.5">
            Un profil complet augmente vos chances d&apos;être vérifié et trouvé par les recruteurs.
          </p>
        </div>
        <Link href="/dashboard/profile"
          className="flex-shrink-0 bg-white text-[#6C47FF] text-[13px] font-bold px-4 py-2.5 rounded-[10px] hover:bg-white/90 transition-colors whitespace-nowrap">
          Compléter →
        </Link>
      </div>

    </div>
  )
}
