import { NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getOrgAccess } from '@/lib/org-auth'

export const dynamic = 'force-dynamic'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'bcarte-dev-secret-change-in-prod'
)

/* GET — generate or return a magic link token for this org */
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const access = await getOrgAccess(session.userId)
  if (!access) return NextResponse.json({ error: 'Organisation introuvable' }, { status: 403 })

  const { data: org } = await supabaseAdmin
    .from('organisations')
    .select('id, name, slug')
    .eq('id', access.orgId)
    .single()

  if (!org) return NextResponse.json({ error: 'Organisation introuvable' }, { status: 404 })

  const token = await new SignJWT({ orgId: org.id, orgName: org.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('365d')
    .sign(SECRET)

  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://bcarte.vercel.app'}/verify/${token}`

  return NextResponse.json({ token, url, orgName: org.name })
}
