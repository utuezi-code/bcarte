import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

/* Debug endpoint — tests both userId and slug queries */
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: byUserId, error: e1 } = await supabaseAdmin
    .from('profiles')
    .select('id, slug, fullName')
    .eq('userId', session.userId)
    .single()

  const slug = byUserId?.slug ?? ''
  const { data: bySlug, error: e2 } = slug
    ? await supabaseAdmin.from('profiles').select('id, slug, fullName').eq('slug', slug).single()
    : { data: null, error: { message: 'no slug' } }

  /* test the full select used by the public route */
  const { data: fullSelect, error: e3 } = slug
    ? await supabaseAdmin
        .from('profiles')
        .select('id, slug, fullName, title, bio, city, country, avatarUrl, skills, phone, linkedin, emailPro, createdAt')
        .eq('slug', slug)
        .single()
    : { data: null, error: { message: 'no slug' } }

  return NextResponse.json({
    byUserId: { data: byUserId, error: e1?.message ?? null },
    bySlug:   { data: bySlug,   error: e2?.message ?? null },
    fullSelect: { data: fullSelect ? 'ok' : null, error: e3?.message ?? null },
  })
}
