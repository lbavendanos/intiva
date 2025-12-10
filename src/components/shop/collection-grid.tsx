import type { CollectionCardData } from '@/lib/shopify/queries'

import { CollectionCard } from './collection-card'
import { CollectionCardSkeleton } from './collection-card-skeleton'

interface CollectionGridProps {
  collections: CollectionCardData[]
}

export function CollectionGrid({ collections }: CollectionGridProps) {
  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-zinc-500">No se encontraron colecciones</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  )
}

interface CollectionGridSkeletonProps {
  count?: number
}

export function CollectionGridSkeleton({
  count = 6,
}: CollectionGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <CollectionCardSkeleton key={index} />
      ))}
    </div>
  )
}
