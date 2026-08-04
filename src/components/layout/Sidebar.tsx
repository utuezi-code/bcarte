'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconLayoutDashboard, IconUser, IconFileText,
  IconCompass, IconCreditCard, IconSettings, IconLogout,
  IconBriefcase, IconBuilding, IconShieldCheck,
} from '@tabler/icons-react'
import { useUser } from '@/lib/user-context'

const PRO_NAV = [
  { href: '/dashboard',         label: 'Accueil',          icon: IconLayoutDashboard, exact: true },
  { href: '/dashboard/profile', label: 'Mon profil',        icon: IconUser },
  { href: '/dashboard/org',     label: 'Organisation',      icon: IconBuilding },
  { href: '/dashboard/cv',      label: 'Générer CV',         icon: IconFileText },
  { href: '/dashboard/nfc',     label: 'Carte NFC',          icon: IconCreditCard },
  { href: '/explore',           label: 'Explorer',           icon: IconCompass },
]

const ORG_NAV = [
  { href: '/org/dashboard',     label: 'Tableau de bord',  icon: IconLayoutDashboard, exact: true },
  { href: '/explore',           label: 'Explorer',          icon: IconCompass },
  { href: '/recruiter',         label: 'Recruteur',         icon: IconBriefcase },
]

const BOTTOM_NAV = [
  { href: '/settings', label: 'Paramètres', icon: IconSettings },
]

interface MeData { name: string; email: string }

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { role, setRole } = useUser()
  const [me, setMe] = useState<MeData | null>(null)

  const effectiveRole = pathname.startsWith('/org/') ? 'organisation' : role

  useEffect(() => {
    if (effectiveRole !== role) setRole(effectiveRole)
  }, [effectiveRole, role, setRole])

  useEffect(() => {
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(d => { if (d) setMe(d) })
  }, [])

  const nav = effectiveRole === 'organisation' ? ORG_NAV : PRO_NAV
  const displayName    = me?.name ?? '…'
  const displayEmail   = me?.email ?? ''
  const displayInitials = me ? initials(me.name) : '?'

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-[220px] min-h-screen fixed left-0 top-0 bottom-0 z-30"
      style={{ background: '#0F0E1A', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Link href={effectiveRole === 'organisation' ? '/org/dashboard' : '/dashboard'}
          className="flex items-center gap-2.5">
          <span className="text-[20px] font-black text-white tracking-tight">bcarte</span>
        </Link>
      </div>

      {/* Nav principale */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const Icon   = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-medium transition-colors relative group"
              style={{
                color:      active ? '#fff' : 'rgba(255,255,255,0.5)',
                background: active ? 'rgba(108,71,255,0.2)' : 'transparent',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#6C47FF]" />
              )}
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bas */}
      <div className="px-3 pb-4 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
        {BOTTOM_NAV.map(item => {
          const Icon   = item.icon
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-medium transition-colors"
              style={{
                color:      active ? '#fff' : 'rgba(255,255,255,0.45)',
                background: active ? 'rgba(108,71,255,0.2)' : 'transparent',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}

        {/* User + logout */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1 rounded-[8px]"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="w-7 h-7 rounded-full bg-[#6C47FF] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            {displayInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate leading-none">{displayName}</p>
            <p className="text-[10px] truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{displayEmail}</p>
          </div>
          <button onClick={handleLogout} title="Se déconnecter"
            className="flex-shrink-0 transition-colors"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#FF6B6B'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'}
          >
            <IconLogout size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
