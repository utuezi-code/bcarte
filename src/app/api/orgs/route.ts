import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search  = searchParams.get('search')  ?? ''
  const country = searchParams.get('country') ?? ''

  let query = supabaseAdmin
    .from('organisations')
    .select('id, name, slug, type, sector, city, country, logoColor, verified')

  if (search)  query = query.ilike('name', `%${search}%`)
  if (country) query = query.eq('country', country)

  const { data } = await query.limit(50)
  return NextResponse.json(data ?? [])
}
