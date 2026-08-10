import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter') // 'pending' | 'verified' | all
  const search = searchParams.get('search') ?? ''

  let query = supabaseAdmin
    .from('organisations')
    .select('id, name, slug, type, sector, city, country, verified, createdAt, owner:users(email)', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .limit(50)

  if (filter === 'pending')  query = query.eq('verified', false)
  if (filter === 'verified') query = query.eq('verified', true)
  if (search) query = query.ilike('name', `%${search}%`)

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ organisations: data ?? [], total: count ?? 0 })
}
