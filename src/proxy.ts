import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const SESSION_COOKIE_NAMES = {
  accessToken: 'customer_access_token',
  refreshToken: 'customer_refresh_token',
  expiresAt: 'customer_expires_at',
} as const

const PROTECTED_ROUTES = ['/account']

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl

  const accessToken = request.cookies.get(
    SESSION_COOKIE_NAMES.accessToken,
  )?.value
  const refreshToken = request.cookies.get(
    SESSION_COOKIE_NAMES.refreshToken,
  )?.value
  const expiresAt = request.cookies.get(SESSION_COOKIE_NAMES.expiresAt)?.value

  const hasSession = Boolean(accessToken)
  const isExpired = expiresAt ? Number(expiresAt) <= Date.now() : false

  if (isProtectedRoute(pathname)) {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isExpired && refreshToken) {
      const refreshUrl = new URL('/api/auth/refresh', request.url)
      refreshUrl.searchParams.set('redirectTo', `${pathname}${search}`)
      return NextResponse.redirect(refreshUrl)
    }

    if (isExpired) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - api routes
     * - static assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)',
  ],
}
