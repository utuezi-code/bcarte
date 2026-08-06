import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  const { data: profile } = await supabaseAdmin
    .from('profiles').select('id').eq('userId', session.userId).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { title, company, city, startDate, endDate, isCurrent } = await req.json()
  if (!title || !company) return NextResponse.json({ error: 'title and company required' }, { status: 400 })

  const { data, error } = await supabaseAdmin.from('experiences').insert({
    id:        crypto.randomUUID(),
    profileId: profile.id,
    title,
    company,
    city:      city || null,
    startDate: startDate ? new Date(startDate + '-01').toISOString() : null,
    endDate:   endDate && !isCurrent ? new Date(endDate + '-01').toISOString() : null,
    isCurrent: !!isCurrent,
    status:    'EN_ATTENTE',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
