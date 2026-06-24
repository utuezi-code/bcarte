'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconUser, IconFileText, IconCreditCard, IconEye, IconCircleCheck, IconClock, IconChevronRight } from '@tabler/icons-react'

export default function DashboardPage() {
  const [name, setName] = useState('')

  useEffect(() => {
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.name) setName(d.name.split(' ')[0])
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-[28px] font-bold text-text-primary">
          Bonjour{name ? `, ${name}` : ''} 👋
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Bienvenue sur votre espace professionnel bcarte
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Vues ce mois',   value: '—', icon: IconEye,         color: 'text-primary'       },
          { label: 'Vérifications',  value: '—', icon: IconCircleCheck, color: 'text-success'       },
          { label: 'CV générés',     value: '—', icon: IconFileText,    color: 'text-[#D97706]'     },
          { label: 'En attente',     value: '—', icon: IconClock,       color: 'text-text-tertiary' },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-text-secondary">{s.label}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{s.value}</p>
              </div>
              <s.icon size={20} className={s.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/profile', icon: IconUser,       label: 'Compléter mon profil', desc: 'Ajoutez vos expériences et formations' },
          { href: '/dashboard/cv',      icon: IconFileText,   label: 'Générer un CV',         desc: 'Créez un CV optimisé par IA'           },
          { href: '/dashboard/nfc',     icon: IconCreditCard, label: 'Ma carte NFC',          desc: 'Commandez votre carte de visite'       },
        ].map(a => (
          <Link key={a.href} href={a.href} className="card hover:border-primary/30 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                <a.icon size={20} className="text-primary" />
              </div>
              <IconChevronRight size={16} className="text-text-tertiary group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-semibold text-text-primary">{a.label}</p>
            <p className="text-xs text-text-secondary mt-0.5">{a.desc}</p>
          </Link>
        ))}
      </div>

      <div className="card border-primary/20 bg-primary-light/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <IconUser size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-text-primary">Complétez votre profil</p>
            <p className="text-sm text-text-secondary mt-1">
              Un profil complet augmente vos chances d&apos;être trouvé et vérifié.
            </p>
            <Link href="/dashboard/profile" className="btn-primary mt-3 inline-flex text-sm py-2 px-4">
              Compléter maintenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
