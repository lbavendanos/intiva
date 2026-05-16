import 'server-only'

import { getAccessToken } from '@/lib/session/session'
import type { CustomerAddressInput } from '@/lib/shopify/customer-account/types'
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

export function parseAddressFormData(formData: FormData): {
  address: CustomerAddressInput
  defaultAddress: boolean
} {
  const address: CustomerAddressInput = {
    firstName: (formData.get('firstName') as string) || undefined,
    lastName: (formData.get('lastName') as string) || undefined,
    company: (formData.get('company') as string) || undefined,
    address1: (formData.get('address1') as string) || undefined,
    address2: (formData.get('address2') as string) || undefined,
    city: (formData.get('city') as string) || undefined,
    zoneCode: (formData.get('zoneCode') as string) || undefined,
    territoryCode: (formData.get('territoryCode') as string) || undefined,
    zip: (formData.get('zip') as string) || undefined,
    phoneNumber: (formData.get('phoneNumber') as string) || undefined,
  }

  return {
    address,
    defaultAddress: formData.get('defaultAddress') === 'on',
  }
}
