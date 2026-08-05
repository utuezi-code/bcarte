import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { status } = await req.json()
  if (!['CONFIRMEE', 'REJETEE'].includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  const { data: org } = await supabaseAdmin
    .from('organisations')
    .select('id')
    .eq('ownerId', session.userId)
    .single()

  if (!org) return NextResponse.json({ error: 'Organisation introuvable' }, { status: 403 })

  const { data, error } = await supabaseAdmin
    .from('verifications')
    .update({ status, updatedAt: new Date().toISOString() })
    .eq('id', params.id)
    .eq('organisationId', org.id)
    .select()
    .single()

  if (error) {
    console.error('org verifications PATCH error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
