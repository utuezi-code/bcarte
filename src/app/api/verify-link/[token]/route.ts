import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'bcarte-dev-secret-change-in-prod'
)

/* GET — validate token, return org info */
export async function GET(_: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { payload } = await jwtVerify(params.token, SECRET)
    const { orgId, orgName } = payload as { orgId: string; orgName: string }

    const { data: org } = await supabaseAdmin
      .from('organisations')
      .select('id, name, city, country, logoColor')
      .eq('id', orgId)
      .single()

    return NextResponse.json({ valid: true, org: org ?? { id: orgId, name: orgName } })
  } catch {
    return NextResponse.json({ valid: false, error: 'Lien invalide ou expiré' }, { status: 400 })
  }
}

/* POST — professional uses the link to get their experiences auto-confirmed */
export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Connexion requise' }, { status: 401 })

  let orgId: string
  try {
    const { payload } = await jwtVerify(params.token, SECRET)
    orgId = (payload as { orgId: string }).orgId
  } catch {
    return NextResponse.json({ error: 'Lien invalide ou expiré' }, { status: 400 })
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('userId', session.userId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  const { data: org } = await supabaseAdmin
    .from('organisations')
    .select('id, name')
    .eq('id', orgId)
    .single()

  if (!org) return NextResponse.json({ error: 'Organisation introuvable' }, { status: 404 })

  const now = new Date().toISOString()

  /* confirm only verifications explicitly requested by the professional for this org */
  const { data: pending } = await supabaseAdmin
    .from('verifications')
    .select('id')
    .eq('profileId', profile.id)
    .eq('organisationId', orgId)
    .eq('status', 'EN_ATTENTE')

  if (!pending || pending.length === 0) {
    return NextResponse.json({ ok: true, confirmed: 0, orgName: org.name })
  }

  await supabaseAdmin
    .from('verifications')
    .update({ status: 'CONFIRMEE', updatedAt: now })
    .in('id', pending.map((v: any) => v.id))

  return NextResponse.json({ ok: true, confirmed: pending.length, orgName: org.name })
}
