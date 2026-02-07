import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  clearSessionCookies,
  getSessionTokens,
  setSessionCookies,
} from '@/lib/auth/session'
import { refreshAccessToken } from '@/lib/shopify/customer/tokens'

const PROTECTED_ROUTES = ['/account']

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const session = getSessionTokens(request)
  const isProtected = isProtectedRoute(pathname)

  // No session — redirect to login if protected route
  if (!session) {
    if (isProtected) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  // Session exists but access token is expired — try to refresh
  if (session.expiresAt <= Date.now()) {
    try {
      const newTokens = await refreshAccessToken(session.refreshToken)
      const response = NextResponse.next()
      setSessionCookies(response, newTokens)

      return response
    } catch {
      // Refresh failed — clear cookies and redirect if protected
      const response = isProtected
        ? NextResponse.redirect(new URL('/login', request.url))
        : NextResponse.next()

      clearSessionCookies(response)

      return response
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
