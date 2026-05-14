'use server'

import {
  getCustomerOrder as getCustomerOrderQuery,
  getCustomerOrders as getCustomerOrdersQuery,
} from '@/lib/shopify/customer-account/queries/orders'
import type { Order, OrderListItem } from '@/lib/shopify/customer-account/types'
import { PageInfo } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'

import { getSession } from './session'

type OrderActionResult = {
  success: boolean
  order: Order | null
  error?: string
}

type OrdersActionResult = {
  success: boolean
  orders: OrderListItem[] | null
  pageInfo: PageInfo | null
  error?: string
}

async function getAccessToken(): Promise<string | null> {
  const session = await getSession()

  if (!session || session.expiresAt <= Date.now()) {
    return null
  }

  return session.accessToken
}

export async function getOrders(cursor?: string): Promise<OrdersActionResult> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return {
      success: false,
      orders: null,
      pageInfo: null,
      error: __('account.error.unauthorized'),
    }
  }

  try {
    const result = await getCustomerOrdersQuery(accessToken, 10, cursor)
    return { success: true, orders: result.orders, pageInfo: result.pageInfo }
  } catch {
    return {
      success: false,

      orders: null,
      pageInfo: null,
      error: __('account.error.generic'),
    }
  }
}

export async function getOrder(orderId: string): Promise<OrderActionResult> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return {
      success: false,
      order: null,
      error: __('account.error.unauthorized'),
    }
  }

  try {
    const order = await getCustomerOrderQuery(accessToken, orderId)

    if (!order) {
      return { success: false, order: null, error: __('order.not_found') }
    }

    return { success: true, order: order }
  } catch {
    return { success: false, order: null, error: __('account.error.generic') }
  }
}
