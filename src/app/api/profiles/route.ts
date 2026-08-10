import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const country = searchParams.get('country') ?? ''

  let query = supabaseAdmin
    .from('profiles')
    .select('id, fullName, title, city, country, avatarUrl, isPublic, skills, slug')
    .eq('isPublic', true)

  if (search) {
    query = query.or(`fullName.ilike.%${search}%,title.ilike.%${search}%`)
  }
  if (country) {
    query = query.eq('country', country)
  }

  const { data } = await query.limit(50)
  const profiles = data ?? []

  /* attach verifiedCount per profile */
  const profileIds = profiles.map((p: any) => p.id)
  let verifCounts: Record<string, number> = {}
  if (profileIds.length > 0) {
    const { data: verifRows } = await supabaseAdmin
      .from('verifications')
      .select('profileId')
      .in('profileId', profileIds)
      .eq('status', 'CONFIRMEE')
    for (const row of verifRows ?? []) {
      verifCounts[row.profileId] = (verifCounts[row.profileId] ?? 0) + 1
    }
  }

  return NextResponse.json(profiles.map((p: any) => ({ ...p, verifiedCount: verifCounts[p.id] ?? 0 })))
}
