'use server'

import { redirect } from 'next/navigation'

import { generatePKCEParams } from '@/lib/shopify/customer-account/crypto'
import {
  getClientId,
  getOAuthDiscoveryConfig,
} from '@/lib/shopify/customer-account/discovery'
import { exchangeCodeForTokens } from '@/lib/shopify/customer-account/tokens'
import { url } from '@/lib/utils'

import {
  clearOAuthStateCookies,
  getOAuthStateCookies,
  setOAuthStateCookies,
} from './oauth-state'
import { clearSession, getSession, setSession } from './session'

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

export async function authorize(code: string, state: string): Promise<void> {
  const oauthState = await getOAuthStateCookies()

  if (oauthState && oauthState.state === state) {
    await clearOAuthStateCookies()

    try {
      const tokens = await exchangeCodeForTokens(
        code,
        oauthState.codeVerifier,
        url('/auth/callback').toString(),
      )

      await setSession(tokens)
    } catch {
      // Token exchange failed
    }
  }

  redirect(url('/').toString())
}

export async function logout(): Promise<void> {
  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  const config = await getOAuthDiscoveryConfig()

  const logoutUrl = new URL(config.end_session_endpoint)
  logoutUrl.searchParams.set('id_token_hint', session.idToken)
  logoutUrl.searchParams.set('post_logout_redirect_uri', url('/').toString())

  await clearSession()

  redirect(logoutUrl.toString())
}
