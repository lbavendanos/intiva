import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCollectionProducts } from '@/lib/shopify/queries/collections'
import { __ } from '@/lib/utils'
import { Pagination } from '@/components/shop/pagination'
import {
  ProductGrid,
  ProductGridSkeleton,
} from '@/components/shop/product-grid'

type CollectionPageProps = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ cursor?: string }>
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params
  const { collection } = await getCollectionProducts(handle, 1)

  if (!collection) {
    return {
      title: __('collection.not_found'),
    }
  }

  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description,
  }
}

async function CollectionProducts({
  handle,
  cursor,
}: {
  handle: string
  cursor?: string
}) {
  const { collection, products, pageInfo } = await getCollectionProducts(
    handle,
    12,
    cursor,
  )

  if (!collection) {
    notFound()
  }

  return (
    <>
      <ProductGrid products={products} />
      <Pagination pageInfo={pageInfo} basePath={`/collections/${handle}`} />
    </>
  )
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { handle } = await params
  const { cursor } = await searchParams

  const { collection } = await getCollectionProducts(handle, 1)

  if (!collection) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1
          data-testid="collection-title"
          className="text-3xl font-bold text-zinc-900"
        >
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-2 text-zinc-600">{collection.description}</p>
        )}
      </div>

      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <CollectionProducts handle={handle} cursor={cursor} />
      </Suspense>
    </div>
  )
}
