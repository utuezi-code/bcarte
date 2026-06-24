'use client'

import { useEffect, useState } from 'react'
import { IconBuilding, IconLoader2, IconArrowUpRight } from '@tabler/icons-react'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

export default function DashboardOrgPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => { setLoading(false) }, [])

  return (
    <div className="min-h-screen bg-bg-light">
      <Sidebar />
      <main className="lg:pl-60 pb-16 lg:pb-0 min-h-screen">
        <div className="max-w-3xl mx-auto px-5 py-6 lg:px-8 lg:py-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Mon organisation</h1>
            <p className="text-sm text-text-secondary mt-1">Vos liens avec vos employeurs et établissements</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <IconLoader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="card text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto">
                <IconBuilding size={32} className="text-text-tertiary" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">Aucune organisation liée</p>
                <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
                  Vos expériences et formations vérifiées apparaîtront ici une fois qu&apos;une organisation vous aura rattaché à son équipe.
                </p>
              </div>
              <Link href="/explore" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5">
                Explorer les organisations <IconArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
