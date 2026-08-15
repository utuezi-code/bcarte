import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

/* Debug endpoint — shows slug + id for the logged-in user's profile */
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, slug, fullName')
    .eq('userId', session.userId)
    .single()

  return NextResponse.json({ data, error: error?.message ?? null, userId: session.userId })
}
