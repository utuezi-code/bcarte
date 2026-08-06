import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase-server'
import { createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password, role, fullName, name, slug } = await req.json()

  if (!email || !password || !role) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  // Check existing user
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 12)
  const id = crypto.randomUUID()
  const dbRole = role === 'organisation' ? 'ORGANISATION' : 'PROFESSIONNEL'

  const { error: userErr } = await supabaseAdmin.from('users').insert({
    id,
    email,
    password: hash,
    role: dbRole,
    updatedAt: new Date().toISOString(),
  })

  if (userErr) {
    return NextResponse.json({ error: userErr.message }, { status: 500 })
  }

  if (dbRole === 'PROFESSIONNEL') {
    await supabaseAdmin.from('profiles').insert({
      id: crypto.randomUUID(),
      userId: id,
      fullName: fullName ?? email.split('@')[0],
    })
  } else {
    await supabaseAdmin.from('organisations').insert({
      id: crypto.randomUUID(),
      ownerId: id,
      slug: slug ?? name?.toLowerCase().replace(/\s+/g, '-') ?? id,
      name: name ?? email.split('@')[0],
      updatedAt: new Date().toISOString(),
    })
  }

  await createSession({ userId: id, role: dbRole })

  return NextResponse.json({ ok: true, role: dbRole })
}
