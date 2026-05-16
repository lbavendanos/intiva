import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getCollections } from '@/lib/data/collections'
import { __ } from '@/lib/utils'
import {
  CollectionGrid,
  CollectionGridSkeleton,
} from '@/components/shop/collection-grid'
import { Pagination } from '@/components/shop/pagination'

type CollectionsPageProps = {
  searchParams: Promise<{ cursor?: string }>
}

export const metadata: Metadata = {
  title: __('collections.title'),
  description: __('collections.description'),
}

async function CollectionList({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string }>
}) {
  const { cursor } = await searchParams
  const { collections, pageInfo } = await getCollections(12, cursor)

  return (
    <>
      <CollectionGrid collections={collections} />
      <Pagination pageInfo={pageInfo} basePath="/collections" />
    </>
  )
}

export default function CollectionsPage({
  searchParams,
}: CollectionsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          {__('collections.title')}
        </h1>
        <p className="mt-2 text-zinc-600">{__('collections.description')}</p>
      </div>

      <Suspense fallback={<CollectionGridSkeleton count={6} />}>
        <CollectionList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
