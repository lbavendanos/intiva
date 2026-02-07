import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { clearSessionCookies, getSessionTokens } from '@/lib/auth/session'
import { getOAuthDiscoveryConfig } from '@/lib/shopify/customer/discovery'
import { url } from '@/lib/utils'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = getSessionTokens(request)

  if (!session) {
    return NextResponse.redirect(url('/').toString())
  }

  const config = await getOAuthDiscoveryConfig()

  const logoutUrl = new URL(config.end_session_endpoint)
  logoutUrl.searchParams.set('id_token_hint', session.idToken)
  logoutUrl.searchParams.set('post_logout_redirect_uri', url('/').toString())

  const response = NextResponse.redirect(logoutUrl.toString())
  clearSessionCookies(response)

  return response
}
