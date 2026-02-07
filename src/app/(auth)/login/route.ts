import { NextResponse } from 'next/server'

import { setOAuthStateCookies } from '@/lib/auth/oauth-state'
import { generatePKCEParams } from '@/lib/shopify/customer/crypto'
import {
  getClientId,
  getOAuthDiscoveryConfig,
} from '@/lib/shopify/customer/discovery'
import { url } from '@/lib/utils'

export async function GET(): Promise<NextResponse> {
  const params = await generatePKCEParams()
  const config = await getOAuthDiscoveryConfig()
  const clientId = getClientId()

  const authUrl = new URL(config.authorization_endpoint)
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', url('/auth/callback').toString())
  authUrl.searchParams.set('scope', 'openid email customer-account-api:full')
  authUrl.searchParams.set('state', params.state)
  authUrl.searchParams.set('nonce', params.nonce)
  authUrl.searchParams.set('code_challenge', params.codeChallenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')

  await setOAuthStateCookies(params)

  return NextResponse.redirect(authUrl.toString())
}
