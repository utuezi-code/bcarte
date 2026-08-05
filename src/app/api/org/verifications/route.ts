import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const { data: org } = await supabaseAdmin
    .from('organisations')
    .select('id')
    .eq('ownerId', session.userId)
    .single()

  if (!org) return NextResponse.json([])

  const { data, error } = await supabaseAdmin
    .from('verifications')
    .select(`
      id, type, label, refId, status, createdAt,
      profile:profiles (
        id, fullName, title, city, country, avatarUrl, slug, phone, linkedin, emailPro,
        experiences (*),
        educations (*, organisation:organisations(name))
      )
    `)
    .eq('organisationId', org.id)
    .order('createdAt', { ascending: false })

  if (error) console.error('org verifications GET error:', error.message)
  return NextResponse.json(data ?? [])
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { id, status } = await req.json()

  await supabaseAdmin
    .from('verifications')
    .update({ status, updatedAt: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ ok: true })
}
