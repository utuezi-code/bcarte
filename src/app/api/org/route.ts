import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { data } = await supabaseAdmin
    .from('organisations')
    .select('*')
    .eq('ownerId', session.userId)
    .single()

  return NextResponse.json(data ?? null)
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const body = await req.json()
  const { name, description, sector, city, country, website } = body

  await supabaseAdmin
    .from('organisations')
    .update({ name, description, sector, city, country, website, updatedAt: new Date().toISOString() })
    .eq('ownerId', session.userId)

  return NextResponse.json({ ok: true })
}
