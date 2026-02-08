'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { setOAuthStateCookies } from '@/lib/auth/oauth-state'
import { SESSION_COOKIE_NAMES } from '@/lib/auth/session'
import { generatePKCEParams } from '@/lib/shopify/customer/crypto'
import {
  getClientId,
  getOAuthDiscoveryConfig,
} from '@/lib/shopify/customer/discovery'
import { url } from '@/lib/utils'

export async function login(): Promise<void> {
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

  redirect(authUrl.toString())
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const idToken = cookieStore.get(SESSION_COOKIE_NAMES.idToken)?.value

  if (!idToken) {
    redirect('/')
  }

  const config = await getOAuthDiscoveryConfig()

  const logoutUrl = new URL(config.end_session_endpoint)
  logoutUrl.searchParams.set('id_token_hint', idToken)
  logoutUrl.searchParams.set('post_logout_redirect_uri', url('/').toString())

  for (const name of Object.values(SESSION_COOKIE_NAMES)) {
    cookieStore.delete(name)
  }

  redirect(logoutUrl.toString())
}
