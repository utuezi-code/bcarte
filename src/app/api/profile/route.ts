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
  const { fullName, title, city, country, bio, phone, linkedin, slug, skills } = body

  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('userId', session.userId)
    .single()

  /* check slug uniqueness (ignore own profile) */
  if (slug) {
    const { data: taken } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('slug', slug)
      .neq('userId', session.userId)
      .maybeSingle()
    if (taken) return NextResponse.json({ error: 'Ce slug est déjà utilisé' }, { status: 409 })
  }

  const coreFields = { fullName, title, city, country, bio, phone, linkedin, slug: slug || null }

  if (!existing) {
    const { error } = await supabaseAdmin.from('profiles').insert({
      id: crypto.randomUUID(), userId: session.userId, ...coreFields,
    })
    if (error) {
      console.error('profile insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  } else {
    const { error } = await supabaseAdmin.from('profiles').update(coreFields).eq('userId', session.userId)
    if (error) {
      console.error('profile update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  /* skills is a separate column — update independently so a missing column doesn't block the whole save */
  if (skills !== undefined) {
    await supabaseAdmin.from('profiles').update({ skills }).eq('userId', session.userId)
  }

  return NextResponse.json({ ok: true })
}
