import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

// One-time endpoint: creates the first admin account.
// Blocked if any admin already exists.
// Requires ADMIN_SETUP_KEY env var to prevent unauthorized use.
export async function POST(req: NextRequest) {
  const setupKey = process.env.ADMIN_SETUP_KEY
  if (!setupKey) {
    return NextResponse.json({ error: 'ADMIN_SETUP_KEY not configured' }, { status: 403 })
  }

  const { key, email, password, name } = await req.json()

  if (key !== setupKey) {
    return NextResponse.json({ error: 'Clé invalide' }, { status: 403 })
  }
  if (!email || !password || !name) {
    return NextResponse.json({ error: 'email, password et name requis' }, { status: 400 })
  }
  if (password.length < 12) {
    return NextResponse.json({ error: 'Mot de passe trop court (12 caractères minimum)' }, { status: 400 })
  }

  // Block if admin already exists
  const { data: existing } = await supabaseAdmin
    .from('admins')
    .select('id')
    .limit(1)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Un administrateur existe déjà' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const { data, error } = await supabaseAdmin
    .from('admins')
    .insert({ id: crypto.randomUUID(), email, passwordHash, name })
    .select('id, email, name')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, admin: data })
}
