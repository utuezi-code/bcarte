'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconLayoutDashboard, IconUser, IconFileText,
  IconCompass, IconCreditCard, IconSettings, IconLogout, IconBriefcase, IconBuilding,
} from '@tabler/icons-react'
import { CURRENT_USER } from '@/lib/mock-data'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', icon: IconLayoutDashboard, exact: true },
  { href: '/dashboard/profile', label: 'Mon profil', icon: IconUser },
  { href: '/dashboard/cv', label: 'Générer CV', icon: IconFileText },
  { href: '/explore', label: 'Explorer', icon: IconCompass },
  { href: '/recruiter', label: 'Espace recruteur', icon: IconBriefcase },
  { href: '/org/dashboard', label: 'Mon organisation', icon: IconBuilding },
  { href: '/dashboard/nfc', label: 'Carte NFC', icon: IconCreditCard },
  { href: '/settings', label: 'Paramètres', icon: IconSettings },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white border-r border-[#E5E7EB] fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#E5E7EB]">
        <Link href="/dashboard" className="text-2xl font-extrabold text-primary">
          bcarte
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Navigation principale">
        {NAV_ITEMS.map((item) => {
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

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {getInitials(CURRENT_USER.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{CURRENT_USER.fullName}</p>
            <p className="text-xs text-text-tertiary truncate">{CURRENT_USER.email}</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-btn text-sm text-text-secondary hover:text-danger hover:bg-red-50 transition-colors">
          <IconLogout size={16} />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
