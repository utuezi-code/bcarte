import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

// GET — liste des organisations auxquelles l'utilisateur appartient
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
    .from('team_members')
    .select('role, joinedAt, organisation:organisations(id, name, slug, type, sector, city, country, logoColor, verified)')
    .eq('profileId', profile.id)

  return NextResponse.json(data ?? [])
}

// POST — rejoindre une organisation
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { organisationId, role } = await req.json()
  if (!organisationId) return NextResponse.json({ error: 'Organisation requise' }, { status: 400 })

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('userId', session.userId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  // Vérifier si déjà membre
  const { data: existing } = await supabaseAdmin
    .from('team_members')
    .select('id')
    .eq('profileId', profile.id)
    .eq('organisationId', organisationId)
    .single()

  if (existing) return NextResponse.json({ error: 'Vous êtes déjà membre de cette organisation' }, { status: 409 })

  await supabaseAdmin.from('team_members').insert({
    id: crypto.randomUUID(),
    profileId: profile.id,
    organisationId,
    role: role ?? 'Membre',
    joinedAt: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}

// DELETE — quitter une organisation
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { organisationId } = await req.json()

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('userId', session.userId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  await supabaseAdmin
    .from('team_members')
    .delete()
    .eq('profileId', profile.id)
    .eq('organisationId', organisationId)

  return NextResponse.json({ ok: true })
}
