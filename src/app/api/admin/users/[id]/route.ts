import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

// PATCH — suspend or restore a user profile
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { suspended } = await req.json()
  if (typeof suspended !== 'boolean') {
    return NextResponse.json({ error: 'suspended (boolean) requis' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ suspended })
    .eq('id', params.id)
    .select('id, suspended')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
