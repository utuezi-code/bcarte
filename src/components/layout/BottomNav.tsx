'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconUser, IconCompass, IconFileText, IconCreditCard, IconDotsCircleHorizontal } from '@tabler/icons-react'

const TABS = [
  { href: '/dashboard/profile', label: 'Profil', icon: IconUser },
  { href: '/explore', label: 'Explorer', icon: IconCompass },
  { href: '/dashboard/cv', label: 'CV', icon: IconFileText },
  { href: '/dashboard/nfc', label: 'NFC', icon: IconCreditCard },
  { href: '/dashboard', label: 'Compte', icon: IconDotsCircleHorizontal },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E5E7EB] flex items-center safe-area-pb"
      aria-label="Navigation mobile"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon
        const active = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href))
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 min-h-[56px] justify-center transition-colors ${
              active ? 'text-primary' : 'text-text-tertiary'
            }`}
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
