import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  clearOAuthStateCookies,
  exchangeCodeForTokens,
  getOAuthStateCookies,
  setSessionCookies,
} from '@/lib/shopify/customer/session'
import { url } from '@/lib/utils'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state) {
    return NextResponse.redirect(url('/').toString())
  }

  const oauthState = getOAuthStateCookies(request)

  if (!oauthState || oauthState.state !== state) {
    return NextResponse.redirect(url('/').toString())
  }

  try {
    const tokens = await exchangeCodeForTokens(
      code,
      oauthState.codeVerifier,
      url('/auth/callback').toString(),
    )

    const response = NextResponse.redirect(url('/').toString())
    setSessionCookies(response, tokens)
    clearOAuthStateCookies(response)

    return response
  } catch {
    const response = NextResponse.redirect(url('/').toString())
    clearOAuthStateCookies(response)

    return response
  }
}
