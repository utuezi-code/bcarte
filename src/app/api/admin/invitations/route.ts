import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data, count } = await supabaseAdmin
    .from('invitations')
    .select('*', { count: 'exact' })
    .order('sentAt', { ascending: false })
    .limit(100)

  const usedCount = (data ?? []).filter((i: any) => i.usedAt).length

  return NextResponse.json({ invitations: data ?? [], total: count ?? 0, usedCount })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { email } = await req.json()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  const { count: total } = await supabaseAdmin
    .from('invitations')
    .select('*', { count: 'exact', head: true })

  if ((total ?? 0) >= 100) {
    return NextResponse.json({ error: 'Limite de 100 invitations atteinte' }, { status: 429 })
  }

  const { data, error } = await supabaseAdmin
    .from('invitations')
    .insert({ id: crypto.randomUUID(), email: email.toLowerCase().trim() })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Invitation déjà envoyée à cet email' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
