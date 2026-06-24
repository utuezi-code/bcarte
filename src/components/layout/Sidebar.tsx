'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconLayoutDashboard, IconUser, IconFileText,
  IconCompass, IconCreditCard, IconSettings, IconLogout,
  IconBriefcase, IconBuilding, IconCircleCheck, IconChevronDown,
} from '@tabler/icons-react'
import { CURRENT_USER } from '@/lib/mock-data'
import { useUser } from '@/lib/user-context'
import { useState } from 'react'

const PRO_NAV = [
  { href: '/dashboard',         label: 'Tableau de bord', icon: IconLayoutDashboard, exact: true },
  { href: '/dashboard/profile', label: 'Mon profil',       icon: IconUser },
  { href: '/dashboard/org',     label: 'Mon organisation', icon: IconBuilding },
  { href: '/dashboard/cv',      label: 'Générer CV',        icon: IconFileText },
  { href: '/explore',           label: 'Explorer',          icon: IconCompass },
  { href: '/dashboard/nfc',     label: 'Carte NFC',         icon: IconCreditCard },
  { href: '/settings',          label: 'Paramètres',        icon: IconSettings },
]

const ORG_NAV = [
  { href: '/org/dashboard',     label: 'Tableau de bord', icon: IconLayoutDashboard, exact: true },
  { href: '/explore',           label: 'Explorer',         icon: IconCompass },
  { href: '/recruiter',         label: 'Espace recruteur', icon: IconBriefcase },
  { href: '/settings',          label: 'Paramètres',       icon: IconSettings },
]

const PRO_USER = {
  name: CURRENT_USER.fullName,
  email: CURRENT_USER.email,
  initials: CURRENT_USER.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
  role: 'Professionnel',
  verified: CURRENT_USER.verified,
}

const ORG_USER = {
  name: 'Talent Africa Group',
  email: 'contact@talentagricagroup.com',
  initials: 'TA',
  role: 'Organisation',
  verified: true,
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { role, setRole } = useUser()
  const [showSwitch, setShowSwitch] = useState(false)

  const nav = role === 'organisation' ? ORG_NAV : PRO_NAV
  const user = role === 'organisation' ? ORG_USER : PRO_USER

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  function switchTo(newRole: typeof role) {
    setRole(newRole)
    setShowSwitch(false)
    router.push(newRole === 'organisation' ? '/org/dashboard' : '/dashboard')
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white border-r border-[#E5E7EB] fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#E5E7EB]">
        <Link href={role === 'organisation' ? '/org/dashboard' : '/dashboard'} className="text-2xl font-extrabold text-primary">
          bcarte
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Navigation principale">
        {nav.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary-light text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-light'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + switch */}
      <div className="px-3 py-4 border-t border-[#E5E7EB] space-y-1">

        {/* Account switcher */}
        <div className="relative">
          <button
            onClick={() => setShowSwitch(!showSwitch)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-btn hover:bg-bg-light transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${role === 'organisation' ? 'bg-[#0C0A18]' : 'bg-primary'}`}>
              {user.initials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
              <p className="text-xs text-text-tertiary">{user.role}</p>
            </div>
            <IconChevronDown size={14} className={`text-text-tertiary transition-transform flex-shrink-0 ${showSwitch ? 'rotate-180' : ''}`} />
          </button>

          {showSwitch && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden z-50">
              <p className="px-3 py-2 text-[10px] font-bold text-text-tertiary uppercase tracking-wider border-b border-[#F3F4F6]">
                Changer de compte
              </p>
              <button
                onClick={() => switchTo('professionnel')}
                className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-bg-light transition-colors text-left ${role === 'professionnel' ? 'bg-primary-light/50' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {PRO_USER.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{PRO_USER.name}</p>
                  <p className="text-xs text-text-tertiary">Professionnel</p>
                </div>
                {role === 'professionnel' && <IconCircleCheck size={15} className="text-primary flex-shrink-0" />}
              </button>
              <button
                onClick={() => switchTo('organisation')}
                className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-bg-light transition-colors text-left border-t border-[#F3F4F6] ${role === 'organisation' ? 'bg-primary-light/50' : ''}`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#0C0A18] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {ORG_USER.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{ORG_USER.name}</p>
                  <p className="text-xs text-text-tertiary">Organisation</p>
                </div>
                {role === 'organisation' && <IconCircleCheck size={15} className="text-primary flex-shrink-0" />}
              </button>
            </div>
          )}
        </div>

        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-btn text-sm text-text-secondary hover:text-danger hover:bg-red-50 transition-colors">
          <IconLogout size={16} />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
