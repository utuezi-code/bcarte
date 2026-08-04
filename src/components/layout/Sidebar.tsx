'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  IconLayoutDashboard, IconUser, IconFileText,
  IconCompass, IconCreditCard, IconSettings, IconLogout,
  IconBriefcase, IconBuilding, IconChevronRight,
} from '@tabler/icons-react'
import { useUser } from '@/lib/user-context'

const PRO_NAV = [
  { href: '/dashboard',         label: 'Accueil',       icon: IconLayoutDashboard, exact: true },
  { href: '/dashboard/profile', label: 'Mon profil',    icon: IconUser },
  { href: '/dashboard/org',     label: 'Organisation',  icon: IconBuilding },
  { href: '/dashboard/cv',      label: 'Générer CV',    icon: IconFileText },
  { href: '/dashboard/nfc',     label: 'Carte NFC',     icon: IconCreditCard },
  { href: '/explore',           label: 'Explorer',      icon: IconCompass },
]

const ORG_NAV = [
  { href: '/org/dashboard',  label: 'Tableau de bord', icon: IconLayoutDashboard, exact: true },
  { href: '/explore',        label: 'Explorer',         icon: IconCompass },
  { href: '/recruiter',      label: 'Recruteur',        icon: IconBriefcase },
]

interface MeData { name: string; email: string }

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
}

const AVATAR_COLORS = ['#6C47FF', '#059669', '#2563EB', '#D97706', '#DC2626']
function avatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
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

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const homeHref = effectiveRole === 'organisation' ? '/org/dashboard' : '/dashboard'

  return (
    <aside className="hidden lg:flex flex-col w-[220px] min-h-screen fixed left-0 top-0 bottom-0 z-30 bg-white"
      style={{ borderRight: '1px solid #EEEEF5' }}>

      {/* ── Logo ─────────────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4">
        <Link href={homeHref} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #9B6DFF 100%)' }}>
            <span className="text-white text-[13px] font-black tracking-tighter">b</span>
          </div>
          <span className="text-[17px] font-black text-text-primary tracking-tight">bcarte</span>
        </Link>
      </div>

      {/* ── User mini-card ───────────────────────────────────────────────────── */}
      <div className="mx-3 mb-3 rounded-[12px] p-3 bg-[#F7F6FF] border border-[#EEEEF5]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: me ? avatarColor(displayName) : '#6C47FF' }}>
            {me ? initials(displayName) : '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-semibold text-text-primary truncate leading-none">{displayName}</p>
            <p className="text-[10.5px] text-text-tertiary truncate mt-0.5">{displayEmail}</p>
          </div>
        </div>
        <Link href="/dashboard/profile"
          className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-primary hover:underline">
          Voir mon profil
          <IconChevronRight size={11} />
        </Link>
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-2 overflow-y-auto space-y-0.5">
        {nav.map((item) => {
          const Icon   = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[9px] text-[13px] font-medium transition-colors relative ${
                active
                  ? 'bg-[#F0EDFF] text-primary font-semibold'
                  : 'text-text-secondary hover:bg-[#F7F6FF] hover:text-text-primary'
              }`}>
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary" />
              )}
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom ───────────────────────────────────────────────────────────── */}
      <div className="px-2 pb-4 pt-3 space-y-0.5" style={{ borderTop: '1px solid #EEEEF5' }}>
        <Link href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[9px] text-[13px] font-medium transition-colors ${
            isActive('/settings')
              ? 'bg-[#F0EDFF] text-primary font-semibold'
              : 'text-text-secondary hover:bg-[#F7F6FF] hover:text-text-primary'
          }`}>
          <IconSettings size={16} strokeWidth={1.8} />
          Paramètres
        </Link>

        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[9px] text-[13px] font-medium transition-colors text-text-secondary hover:bg-red-50 hover:text-red-600">
          <IconLogout size={16} strokeWidth={1.8} />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
