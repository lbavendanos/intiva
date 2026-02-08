'use server'

import { cacheLife, cacheTag } from 'next/cache'

import {
  getProductByHandle as getProductByHandleQuery,
  getProductRecommendations as getProductRecommendationsQuery,
} from '@/lib/shopify/storefront/queries/products'
import type {
  Product,
  ProductListItem,
  ProductRecommendationIntent,
} from '@/lib/shopify/storefront/types'

const PRODUCTS_CACHE_TAG = 'products'

export async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  'use cache'
  cacheTag(PRODUCTS_CACHE_TAG, `product-${handle}`)
  cacheLife('hours')

  return getProductByHandleQuery(handle)
}

export async function getProductRecommendations(
  productId: string,
  intent: ProductRecommendationIntent = 'RELATED',
): Promise<ProductListItem[]> {
  'use cache'
  cacheTag(PRODUCTS_CACHE_TAG, `product-recommendations-${productId}`)
  cacheLife('hours')

  return getProductRecommendationsQuery(productId, intent)
}
