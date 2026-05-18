'use server'

import { updateTag } from 'next/cache'

import { CUSTOMER_CACHE_TAG } from '@/lib/data/cache-tags'
import {
  createCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from '@/lib/shopify/customer-account/mutations/address'
import type { CustomerAddressInput } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'

import { fail, ok, withAccessToken, type ActionResult } from './_shared'

type AddressActionInput = {
  address: CustomerAddressInput
  defaultAddress?: boolean
}

export async function createAddress(
  input: AddressActionInput,
): Promise<ActionResult> {
  return withAccessToken(async (accessToken) => {
    const { userErrors } = await createCustomerAddress(
      accessToken,
      input.address,
      input.defaultAddress || undefined,
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
  input: AddressActionInput,
): Promise<ActionResult> {
  return withAccessToken(async (accessToken) => {
    const { userErrors } = await updateCustomerAddress(
      accessToken,
      addressId,
      input.address,
      input.defaultAddress || undefined,
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
