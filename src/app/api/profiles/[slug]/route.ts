import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select(`
      id, fullName, title, bio, city, country, phone, linkedin, avatarUrl,
      skills,
      experiences(*),
      educations(*, organisation:organisations(name, slug)),
      verifications:verifications(status, organisationId, organisation:organisations(name, slug))
    `)
    .eq('slug', params.slug)
    .single()

  if (!profile) return NextResponse.json(null, { status: 404 })

  return NextResponse.json(profile)
}
