import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getProducts } from '@/lib/shopify/queries'
import { __ } from '@/lib/utils'
import { Pagination } from '@/components/shop/pagination'
import {
  ProductGrid,
  ProductGridSkeleton,
} from '@/components/shop/product-grid'

export const metadata: Metadata = {
  title: __('products.title'),
  description: __('products.description'),
}

type ProductsPageProps = {
  searchParams: Promise<{ cursor?: string }>
}

async function ProductList({ cursor }: { cursor?: string }) {
  const { products, pageInfo } = await getProducts(12, cursor)

  return (
    <>
      <ProductGrid products={products} />
      <Pagination pageInfo={pageInfo} basePath="/products" />
    </>
  )
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { cursor } = await searchParams

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          {__('products.title')}
        </h1>
        <p className="mt-2 text-zinc-600">{__('products.description')}</p>
      </div>

      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ProductList cursor={cursor} />
      </Suspense>
    </div>
  )
}
