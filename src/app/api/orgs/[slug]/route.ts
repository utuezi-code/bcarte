import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const { data: org } = await supabaseAdmin
    .from('organisations')
    .select('id, name, slug, description, type, sector, city, country, website, logoColor, logoUrl, verified, createdAt')
    .eq('slug', params.slug)
    .single()

  if (!org) return NextResponse.json(null, { status: 404 })

  const [{ data: members }, { data: offers }] = await Promise.all([
    supabaseAdmin
      .from('team_members')
      .select('id, role, profile:profiles(fullName, title, avatarUrl, slug)')
      .eq('organisationId', org.id),
    supabaseAdmin
      .from('offers')
      .select('id, title, location, type, description, createdAt')
      .eq('organisationId', org.id)
      .eq('isActive', true)
      .order('createdAt', { ascending: false }),
  ])

  return NextResponse.json({ ...org, members: members ?? [], offers: offers ?? [] })
}
