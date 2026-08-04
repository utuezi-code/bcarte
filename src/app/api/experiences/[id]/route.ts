import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { data: profile } = await supabaseAdmin
    .from('profiles').select('id').eq('userId', session.userId).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  await supabaseAdmin
    .from('experiences')
    .delete()
    .eq('id', params.id)
    .eq('profileId', profile.id)

  return NextResponse.json({ ok: true })
}
