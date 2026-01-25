import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getCollections } from '@/lib/shopify/queries'
import { __ } from '@/lib/utils'
import {
  CollectionGrid,
  CollectionGridSkeleton,
  Pagination,
} from '@/components/shop'

export const metadata: Metadata = {
  title: __('collections.title'),
  description: __('collections.description'),
}

interface CollectionsPageProps {
  searchParams: Promise<{ cursor?: string }>
}

async function CollectionList({ cursor }: { cursor?: string }) {
  const { collections, pageInfo } = await getCollections(12, cursor)

  return (
    <>
      <CollectionGrid collections={collections} />
      <Pagination pageInfo={pageInfo} basePath="/collections" />
    </>
  )
}

export default async function CollectionsPage({
  searchParams,
}: CollectionsPageProps) {
  const { cursor } = await searchParams

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          {__('collections.title')}
        </h1>
        <p className="mt-2 text-zinc-600">{__('collections.description')}</p>
      </div>

      <Suspense fallback={<CollectionGridSkeleton count={6} />}>
        <CollectionList cursor={cursor} />
      </Suspense>
    </div>
  )
}
