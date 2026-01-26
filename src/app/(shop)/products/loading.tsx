import { ProductGridSkeleton } from '@/components/shop/product-grid'

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-9 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="mt-2 h-5 w-96 animate-pulse rounded bg-zinc-200" />
      </div>
      <ProductGridSkeleton count={12} />
    </div>
  )
}
