import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { getAccessToken } from '@/lib/auth/session'
import { CUSTOMER_CACHE_TAG } from '@/lib/loaders/cache-tags'
import { getCustomer as getCustomerQuery } from '@/lib/shopify/customer-account/queries/customer'
import type { Customer } from '@/lib/shopify/customer-account/types'

export async function getCustomer(): Promise<Customer | null> {
  'use cache: private'
  cacheTag(CUSTOMER_CACHE_TAG)
  cacheLife('minutes')

  const accessToken = await getAccessToken()

  if (!accessToken) {
    return null
  }

  return getCustomerQuery(accessToken)
}
