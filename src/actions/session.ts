'use server'

import { cookies } from 'next/headers'

import { SESSION_COOKIE_NAMES } from '@/lib/auth/session'
import type { SessionTokens } from '@/lib/shopify/customer/types'

const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

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

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()

  return !!cookieStore.get(SESSION_COOKIE_NAMES.accessToken)?.value
}
