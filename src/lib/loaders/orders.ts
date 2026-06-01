import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { getAccessToken } from '@/lib/auth/session'
import { ORDERS_CACHE_TAG } from '@/lib/loaders/cache-tags'
import { toShopifyOrdersQuery, type OrdersFilter } from '@/lib/orders/filter'
import { toShopifySort, type OrdersSort } from '@/lib/orders/sort'
import {
  getCustomerOrder as getCustomerOrderQuery,
  getCustomerOrders as getCustomerOrdersQuery,
} from '@/lib/shopify/customer-account/queries/orders'
import type { Order, OrderListItem } from '@/lib/shopify/customer-account/types'
import type { PageInfo } from '@/lib/shopify/types'

type GetOrdersOptions = {
  first?: number
  after?: string
  sort?: OrdersSort | null
  filter?: OrdersFilter | null
}

export async function getOrders({
  first = 10,
  after,
  sort = null,
  filter = null,
}: GetOrdersOptions = {}): Promise<{
  orders: OrderListItem[]
  pageInfo: PageInfo
} | null> {
  'use cache: private'
  cacheTag(ORDERS_CACHE_TAG)
  cacheLife('minutes')

  const accessToken = await getAccessToken()

  if (!accessToken) {
    return null
  }

  const { sortKey, reverse } = toShopifySort(sort)
  const query = toShopifyOrdersQuery(filter)

  return getCustomerOrdersQuery(accessToken, {
    first,
    after,
    sortKey,
    reverse,
    query,
  })
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
