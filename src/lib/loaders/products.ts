import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import { PRODUCTS_CACHE_TAG } from '@/lib/loaders/cache-tags'
import {
  getProductByHandle as getProductByHandleQuery,
  getProductRecommendations as getProductRecommendationsQuery,
  getProducts as getProductsQuery,
  searchProducts as searchProductsQuery,
} from '@/lib/shopify/storefront/queries/products'
import type {
  Product,
  ProductListItem,
  ProductRecommendationIntent,
} from '@/lib/shopify/storefront/types'
import type { PageInfo } from '@/lib/shopify/types'

export async function getProducts(
  first: number = 12,
  after?: string,
): Promise<{ products: ProductListItem[]; pageInfo: PageInfo }> {
  'use cache'
  cacheTag(PRODUCTS_CACHE_TAG)
  cacheLife('hours')

  return getProductsQuery(first, after)
}

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

export async function searchProducts(
  query: string,
  limit: number = 8,
): Promise<ProductListItem[]> {
  'use cache'
  cacheTag(PRODUCTS_CACHE_TAG, `product-search-${query}`)
  cacheLife('minutes')

  return searchProductsQuery(query, limit)
}
