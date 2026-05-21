import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  getCollectionByHandle,
  getCollectionProducts,
} from '@/lib/loaders/collections'
import { __ } from '@/lib/utils'
import { Pagination } from '@/components/shop/pagination'
import {
  ProductGrid,
  ProductGridSkeleton,
} from '@/components/shop/product-grid'
import { Skeleton } from '@/components/ui/skeleton'

type CollectionPageProps = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ cursor?: string }>
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollectionByHandle(handle)

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

function CollectionHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-2 h-5 w-full max-w-lg" />
    </div>
  )
}

async function CollectionHeader({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const collection = await getCollectionByHandle(handle)

  if (!collection) {
    notFound()
  }

  return (
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
  )
}

async function CollectionProducts({
  params,
  searchParams,
}: CollectionPageProps) {
  const [{ handle }, { cursor }] = await Promise.all([params, searchParams])
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

export default function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<CollectionHeaderSkeleton />}>
        <CollectionHeader params={params} />
      </Suspense>
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <CollectionProducts params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
