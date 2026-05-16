'use server'

import { updateTag } from 'next/cache'

import { CUSTOMER_CACHE_TAG } from '@/lib/data/customer'
import {
  createCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from '@/lib/shopify/customer-account/mutations/address'
import { __ } from '@/lib/utils'

import {
  fail,
  ok,
  parseAddressFormData,
  withAccessToken,
  type ActionResult,
} from './_shared'

export async function createAddress(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { address, defaultAddress } = parseAddressFormData(formData)

  return withAccessToken(async (accessToken) => {
    const { userErrors } = await createCustomerAddress(
      accessToken,
      address,
      defaultAddress || undefined,
    )

    if (userErrors.length > 0) {
      return fail(userErrors[0].message || __('account.error.generic'))
    }

    updateTag(CUSTOMER_CACHE_TAG)
    return ok()
  })
}

export async function updateAddress(
  addressId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { address, defaultAddress } = parseAddressFormData(formData)

  return withAccessToken(async (accessToken) => {
    const { userErrors } = await updateCustomerAddress(
      accessToken,
      addressId,
      address,
      defaultAddress || undefined,
    )

    if (userErrors.length > 0) {
      return fail(userErrors[0].message || __('account.error.generic'))
    }

    updateTag(CUSTOMER_CACHE_TAG)
    return ok()
  })
}

export async function deleteAddress(addressId: string): Promise<ActionResult> {
  return withAccessToken(async (accessToken) => {
    const { userErrors } = await deleteCustomerAddress(accessToken, addressId)

    if (userErrors.length > 0) {
      return fail(userErrors[0].message || __('account.error.generic'))
    }

    updateTag(CUSTOMER_CACHE_TAG)
    return ok()
  })
}

export async function setDefaultAddress(
  addressId: string,
): Promise<ActionResult> {
  return withAccessToken(async (accessToken) => {
    const { userErrors } = await updateCustomerAddress(
      accessToken,
      addressId,
      {},
      true,
    )

    if (userErrors.length > 0) {
      return fail(userErrors[0].message || __('account.error.generic'))
    }

    updateTag(CUSTOMER_CACHE_TAG)
    return ok()
  })
}
