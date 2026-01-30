'use server'

import { revalidatePath } from 'next/cache'

import { updateCustomer as updateCustomerMutation } from '@/lib/shopify/mutations/customer'
import {
  getCustomerOrder as getCustomerOrderQuery,
  getCustomerOrders as getCustomerOrdersQuery,
} from '@/lib/shopify/queries/customer'
import type { Customer, Order, PageInfo } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'

import { getCustomerAccessToken } from './session'

type UpdateProfileInput = {
  firstName?: string
  lastName?: string
  phone?: string
  acceptsMarketing?: boolean
}

type UpdateCustomerResult = {
  success: boolean
  error?: string
  customer?: Customer | null
}

type GetCustomerOrdersResult = {
  orders: Order[]
  pageInfo: PageInfo
}

export async function updateCustomer(
  input: UpdateProfileInput,
): Promise<UpdateCustomerResult> {
  const accessToken = await getCustomerAccessToken()

  if (!accessToken) {
    return {
      success: false,
      error: __('account.error.not_authenticated'),
    }
  }

  const { customer, customerUserErrors } = await updateCustomerMutation(
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

export async function getCustomerOrders(
  first: number = 10,
  after?: string,
): Promise<GetCustomerOrdersResult | null> {
  const accessToken = await getCustomerAccessToken()

  if (!accessToken) {
    return null
  }

  return getCustomerOrdersQuery(accessToken, first, after)
}

export async function getCustomerOrder(
  orderNumber: number,
): Promise<Order | null> {
  const accessToken = await getCustomerAccessToken()

  if (!accessToken) {
    return null
  }

  return getCustomerOrderQuery(accessToken, orderNumber)
}
