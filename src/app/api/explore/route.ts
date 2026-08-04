import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

/**
 * GET /api/explore?search=&country=&type=profiles|orgs
 *
 * Profiles : members of the same organisations as the current user.
 * Orgs     : organisations the current user has joined.
 */
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const { searchParams } = new URL(req.url)
  const search  = searchParams.get('search')  ?? ''
  const country = searchParams.get('country') ?? ''
  const type    = searchParams.get('type')    ?? 'profiles'

  /* ── Get current user's profile ──────────────────────────────────────── */
  const { data: myProfile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('userId', session.userId)
    .single()

  if (!myProfile) return NextResponse.json([])

  /* ── Get organisations the user belongs to ───────────────────────────── */
  const { data: myMemberships } = await supabaseAdmin
    .from('team_members')
    .select('organisationId')
    .eq('profileId', myProfile.id)

  const myOrgIds = (myMemberships ?? []).map((m: any) => m.organisationId)

  if (myOrgIds.length === 0) return NextResponse.json([])

  /* ── ORGS: return the organisations the user has joined ──────────────── */
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

  /* ── PROFILES: members of my organisations (excluding self) ──────────── */
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
