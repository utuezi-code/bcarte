import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// PATCH — verify or unverify an organisation
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { verified } = await req.json()
  if (typeof verified !== 'boolean') {
    return NextResponse.json({ error: 'verified (boolean) requis' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('organisations')
    .update({ verified, updatedAt: new Date().toISOString() })
    .eq('id', params.id)
    .select('id, name, verified')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
