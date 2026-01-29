'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import {
  updateCustomer,
  type CustomerUpdateInput,
} from '@/lib/shopify/mutations/customer'
import {
  getCustomerOrder,
  getCustomerOrders,
  type GetCustomerOrdersResult,
} from '@/lib/shopify/queries/customer'
import type { Customer, Order } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'

type AccountActionResult = {
  success: boolean
  error?: string
}

type UpdateProfileResult = AccountActionResult & {
  customer?: Customer | null
}

const CUSTOMER_ACCESS_TOKEN_COOKIE = 'customerAccessToken'

async function getCustomerAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value
}

export async function updateProfile(
  input: CustomerUpdateInput,
): Promise<UpdateProfileResult> {
  const accessToken = await getCustomerAccessToken()

  if (!accessToken) {
    return {
      success: false,
      error: __('account.error.not_authenticated'),
    }
  }

  const { customer, customerUserErrors } = await updateCustomer(
    accessToken,
    input,
  )

  if (customerUserErrors.length > 0) {
    const error = customerUserErrors[0]
    return {
      success: false,
      error: error.message || __('account.error.update_failed'),
    }
  }

  if (!customer) {
    return {
      success: false,
      error: __('account.error.update_failed'),
    }
  }

  revalidatePath('/account')
  revalidatePath('/account/profile')

  return {
    success: true,
    customer,
  }
}

export async function getOrders(
  first: number = 10,
  after?: string,
): Promise<GetCustomerOrdersResult | null> {
  const accessToken = await getCustomerAccessToken()

  if (!accessToken) {
    return null
  }

  return getCustomerOrders(accessToken, first, after)
}

export async function getOrder(orderNumber: number): Promise<Order | null> {
  const accessToken = await getCustomerAccessToken()

  if (!accessToken) {
    return null
  }

  return getCustomerOrder(accessToken, orderNumber)
}
