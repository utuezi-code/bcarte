import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? '')

const PROTECTED = ['/admin', '/dashboard', '/recruiter', '/settings', '/institution', '/org']
const AUTH_PAGES = ['/login', '/register']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get('bcarte_session')?.value

  if (!token) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)

    // /admin requires a user with role ADMIN in their token
    // For now restrict to a hardcoded env var email list or check a flag
    if (pathname.startsWith('/admin')) {
      const adminIds = (process.env.ADMIN_USER_IDS ?? '').split(',').filter(Boolean)
      if (!adminIds.includes(String(payload.userId ?? ''))) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
      }
    }

    return NextResponse.next()
  } catch {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/recruiter/:path*',
    '/settings/:path*',
    '/institution/:path*',
    '/org/:path*',
  ],
}
