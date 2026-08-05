import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const { data: org } = await supabaseAdmin
    .from('organisations')
    .select('id')
    .eq('ownerId', session.userId)
    .single()

  if (!org) return NextResponse.json([])

  const { data: verifs, error } = await supabaseAdmin
    .from('verifications')
    .select('id, type, label, refId, status, createdAt, profileId')
    .eq('organisationId', org.id)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('org verifications GET error:', error.message)
    return NextResponse.json([])
  }
  if (!verifs || verifs.length === 0) return NextResponse.json([])

  /* fetch full profile data for each unique profileId */
  const profileIds = Array.from(new Set(verifs.map((v: any) => v.profileId)))

  const [{ data: profiles }, { data: experiences }, { data: educations }] = await Promise.all([
    supabaseAdmin
      .from('profiles')
      .select('id, fullName, title, city, country, avatarUrl, slug, phone, linkedin, emailPro')
      .in('id', profileIds),
    supabaseAdmin
      .from('experiences')
      .select('*')
      .in('profileId', profileIds),
    supabaseAdmin
      .from('educations')
      .select('*, organisation:organisations(name)')
      .in('profileId', profileIds),
  ])

  const profileMap = Object.fromEntries(
    (profiles ?? []).map((p: any) => [p.id, {
      ...p,
      experiences: (experiences ?? []).filter((e: any) => e.profileId === p.id),
      educations:  (educations  ?? []).filter((e: any) => e.profileId === p.id),
    }])
  )

  const result = verifs.map((v: any) => ({ ...v, profile: profileMap[v.profileId] ?? null }))
  return NextResponse.json(result)
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { id, status } = await req.json()

  await supabaseAdmin
    .from('verifications')
    .update({ status, updatedAt: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ ok: true })
}
