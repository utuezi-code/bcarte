import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

async function getOrgId(userId: string) {
  const { data } = await supabaseAdmin
    .from('organisations')
    .select('id')
    .eq('ownerId', userId)
    .single()
  return data?.id ?? null
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const orgId = await getOrgId(session.userId)
  if (!orgId) return NextResponse.json([])

  const { data } = await supabaseAdmin
    .from('job_offers')
    .select('*')
    .eq('organisationId', orgId)
    .order('createdAt', { ascending: false })

  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const orgId = await getOrgId(session.userId)
  if (!orgId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const { title, location, type, description, salary } = await req.json()

  const { data } = await supabaseAdmin.from('job_offers').insert({
    id: crypto.randomUUID(),
    organisationId: orgId,
    title,
    location,
    type: type ?? 'CDI',
    description,
    salary,
    isActive: true,
  }).select().single()

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { id } = await req.json()
  await supabaseAdmin.from('job_offers').delete().eq('id', id)

  return NextResponse.json({ ok: true })
}
