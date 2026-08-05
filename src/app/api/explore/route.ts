import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const { searchParams } = new URL(req.url)
  const search  = searchParams.get('search')  ?? ''
  const country = searchParams.get('country') ?? ''
  const type    = searchParams.get('type')    ?? 'profiles'

  /* ── Organisation users: see all visible professionals ───────────────── */
  if (session.role === 'ORGANISATION') {
    if (type === 'orgs') return NextResponse.json([])

    let query = supabaseAdmin
      .from('profiles')
      .select('id, fullName, title, city, country, avatarUrl, skills, slug, isPublic')
      .eq('isPublic', true)
      .or('visibleToOrgs.is.null,visibleToOrgs.eq.true')

    if (search)  query = query.or(`fullName.ilike.%${search}%,title.ilike.%${search}%`)
    if (country) query = query.eq('country', country)

    const { data } = await query.limit(100)
    return NextResponse.json(data ?? [])
  }

  /* ── Professional users: see colleagues in shared organisations ───────── */
  const { data: myProfile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('userId', session.userId)
    .single()

  if (!myProfile) return NextResponse.json([])

  const { data: myMemberships } = await supabaseAdmin
    .from('team_members')
    .select('organisationId')
    .eq('profileId', myProfile.id)

  const myOrgIds = (myMemberships ?? []).map((m: any) => m.organisationId)

  if (myOrgIds.length === 0) return NextResponse.json([])

  if (type === 'orgs') {
    let query = supabaseAdmin
      .from('organisations')
      .select('id, name, slug, type, sector, city, country, logoColor, verified')
      .in('id', myOrgIds)

    if (search)  query = query.ilike('name', `%${search}%`)
    if (country) query = query.eq('country', country)

    const { data } = await query.limit(50)
    return NextResponse.json(data ?? [])
  }

  const { data: orgMembers } = await supabaseAdmin
    .from('team_members')
    .select('profileId')
    .in('organisationId', myOrgIds)
    .neq('profileId', myProfile.id)

  const peerIds = Array.from(new Set((orgMembers ?? []).map((m: any) => m.profileId)))
  if (peerIds.length === 0) return NextResponse.json([])

  let query = supabaseAdmin
    .from('profiles')
    .select('id, fullName, title, city, country, avatarUrl, skills, slug, isPublic')
    .in('id', peerIds)
    .eq('isPublic', true)

  if (search)  query = query.or(`fullName.ilike.%${search}%,title.ilike.%${search}%`)
  if (country) query = query.eq('country', country)

  const { data } = await query.limit(50)
  return NextResponse.json(data ?? [])
}
