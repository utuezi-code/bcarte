import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

/* GET — list the current user's own verification requests */
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('userId', session.userId)
    .single()

  if (!profile) return NextResponse.json([])

  const { data } = await supabaseAdmin
    .from('verifications')
    .select('*, certId, certIssuedAt, organisation:organisations(id, name, logoColor)')
    .eq('profileId', profile.id)
    .order('createdAt', { ascending: false })

  return NextResponse.json(data ?? [])
}

/* POST — create a verification request */
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { organisationId, type, label, refId } = await req.json()
  if (!organisationId || !type || !label) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('userId', session.userId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  /* auto-confirm if already a team member of this org */
  const { data: membership } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('profileId', profile.id)
    .eq('organisationId', organisationId)
    .maybeSingle()

  const autoStatus = membership ? 'CONFIRMEE' : 'EN_ATTENTE'

  /* prevent duplicate for the same item (any non-rejected status) */
  if (refId) {
    const { data: existing } = await supabaseAdmin
      .from('verifications')
      .select('id, status')
      .eq('profileId', profile.id)
      .eq('organisationId', organisationId)
      .eq('refId', refId)
      .neq('status', 'REJETEE')
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Une demande est déjà en cours pour cet élément' }, { status: 409 })
    }
  }

  const { data, error } = await supabaseAdmin
    .from('verifications')
    .insert({
      id: crypto.randomUUID(),
      profileId: profile.id,
      organisationId,
      type,
      label,
      refId: refId ?? null,
      status: autoStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('verification insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
