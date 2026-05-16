import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { cookies } from 'next/headers'

import { getCart as getCartQuery } from '@/lib/shopify/storefront/queries/cart'
import type { Cart } from '@/lib/shopify/storefront/types'

export const CART_COOKIE_NAME = 'cartId'
export const CART_CACHE_TAG = 'cart'

export async function getCart(): Promise<Cart | null> {
  'use cache: private'
  cacheTag(CART_CACHE_TAG)
  cacheLife('seconds')

  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value

  if (!cartId) {
    return null
  }

  return getCartQuery(cartId)
}
