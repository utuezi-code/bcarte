'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconUser, IconCompass, IconFileText, IconCreditCard,
  IconLayoutDashboard, IconBriefcase, IconBuilding,
} from '@tabler/icons-react'
import { useUser } from '@/lib/user-context'

const PRO_TABS = [
  { href: '/dashboard',         label: 'Accueil',  icon: IconLayoutDashboard, exact: true },
  { href: '/dashboard/profile', label: 'Profil',   icon: IconUser },
  { href: '/explore',           label: 'Explorer', icon: IconCompass },
  { href: '/dashboard/cv',      label: 'CV',       icon: IconFileText },
  { href: '/dashboard/nfc',     label: 'NFC',      icon: IconCreditCard },
]

const ORG_TABS = [
  { href: '/org/dashboard', label: 'Accueil',   icon: IconLayoutDashboard, exact: true },
  { href: '/explore',       label: 'Explorer',  icon: IconCompass },
  { href: '/recruiter',     label: 'Recruteur', icon: IconBriefcase },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { role, setRole } = useUser()

  const effectiveRole = pathname.startsWith('/org/') ? 'organisation' : role

  useEffect(() => {
    if (effectiveRole !== role) setRole(effectiveRole)
  }, [effectiveRole, role, setRole])

  const tabs = effectiveRole === 'organisation' ? ORG_TABS : PRO_TABS

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 safe-area-pb"
      style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #EEEEF5' }}
      aria-label="Navigation mobile">
      <div className="flex items-center h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href)
          return (
            <Link key={tab.href} href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 h-full relative transition-colors">
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2.5px] rounded-full bg-primary" />
              )}
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8}
                className={active ? 'text-primary' : 'text-text-tertiary'} />
              <span className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-text-tertiary'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
