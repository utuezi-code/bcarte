import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const USER_SECRET  = () => new TextEncoder().encode(process.env.JWT_SECRET ?? '')
const ADMIN_SECRET = () => new TextEncoder().encode(`admin:${process.env.ADMIN_JWT_SECRET ?? process.env.JWT_SECRET ?? ''}`)

const USER_PROTECTED  = ['/dashboard', '/recruiter', '/settings', '/institution', '/org']
const ADMIN_PROTECTED = ['/admin']
const ADMIN_PUBLIC    = ['/admin/login']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Admin routes ────────────────────────────────────────────────────────
  if (ADMIN_PROTECTED.some(p => pathname.startsWith(p))) {
    // Allow login page and admin API without session check
    if (ADMIN_PUBLIC.some(p => pathname === p)) return NextResponse.next()
    if (pathname.startsWith('/api/admin/login'))  return NextResponse.next()
    if (pathname.startsWith('/api/admin/setup'))  return NextResponse.next()

    const token = req.cookies.get('bcarte_admin')?.value
    if (!token) return redirectToAdminLogin(req)

    try {
      const { payload } = await jwtVerify(token, ADMIN_SECRET())
      if (payload.role !== 'ADMIN') return redirectToAdminLogin(req)
      return NextResponse.next()
    } catch {
      return redirectToAdminLogin(req)
    }
  }

  // ── User routes ─────────────────────────────────────────────────────────
  if (USER_PROTECTED.some(p => pathname.startsWith(p))) {
    const token = req.cookies.get('bcarte_session')?.value
    if (!token) return redirectToLogin(req, pathname)

    try {
      await jwtVerify(token, USER_SECRET())
      return NextResponse.next()
    } catch {
      return redirectToLogin(req, pathname)
    }
  }

  return NextResponse.next()
}

function redirectToLogin(req: NextRequest, next: string) {
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('next', next)
  return NextResponse.redirect(url)
}

function redirectToAdminLogin(req: NextRequest) {
  const url = req.nextUrl.clone()
  url.pathname = '/admin/login'
  url.searchParams.delete('next')
  return NextResponse.redirect(url)
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
