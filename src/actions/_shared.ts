import 'server-only'

import { getAccessToken } from '@/lib/session/session'
import { __ } from '@/lib/utils'

export type ActionResult<T = undefined> = {
  success: boolean
  data?: T
  error?: string
}

export function ok<T>(data?: T): ActionResult<T> {
  return { success: true, data }
}

export function fail<T = undefined>(error: string): ActionResult<T> {
  return { success: false, error }
}

/**
 * Wraps a server action that needs an access token. If the customer is not
 * authenticated, returns an "unauthorized" failure result. If the action
 * throws, returns a generic failure result.
 */
export async function withAccessToken<T>(
  action: (accessToken: string) => Promise<ActionResult<T>>,
): Promise<ActionResult<T>> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return fail(__('account.error.unauthorized'))
  }

  try {
    return await action(accessToken)
  } catch {
    return fail(__('account.error.generic'))
  }
}
