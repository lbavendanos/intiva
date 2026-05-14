'use server'

import { revalidatePath } from 'next/cache'

import {
  createCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from '@/lib/shopify/customer-account/mutations/address'
import type { CustomerAddressInput } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'

import { getSession } from './session'

type AccountActionResult<T = undefined> = {
  success: boolean
  data?: T
  error?: string
}

async function getAccessToken(): Promise<string | null> {
  const session = await getSession()

  if (!session || session.expiresAt <= Date.now()) {
    return null
  }

  return session.accessToken
}

export async function createAddress(
  _prevState: AccountActionResult,
  formData: FormData,
): Promise<AccountActionResult> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return { success: false, error: __('account.error.unauthorized') }
  }

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

  const defaultAddress = formData.get('defaultAddress') === 'on'

  try {
    const { userErrors } = await createCustomerAddress(
      accessToken,
      address,
      defaultAddress || undefined,
    )

    if (userErrors.length > 0) {
      return {
        success: false,
        error: userErrors[0].message || __('account.error.generic'),
      }
    }

    revalidatePath('/account/addresses')
    return { success: true }
  } catch {
    return { success: false, error: __('account.error.generic') }
  }
}

export async function updateAddress(
  addressId: string,
  _prevState: AccountActionResult,
  formData: FormData,
): Promise<AccountActionResult> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return { success: false, error: __('account.error.unauthorized') }
  }

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

  const defaultAddress = formData.get('defaultAddress') === 'on'

  try {
    const { userErrors } = await updateCustomerAddress(
      accessToken,
      addressId,
      address,
      defaultAddress || undefined,
    )

    if (userErrors.length > 0) {
      return {
        success: false,
        error: userErrors[0].message || __('account.error.generic'),
      }
    }

    revalidatePath('/account/addresses')
    return { success: true }
  } catch {
    return { success: false, error: __('account.error.generic') }
  }
}

export async function deleteAddress(
  addressId: string,
): Promise<AccountActionResult> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return { success: false, error: __('account.error.unauthorized') }
  }

  try {
    const { userErrors } = await deleteCustomerAddress(accessToken, addressId)

    if (userErrors.length > 0) {
      return {
        success: false,
        error: userErrors[0].message || __('account.error.generic'),
      }
    }

    revalidatePath('/account/addresses')
    return { success: true }
  } catch {
    return { success: false, error: __('account.error.generic') }
  }
}

export async function setDefaultAddress(
  addressId: string,
): Promise<AccountActionResult> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return { success: false, error: __('account.error.unauthorized') }
  }

  try {
    const { userErrors } = await updateCustomerAddress(
      accessToken,
      addressId,
      {},
      true,
    )

    if (userErrors.length > 0) {
      return {
        success: false,
        error: userErrors[0].message || __('account.error.generic'),
      }
    }

    revalidatePath('/account/addresses')
    return { success: true }
  } catch {
    return { success: false, error: __('account.error.generic') }
  }
}
