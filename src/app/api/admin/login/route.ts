import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { createAdminSession } from '@/lib/admin-auth'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
  }

  const { data: admin } = await supabaseAdmin
    .from('admins')
    .select('id, email, name, passwordHash')
    .eq('email', email.toLowerCase().trim())
    .single()

  // Constant-time comparison even when admin not found (prevent timing attacks)
  const hash = admin?.passwordHash ?? '$2b$12$invalidhashfortimingprotection000000000000000000000000'
  const valid = await bcrypt.compare(password, hash)

  if (!admin || !valid) {
    return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
  }

  await createAdminSession({ adminId: admin.id, email: admin.email, name: admin.name, role: 'ADMIN' })

  // Update lastLoginAt
  await supabaseAdmin
    .from('admins')
    .update({ lastLoginAt: new Date().toISOString() })
    .eq('id', admin.id)

  return NextResponse.json({ ok: true, name: admin.name })
}
