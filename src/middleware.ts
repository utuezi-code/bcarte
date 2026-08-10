import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const USER_SECRET = () => new TextEncoder().encode(process.env.JWT_SECRET ?? '')

const USER_PROTECTED = ['/dashboard', '/recruiter', '/settings', '/institution', '/org']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Admin routes — auth handled by server component layout (admin/(protected)/layout.tsx)
  // No JWT check here to avoid edge-runtime vs Node.js secret mismatch
  if (pathname.startsWith('/admin')) return NextResponse.next()

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
