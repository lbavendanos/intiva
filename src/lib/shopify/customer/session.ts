import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  CustomerAccountError,
  getClientId,
  getOAuthDiscoveryConfig,
} from './discovery'
import type { PKCEParams, SessionTokens, TokenResponse } from './types'

const COOKIE_PREFIX = 'customer_'

const COOKIE_NAMES = {
  accessToken: `${COOKIE_PREFIX}access_token`,
  refreshToken: `${COOKIE_PREFIX}refresh_token`,
  idToken: `${COOKIE_PREFIX}id_token`,
  expiresAt: `${COOKIE_PREFIX}expires_at`,
} as const

const OAUTH_COOKIE_NAMES = {
  codeVerifier: `${COOKIE_PREFIX}code_verifier`,
  state: `${COOKIE_PREFIX}state`,
  nonce: `${COOKIE_PREFIX}nonce`,
} as const

const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const OAUTH_STATE_MAX_AGE = 60 * 10 // 10 minutes

type CookieOptions = {
  httpOnly: boolean
  secure: boolean
  sameSite: 'lax'
  path: string
  maxAge: number
}

function getCookieOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  }
}

export function getSessionTokens(request: NextRequest): SessionTokens | null {
  const accessToken = request.cookies.get(COOKIE_NAMES.accessToken)?.value
  const refreshToken = request.cookies.get(COOKIE_NAMES.refreshToken)?.value
  const idToken = request.cookies.get(COOKIE_NAMES.idToken)?.value
  const expiresAt = request.cookies.get(COOKIE_NAMES.expiresAt)?.value

  if (!accessToken || !refreshToken || !idToken || !expiresAt) {
    return null
  }

  return {
    accessToken,
    refreshToken,
    idToken,
    expiresAt: Number(expiresAt),
  }
}

export function setSessionCookies(
  response: NextResponse,
  tokens: SessionTokens,
): void {
  const options = getCookieOptions(SESSION_MAX_AGE)

  response.cookies.set(COOKIE_NAMES.accessToken, tokens.accessToken, options)
  response.cookies.set(COOKIE_NAMES.refreshToken, tokens.refreshToken, options)
  response.cookies.set(COOKIE_NAMES.idToken, tokens.idToken, options)
  response.cookies.set(
    COOKIE_NAMES.expiresAt,
    String(tokens.expiresAt),
    options,
  )
}

export function clearSessionCookies(response: NextResponse): void {
  for (const name of Object.values(COOKIE_NAMES)) {
    response.cookies.delete(name)
  }
}

export function setOAuthStateCookies(
  response: NextResponse,
  params: PKCEParams,
): void {
  const options = getCookieOptions(OAUTH_STATE_MAX_AGE)

  response.cookies.set(
    OAUTH_COOKIE_NAMES.codeVerifier,
    params.codeVerifier,
    options,
  )
  response.cookies.set(OAUTH_COOKIE_NAMES.state, params.state, options)
  response.cookies.set(OAUTH_COOKIE_NAMES.nonce, params.nonce, options)
}

export function getOAuthStateCookies(
  request: NextRequest,
): Pick<PKCEParams, 'codeVerifier' | 'state' | 'nonce'> | null {
  const codeVerifier = request.cookies.get(
    OAUTH_COOKIE_NAMES.codeVerifier,
  )?.value
  const state = request.cookies.get(OAUTH_COOKIE_NAMES.state)?.value
  const nonce = request.cookies.get(OAUTH_COOKIE_NAMES.nonce)?.value

  if (!codeVerifier || !state || !nonce) {
    return null
  }

  return { codeVerifier, state, nonce }
}

export function clearOAuthStateCookies(response: NextResponse): void {
  for (const name of Object.values(OAUTH_COOKIE_NAMES)) {
    response.cookies.delete(name)
  }
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string,
): Promise<SessionTokens> {
  const config = await getOAuthDiscoveryConfig()
  const clientId = getClientId()

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  })

  let response: Response

  try {
    response = await fetch(config.token_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
  } catch (error) {
    throw new CustomerAccountError(
      `Failed to exchange code for tokens: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  if (!response.ok) {
    const text = await response.text()
    throw new CustomerAccountError(
      `Token exchange failed with ${response.status}: ${text}`,
    )
  }

  const data = (await response.json()) as TokenResponse

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<SessionTokens> {
  const config = await getOAuthDiscoveryConfig()
  const clientId = getClientId()

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
  })

  let response: Response

  try {
    response = await fetch(config.token_endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
  } catch (error) {
    throw new CustomerAccountError(
      `Failed to refresh access token: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  if (!response.ok) {
    const text = await response.text()
    throw new CustomerAccountError(
      `Token refresh failed with ${response.status}: ${text}`,
    )
  }

  const data = (await response.json()) as TokenResponse

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
}

export { COOKIE_NAMES }
