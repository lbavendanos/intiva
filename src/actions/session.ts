'use server'

import { cookies } from 'next/headers'

import { refreshAccessToken } from '@/lib/shopify/customer-account/tokens'
import type { SessionTokens } from '@/lib/shopify/customer-account/types'

const SESSION_COOKIE_PREFIX = 'customer_'
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

const SESSION_COOKIE_NAMES = {
  accessToken: `${SESSION_COOKIE_PREFIX}access_token`,
  refreshToken: `${SESSION_COOKIE_PREFIX}refresh_token`,
  idToken: `${SESSION_COOKIE_PREFIX}id_token`,
  expiresAt: `${SESSION_COOKIE_PREFIX}expires_at`,
} as const

export async function getSession(): Promise<SessionTokens | null> {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get(SESSION_COOKIE_NAMES.accessToken)?.value
  const refreshToken = cookieStore.get(SESSION_COOKIE_NAMES.refreshToken)?.value
  const idToken = cookieStore.get(SESSION_COOKIE_NAMES.idToken)?.value
  const expiresAt = cookieStore.get(SESSION_COOKIE_NAMES.expiresAt)?.value

  if (!accessToken || !refreshToken || !idToken || !expiresAt) {
    return null
  }

  const session: SessionTokens = {
    accessToken,
    refreshToken,
    idToken,
    expiresAt: Number(expiresAt),
  }

  if (!session) {
    return null
  }

  // Token still valid — return as-is
  if (session.expiresAt > Date.now()) {
    return session
  }

  // Token expired — try to refresh
  try {
    const newTokens = await refreshAccessToken(session.refreshToken)
    await setSession(newTokens)

    return newTokens
  } catch {
    await clearSession()

    return null
  }
}

export async function setSession(tokens: SessionTokens): Promise<void> {
  const cookieStore = await cookies()
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE,
  }

  cookieStore.set(SESSION_COOKIE_NAMES.accessToken, tokens.accessToken, options)
  cookieStore.set(
    SESSION_COOKIE_NAMES.refreshToken,
    tokens.refreshToken,
    options,
  )
  cookieStore.set(SESSION_COOKIE_NAMES.idToken, tokens.idToken, options)
  cookieStore.set(
    SESSION_COOKIE_NAMES.expiresAt,
    String(tokens.expiresAt),
    options,
  )
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()

  for (const name of Object.values(SESSION_COOKIE_NAMES)) {
    cookieStore.delete(name)
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()

  return session !== null
}
