import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  clearOAuthStateCookies,
  getOAuthStateCookies,
} from '@/actions/oauth-state'
import { setSessionCookies } from '@/lib/auth/session'
import { exchangeCodeForTokens } from '@/lib/shopify/customer/tokens'
import { url } from '@/lib/utils'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code || !state) {
    return NextResponse.redirect(url('/').toString())
  }

  const oauthState = await getOAuthStateCookies()

  if (!oauthState || oauthState.state !== state) {
    return NextResponse.redirect(url('/').toString())
  }

  await clearOAuthStateCookies()

  try {
    const tokens = await exchangeCodeForTokens(
      code,
      oauthState.codeVerifier,
      url('/auth/callback').toString(),
    )

    const response = NextResponse.redirect(url('/').toString())
    setSessionCookies(response, tokens)

    return response
  } catch {
    return NextResponse.redirect(url('/').toString())
  }
}
