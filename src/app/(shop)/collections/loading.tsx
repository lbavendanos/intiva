import { CollectionGridSkeleton } from '@/components/shop'

export default function CollectionsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-9 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="mt-2 h-5 w-80 animate-pulse rounded bg-zinc-200" />
      </div>
      <CollectionGridSkeleton count={6} />
    </div>
  )
}
