import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Le mot de passe doit faire au moins 8 caractères' }, { status: 400 })
  }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('password')
    .eq('id', session.userId)
    .single()

  if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })

  const valid = await bcrypt.compare(currentPassword, user.password)
  if (!valid) return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 401 })

  const hash = await bcrypt.hash(newPassword, 12)
  await supabaseAdmin.from('users').update({ password: hash }).eq('id', session.userId)

  return NextResponse.json({ ok: true })
}
