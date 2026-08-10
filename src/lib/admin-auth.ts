import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-server'

const ADMIN_COOKIE  = 'bcarte_admin'
const SESSION_HOURS = 8

export interface AdminPayload {
  adminId: string
  email:   string
  name:    string
  role:    'ADMIN'
}

export async function createAdminSession(adminId: string, email: string, name: string) {
  const token  = randomBytes(48).toString('hex')
  const expiry = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000).toISOString()

  await supabaseAdmin
    .from('admins')
    .update({ sessionToken: token, sessionExpiry: expiry, lastLoginAt: new Date().toISOString() })
    .eq('id', adminId)

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   SESSION_HOURS * 60 * 60,
    path:     '/',
  })
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE)?.value
    if (!token) return null

    const { data } = await supabaseAdmin
      .from('admins')
      .select('id, email, name, sessionExpiry')
      .eq('sessionToken', token)
      .single()

    if (!data) return null
    if (!data.sessionExpiry || new Date(data.sessionExpiry) < new Date()) return null

    return { adminId: data.id, email: data.email, name: data.name, role: 'ADMIN' }
  } catch {
    return null
  }
}

export async function deleteAdminSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE)?.value
    if (token) {
      await supabaseAdmin
        .from('admins')
        .update({ sessionToken: null, sessionExpiry: null })
        .eq('sessionToken', token)
    }
    cookieStore.delete(ADMIN_COOKIE)
  } catch {
    // ignore
  }
}
