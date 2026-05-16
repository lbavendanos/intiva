import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { getAccessToken } from '@/lib/session/session'
import {
  getCustomerOrder as getCustomerOrderQuery,
  getCustomerOrders as getCustomerOrdersQuery,
} from '@/lib/shopify/customer-account/queries/orders'
import type { Order, OrderListItem } from '@/lib/shopify/customer-account/types'
import type { PageInfo } from '@/lib/shopify/types'

export const ORDERS_CACHE_TAG = 'orders'

export async function getOrders(
  first: number = 10,
  after?: string,
): Promise<{ orders: OrderListItem[]; pageInfo: PageInfo } | null> {
  'use cache: private'
  cacheTag(ORDERS_CACHE_TAG)
  cacheLife('minutes')

  const accessToken = await getAccessToken()

  if (!accessToken) {
    return null
  }

  return getCustomerOrdersQuery(accessToken, first, after)
}

export async function getOrder(orderId: string): Promise<Order | null> {
  'use cache: private'
  cacheTag(ORDERS_CACHE_TAG, `order-${orderId}`)
  cacheLife('minutes')

  const accessToken = await getAccessToken()

  if (!accessToken) {
    return null
  }

  return getCustomerOrderQuery(accessToken, orderId)
}
