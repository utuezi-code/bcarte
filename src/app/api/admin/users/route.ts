import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const page   = parseInt(searchParams.get('page') ?? '1')
  const limit  = 25
  const offset = (page - 1) * limit

  let query = supabaseAdmin
    .from('profiles')
    .select('id, slug, fullName, title, city, country, avatarUrl, suspended, createdAt, user:users(email)', { count: 'exact' })
    .order('createdAt', { ascending: false })
    .range(offset, offset + limit - 1)

  if (search) {
    query = query.or(`fullName.ilike.%${search}%,title.ilike.%${search}%,city.ilike.%${search}%`)
  }

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ users: data ?? [], total: count ?? 0, page, limit })
}
