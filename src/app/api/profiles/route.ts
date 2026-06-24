import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const country = searchParams.get('country') ?? ''

  let query = supabaseAdmin
    .from('profiles')
    .select('id, fullName, title, city, country, avatarUrl, isPublic')
    .eq('isPublic', true)

  if (search) {
    query = query.or(`fullName.ilike.%${search}%,title.ilike.%${search}%`)
  }
  if (country) {
    query = query.eq('country', country)
  }

  const { data } = await query.limit(50)
  return NextResponse.json(data ?? [])
}
