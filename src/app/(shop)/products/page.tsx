import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getProducts } from '@/lib/data/products'
import { __ } from '@/lib/utils'
import { Pagination } from '@/components/shop/pagination'
import {
  ProductGrid,
  ProductGridSkeleton,
} from '@/components/shop/product-grid'

type ProductsPageProps = {
  searchParams: Promise<{ cursor?: string }>
}

export const metadata: Metadata = {
  title: __('products.title'),
  description: __('products.description'),
}

async function ProductList({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string }>
}) {
  const { cursor } = await searchParams
  const { products, pageInfo } = await getProducts(12, cursor)

  return (
    <>
      <ProductGrid products={products} />
      <Pagination pageInfo={pageInfo} basePath="/products" />
    </>
  )
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          {__('products.title')}
        </h1>
        <p className="mt-2 text-zinc-600">{__('products.description')}</p>
      </div>

      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <ProductList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
