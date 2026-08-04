import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'non connecté' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, fullName, slug, skills, isPublic')
    .eq('userId', session.userId)
    .single()

  return NextResponse.json({ data, error: error?.message ?? null, userId: session.userId })
}
