import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json([], { status: 401 })

  const { data: org } = await supabaseAdmin
    .from('organisations')
    .select('id')
    .eq('ownerId', session.userId)
    .single()

  if (!org) return NextResponse.json([])

  const { data } = await supabaseAdmin
    .from('team_members')
    .select('*, profile:profiles(fullName, title, city, avatarUrl)')
    .eq('organisationId', org.id)

  return NextResponse.json(data ?? [])
}
