'use server'

import { revalidatePath } from 'next/cache'

import {
  createCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from '@/lib/shopify/customer-account/mutations/address'
import { updateCustomer } from '@/lib/shopify/customer-account/mutations/customer'
import { getCustomer } from '@/lib/shopify/customer-account/queries/customer'
import {
  getCustomerOrder,
  getCustomerOrders,
} from '@/lib/shopify/customer-account/queries/orders'
import type {
  Customer,
  CustomerAddressInput,
  Order,
  OrderListItem,
} from '@/lib/shopify/customer-account/types'
import type { PageInfo } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'

import { getSession } from './session'

type AccountActionResult<T = undefined> = {
  success: boolean
  data?: T
  error?: string
}

async function getAccessToken(): Promise<string | null> {
  const session = await getSession()
  return session?.accessToken ?? null
}

export async function getCustomerProfile(): Promise<
  AccountActionResult<Customer>
> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return { success: false, error: __('account.error.unauthorized') }
  }

  try {
    const customer = await getCustomer(accessToken)
    return { success: true, data: customer }
  } catch {
    return { success: false, error: __('account.error.generic') }
  }
}

export async function updateCustomerProfile(
  _prevState: AccountActionResult,
  formData: FormData,
): Promise<AccountActionResult> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return { success: false, error: __('account.error.unauthorized') }
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  try {
    const { userErrors } = await updateCustomer(accessToken, {
      firstName,
      lastName,
    })

    if (userErrors.length > 0) {
      return {
        success: false,
        error: userErrors[0].message || __('account.error.generic'),
      }
    }

    revalidatePath('/account')
    return { success: true }
  } catch {
    return { success: false, error: __('account.error.generic') }
  }
}

export async function getOrders(
  cursor?: string,
): Promise<
  AccountActionResult<{ orders: OrderListItem[]; pageInfo: PageInfo }>
> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return { success: false, error: __('account.error.unauthorized') }
  }

  try {
    const result = await getCustomerOrders(accessToken, 10, cursor)
    return { success: true, data: result }
  } catch {
    return { success: false, error: __('account.error.generic') }
  }
}

export async function getOrder(
  orderId: string,
): Promise<AccountActionResult<Order>> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return { success: false, error: __('account.error.unauthorized') }
  }

  try {
    const order = await getCustomerOrder(accessToken, orderId)

    if (!order) {
      return { success: false, error: __('order.not_found') }
    }

    return { success: true, data: order }
  } catch {
    return { success: false, error: __('account.error.generic') }
  }
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
