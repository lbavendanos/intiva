'use server'

import { cacheLife, cacheTag } from 'next/cache'

import {
  getProductByHandle as getProductByHandleQuery,
  getProductRecommendations as getProductRecommendationsQuery,
  type ProductRecommendationIntent,
} from '@/lib/shopify/queries'
import type { Product, ProductListItem } from '@/lib/shopify/types'

export async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  'use cache'
  cacheTag('products', `product-${handle}`)
  cacheLife('hours')

  return getProductByHandleQuery(handle)
}

export async function getProductRecommendations(
  productId: string,
  intent: ProductRecommendationIntent = 'RELATED',
): Promise<ProductListItem[]> {
  'use cache'
  cacheTag('products', `product-recommendations-${productId}`)
  cacheLife('hours')

  return getProductRecommendationsQuery(productId, intent)
}
