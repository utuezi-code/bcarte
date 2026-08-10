import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'bcarte_admin'

function getAdminSecret() {
  const s = process.env.ADMIN_JWT_SECRET ?? process.env.JWT_SECRET
  if (!s) throw new Error('ADMIN_JWT_SECRET or JWT_SECRET environment variable is required')
  return new TextEncoder().encode(`admin:${s}`)
}

export interface AdminPayload {
  adminId: string
  email: string
  name: string
  role: 'ADMIN'
  [key: string]: unknown
}

export async function createAdminSession(payload: AdminPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(getAdminSecret())

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, getAdminSecret())
    if (payload.role !== 'ADMIN') return null
    return payload as unknown as AdminPayload
  } catch {
    return null
  }
}

export async function deleteAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}
