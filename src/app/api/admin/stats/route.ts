import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const [
    { count: totalProfiles },
    { count: totalOrgs },
    { count: totalVerifications },
    { count: pendingVerifications },
    { count: confirmedVerifications },
    { count: invitations },
  ] = await Promise.all([
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('organisations').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('verifications').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('verifications').select('*', { count: 'exact', head: true }).eq('status', 'EN_ATTENTE'),
    supabaseAdmin.from('verifications').select('*', { count: 'exact', head: true }).eq('status', 'CONFIRMEE'),
    supabaseAdmin.from('invitations').select('*', { count: 'exact', head: true }),
  ])

  // Last 30 days activity
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const [
    { count: newProfiles30d },
    { count: newVerifs30d },
    { count: newOrgs30d },
  ] = await Promise.all([
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).gte('createdAt', since),
    supabaseAdmin.from('verifications').select('*', { count: 'exact', head: true }).gte('createdAt', since),
    supabaseAdmin.from('organisations').select('*', { count: 'exact', head: true }).gte('createdAt', since),
  ])

  return NextResponse.json({
    totalProfiles:        totalProfiles ?? 0,
    totalOrgs:            totalOrgs ?? 0,
    totalVerifications:   totalVerifications ?? 0,
    pendingVerifications: pendingVerifications ?? 0,
    confirmedVerifications: confirmedVerifications ?? 0,
    invitations:          invitations ?? 0,
    last30d: {
      newProfiles:  newProfiles30d ?? 0,
      newVerifs:    newVerifs30d ?? 0,
      newOrgs:      newOrgs30d ?? 0,
    },
  })
}
