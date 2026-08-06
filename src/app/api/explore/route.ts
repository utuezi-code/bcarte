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

  /* ── ORGANISATIONS: visible to everyone ─────────────────────────────── */
  if (type === 'orgs') {
    let query = supabaseAdmin
      .from('organisations')
      .select('*')

    if (search)  query = query.ilike('name', `%${search}%`)
    if (country) query = query.eq('country', country)

    const { data, error } = await query.order('name').limit(100)
    if (error) console.error('explore orgs error:', error.message)
    return NextResponse.json(data ?? [])
  }

  /* ── PROFILES for organisation users: all visible professionals ───────── */
  if (session.role === 'ORGANISATION') {
    let query = supabaseAdmin
      .from('profiles')
      .select('id, fullName, title, city, country, avatarUrl, skills, slug, isPublic')
      .eq('isPublic', true)

    if (search)  query = query.or(`fullName.ilike.%${search}%,title.ilike.%${search}%`)
    if (country) query = query.eq('country', country)

    const { data, error } = await query.limit(100)
    if (error) console.error('explore profiles (org) error:', error.message)
    return NextResponse.json(data ?? [])
  }

  /* ── PROFILES for professional users: colleagues in shared orgs ───────── */
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

  const { data, error } = await query.limit(50)
  if (error) console.error('explore profiles (pro) error:', error.message)
  return NextResponse.json(data ?? [])
}
