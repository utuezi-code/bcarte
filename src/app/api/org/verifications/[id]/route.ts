import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getOrgAccess } from '@/lib/org-auth'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { status } = await req.json()
  if (!['CONFIRMEE', 'REJETEE'].includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  const access = await getOrgAccess(session.userId)
  if (!access) return NextResponse.json({ error: 'Organisation introuvable' }, { status: 403 })

  const { data, error } = await supabaseAdmin
    .from('verifications')
    .update({ status, updatedAt: new Date().toISOString() })
    .eq('id', params.id)
    .eq('organisationId', access.orgId)
    .select()
    .single()

  if (error) {
    console.error('org verifications PATCH error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
