import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getOrgAccess } from '@/lib/org-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const access = await getOrgAccess(session.userId)
  if (!access) return NextResponse.json(null, { status: 404 })

  const { data } = await supabaseAdmin
    .from('organisations')
    .select('*')
    .eq('id', access.orgId)
    .single()

  return NextResponse.json(data ?? null)
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const access = await getOrgAccess(session.userId)
  if (!access) return NextResponse.json({ error: 'Organisation introuvable' }, { status: 404 })

  const body = await req.json()
  const { name, description, type, sector, city, country, website } = body

  const { error } = await supabaseAdmin
    .from('organisations')
    .update({ name, description, type, sector, city, country, website, updatedAt: new Date().toISOString() })
    .eq('id', access.orgId)

  if (error) {
    console.error('org update error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
