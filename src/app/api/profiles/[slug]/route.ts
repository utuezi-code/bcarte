import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  /* core profile — only public fields, never userId/email */
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, slug, fullName, title, bio, city, country, avatarUrl, skills, phone, linkedin, emailPro, isPublic, createdAt')
    .eq('slug', params.slug)
    .or('isPublic.eq.true,isPublic.is.null')
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
    .select('id, refId, status, organisationId, type, organisation:organisations(name, slug, verified)')
    .eq('profileId', profile.id)
    .eq('status', 'CONFIRMEE')

  return NextResponse.json({
    ...profile,
    experiences:   experiences   ?? [],
    educations:    educations    ?? [],
    verifications: verifications ?? [],
  }, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' },
  })
}
