import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { data: profile } = await supabaseAdmin
    .from('profiles').select('id').eq('userId', session.userId).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { degree, field, organisationId, startYear, endYear, isCurrent } = await req.json()
  if (!degree || !organisationId) return NextResponse.json({ error: 'degree and organisationId required' }, { status: 400 })

  const { data, error } = await supabaseAdmin.from('educations').insert({
    id:             crypto.randomUUID(),
    profileId:      profile.id,
    organisationId,
    degree,
    field:    field    || null,
    startYear: startYear ?? null,
    endYear:   endYear && !isCurrent ? endYear : null,
    isCurrent: !!isCurrent,
    status:    'EN_ATTENTE',
  }).select('*, organisation:organisations(name, slug)').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
