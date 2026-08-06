import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json(null, { status: 401 })

  if (session.role === 'PROFESSIONNEL') {
    const { data } = await supabaseAdmin
      .from('profiles')
      .select('fullName, title, city, slug')
      .eq('userId', session.userId)
      .single()

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('id', session.userId)
      .single()

    const email = user?.email ?? ''
    const fallbackName = email ? email.split('@')[0] : 'Utilisateur'

    return NextResponse.json({
      role: 'professionnel',
      name: data?.fullName || fallbackName,
      email,
      slug: data?.slug ?? null,
    })
  } else {
    const { data } = await supabaseAdmin
      .from('organisations')
      .select('name, slug')
      .eq('ownerId', session.userId)
      .single()

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('id', session.userId)
      .single()

    return NextResponse.json({
      role: 'organisation',
      name: data?.name ?? 'Organisation',
      email: user?.email ?? '',
    })
  }
}
