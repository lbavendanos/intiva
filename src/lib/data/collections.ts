import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

import {
  getCollectionByHandle as getCollectionByHandleQuery,
  getCollectionProducts as getCollectionProductsQuery,
  getCollections as getCollectionsQuery,
} from '@/lib/shopify/storefront/queries/collections'
import type {
  Collection,
  CollectionListItem,
  ProductListItem,
} from '@/lib/shopify/storefront/types'
import type { PageInfo } from '@/lib/shopify/types'

export const COLLECTIONS_CACHE_TAG = 'collections'

export async function getCollections(
  first: number = 12,
  after?: string,
): Promise<{ collections: CollectionListItem[]; pageInfo: PageInfo }> {
  'use cache'
  cacheTag(COLLECTIONS_CACHE_TAG)
  cacheLife('hours')

  return getCollectionsQuery(first, after)
}

export async function getCollectionByHandle(
  handle: string,
): Promise<Collection | null> {
  'use cache'
  cacheTag(COLLECTIONS_CACHE_TAG, `collection-${handle}`)
  cacheLife('hours')

  return getCollectionByHandleQuery(handle)
}

export async function getCollectionProducts(
  handle: string,
  first: number = 12,
  after?: string,
): Promise<{
  collection: Collection | null
  products: ProductListItem[]
  pageInfo: PageInfo
}> {
  'use cache'
  cacheTag(COLLECTIONS_CACHE_TAG, `collection-${handle}`)
  cacheLife('hours')

  return getCollectionProductsQuery(handle, first, after)
}
