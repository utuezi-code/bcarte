import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  /* core profile */
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, fullName, title, bio, city, country, phone, linkedin, avatarUrl, skills, slug')
    .eq('slug', params.slug)
    .single()

  if (profileError || !profile) {
    console.error('profile fetch error:', profileError?.message, 'slug:', params.slug)
    return NextResponse.json({ _error: profileError?.message ?? 'not found' }, { status: 404 })
  }

  /* experiences */
  const { data: experiences } = await supabaseAdmin
    .from('experiences')
    .select('*')
    .eq('profileId', profile.id)
    .order('startDate', { ascending: false })

  /* educations */
  const { data: educations } = await supabaseAdmin
    .from('educations')
    .select('*, organisation:organisations(name, slug)')
    .eq('profileId', profile.id)

  /* verifications */
  const { data: verifications } = await supabaseAdmin
    .from('verifications')
    .select('status, organisationId, organisation:organisations(name, slug)')
    .eq('profileId', profile.id)

  return NextResponse.json({
    ...profile,
    experiences:   experiences   ?? [],
    educations:    educations    ?? [],
    verifications: verifications ?? [],
  }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
