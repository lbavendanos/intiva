import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import type { SessionTokens } from '@/lib/shopify/customer/types'

const SESSION_COOKIE_PREFIX = 'customer_'
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

const SESSION_COOKIE_NAMES = {
  accessToken: `${SESSION_COOKIE_PREFIX}access_token`,
  refreshToken: `${SESSION_COOKIE_PREFIX}refresh_token`,
  idToken: `${SESSION_COOKIE_PREFIX}id_token`,
  expiresAt: `${SESSION_COOKIE_PREFIX}expires_at`,
} as const

export function getSessionTokens(request: NextRequest): SessionTokens | null {
  const accessToken = request.cookies.get(
    SESSION_COOKIE_NAMES.accessToken,
  )?.value
  const refreshToken = request.cookies.get(
    SESSION_COOKIE_NAMES.refreshToken,
  )?.value
  const idToken = request.cookies.get(SESSION_COOKIE_NAMES.idToken)?.value
  const expiresAt = request.cookies.get(SESSION_COOKIE_NAMES.expiresAt)?.value

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
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE,
  }

  response.cookies.set(
    SESSION_COOKIE_NAMES.accessToken,
    tokens.accessToken,
    options,
  )
  response.cookies.set(
    SESSION_COOKIE_NAMES.refreshToken,
    tokens.refreshToken,
    options,
  )
  response.cookies.set(SESSION_COOKIE_NAMES.idToken, tokens.idToken, options)
  response.cookies.set(
    SESSION_COOKIE_NAMES.expiresAt,
    String(tokens.expiresAt),
    options,
  )
}

export function clearSessionCookies(response: NextResponse): void {
  for (const name of Object.values(SESSION_COOKIE_NAMES)) {
    response.cookies.delete(name)
  }
}
