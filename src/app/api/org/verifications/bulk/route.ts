import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getOrgAccess } from '@/lib/org-auth'
import { generateCertId } from '@/lib/cert-id'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { ids, status } = await req.json()
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids requis' }, { status: 400 })
  }
  if (!['CONFIRMEE', 'REJETEE'].includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  const access = await getOrgAccess(session.userId)
  if (!access) return NextResponse.json({ error: 'Organisation introuvable' }, { status: 403 })

  if (status === 'CONFIRMEE') {
    const now = new Date().toISOString()
    // Update each one individually to assign unique certIds
    const updates = ids.map((id: string) =>
      supabaseAdmin.from('verifications')
        .update({ status, updatedAt: now, certId: generateCertId(), certIssuedAt: now })
        .eq('id', id)
        .eq('organisationId', access.orgId)
    )
    const results = await Promise.all(updates)
    const failed = results.find(r => r.error)
    if (failed?.error) {
      console.error('bulk cert error:', failed.error.message)
      return NextResponse.json({ error: failed.error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, count: ids.length })
  }

  // Pour REJETEE, garder le comportement actuel (update en masse, pas de certId)
  const { error } = await supabaseAdmin
    .from('verifications')
    .update({ status, updatedAt: new Date().toISOString() })
    .in('id', ids)
    .eq('organisationId', access.orgId)

  if (error) {
    console.error('bulk verifications error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, count: ids.length })
}
