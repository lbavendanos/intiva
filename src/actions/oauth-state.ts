import { cookies } from 'next/headers'

import type { PKCEParams } from '@/lib/shopify/customer-account/types'

const OAUTH_STATE_COOKIE_PREFIX = 'oauth_'
const OAUTH_STATE_COOKIE_MAX_AGE = 60 * 10 // 10 minutes

const OAUTH_STATE_COOKIE_NAMES = {
  codeVerifier: `${OAUTH_STATE_COOKIE_PREFIX}code_verifier`,
  state: `${OAUTH_STATE_COOKIE_PREFIX}state`,
  nonce: `${OAUTH_STATE_COOKIE_PREFIX}nonce`,
} as const

export async function setOAuthStateCookies(params: PKCEParams): Promise<void> {
  const cookieStore = await cookies()
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: OAUTH_STATE_COOKIE_MAX_AGE,
  }

  cookieStore.set(
    OAUTH_STATE_COOKIE_NAMES.codeVerifier,
    params.codeVerifier,
    options,
  )
  cookieStore.set(OAUTH_STATE_COOKIE_NAMES.state, params.state, options)
  cookieStore.set(OAUTH_STATE_COOKIE_NAMES.nonce, params.nonce, options)
}

export async function getOAuthStateCookies(): Promise<Pick<
  PKCEParams,
  'codeVerifier' | 'state' | 'nonce'
> | null> {
  const cookieStore = await cookies()
  const codeVerifier = cookieStore.get(
    OAUTH_STATE_COOKIE_NAMES.codeVerifier,
  )?.value
  const state = cookieStore.get(OAUTH_STATE_COOKIE_NAMES.state)?.value
  const nonce = cookieStore.get(OAUTH_STATE_COOKIE_NAMES.nonce)?.value

  if (!codeVerifier || !state || !nonce) {
    return null
  }

  return { codeVerifier, state, nonce }
}

export async function clearOAuthStateCookies(): Promise<void> {
  const cookieStore = await cookies()

  for (const name of Object.values(OAUTH_STATE_COOKIE_NAMES)) {
    cookieStore.delete(name)
  }
}
