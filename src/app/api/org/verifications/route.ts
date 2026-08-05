import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getOrgAccess } from '@/lib/org-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const access = await getOrgAccess(session.userId)
  if (!access) return NextResponse.json([])

  const { data: verifs, error } = await supabaseAdmin
    .from('verifications')
    .select('id, type, label, refId, status, createdAt, updatedAt, profileId')
    .eq('organisationId', access.orgId)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('org verifications GET error:', error.message)
    return NextResponse.json([])
  }
  if (!verifs || verifs.length === 0) return NextResponse.json([])

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
