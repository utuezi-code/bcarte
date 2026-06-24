import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('userId', session.userId)
    .single()

  const { data: experiences } = await supabaseAdmin
    .from('experiences')
    .select('*')
    .eq('profileId', profile?.id ?? '')
    .order('startDate', { ascending: false })

  const { data: educations } = await supabaseAdmin
    .from('educations')
    .select('*, organisation:organisations(name, slug)')
    .eq('profileId', profile?.id ?? '')

  return NextResponse.json({
    ...profile,
    experiences: experiences ?? [],
    educations: educations ?? [],
  })
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const body = await req.json()
  const { fullName, title, city, country, bio, phone, linkedin } = body

  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('userId', session.userId)
    .single()

  if (!existing) {
    await supabaseAdmin.from('profiles').insert({
      id: crypto.randomUUID(),
      userId: session.userId,
      fullName,
      title,
      city,
      country,
      bio,
      phone,
      linkedin,
    })
  } else {
    await supabaseAdmin
      .from('profiles')
      .update({ fullName, title, city, country, bio, phone, linkedin })
      .eq('userId', session.userId)
  }

  return NextResponse.json({ ok: true })
}
