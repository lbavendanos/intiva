'use server'

import { cookies } from 'next/headers'

import { SESSION_COOKIE_NAMES } from '@/lib/auth/session'

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()

  return !!cookieStore.get(SESSION_COOKIE_NAMES.accessToken)?.value
}
