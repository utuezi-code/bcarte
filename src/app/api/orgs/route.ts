import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search  = searchParams.get('search')  ?? ''
  const country = searchParams.get('country') ?? ''

  let query = supabaseAdmin
    .from('organisations')
    .select('*')

  if (search)  query = query.ilike('name', `%${search}%`)
  if (country) query = query.eq('country', country)

  const { data, error } = await query.limit(50)
  if (error) console.error('orgs search error:', error.message)
  return NextResponse.json(data ?? [])
}
