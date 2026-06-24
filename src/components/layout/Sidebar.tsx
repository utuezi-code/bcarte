'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconLayoutDashboard, IconUser, IconFileText,
  IconCompass, IconCreditCard, IconSettings, IconLogout,
  IconBriefcase, IconBuilding,
} from '@tabler/icons-react'
import { CURRENT_USER } from '@/lib/mock-data'
import { useUser } from '@/lib/user-context'

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
  avatarBg: 'bg-primary',
}

const ORG_USER = {
  name: 'Talent Africa Group',
  email: 'contact@talentagricagroup.com',
  initials: 'TA',
  avatarBg: 'bg-[#0C0A18]',
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { role, setRole } = useUser()

  const effectiveRole = pathname.startsWith('/org/') ? 'organisation' : role

  useEffect(() => {
    if (effectiveRole !== role) setRole(effectiveRole)
  }, [effectiveRole, role, setRole])

  const nav = effectiveRole === 'organisation' ? ORG_NAV : PRO_NAV
  const user = effectiveRole === 'organisation' ? ORG_USER : PRO_USER

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
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

      {/* Current user */}
      <div className="px-3 py-4 border-t border-[#E5E7EB] space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className={`w-8 h-8 rounded-full ${user.avatarBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
            <p className="text-xs text-text-tertiary truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-btn text-sm text-text-secondary hover:text-danger hover:bg-red-50 transition-colors"
        >
          <IconLogout size={16} />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
