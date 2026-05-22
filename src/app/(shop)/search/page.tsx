import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getSearchResults } from '@/lib/loaders/products'
import { __ } from '@/lib/utils'
import { Pagination } from '@/components/shop/pagination'
import {
  ProductGrid,
  ProductGridSkeleton,
} from '@/components/shop/product-grid'
import { SearchBar } from '@/components/shop/search-bar'

type SearchPageProps = {
  searchParams: Promise<{ q?: string; cursor?: string }>
}

const RESULTS_PER_PAGE = 12

export const metadata: Metadata = {
  title: __('search.title'),
  description: __('search.description'),
}

async function SearchBarWithQuery({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  // Keyed by the query so the uncontrolled input re-syncs with the URL when
  // the user navigates here with a different `?q=` (e.g. from the dialog).
  return <SearchBar key={query} initialQuery={query} />
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const { q, cursor } = await searchParams
  const query = q?.trim() ?? ''

  if (!query) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        {__('search.no_query')}
      </p>
    )
  }

  const { products, pageInfo, totalCount } = await getSearchResults(
    query,
    RESULTS_PER_PAGE,
    cursor,
  )

  if (products.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm">
        {__('search.empty', { query })}
      </p>
    )
  }

  return (
    <>
      <p className="mb-6 text-sm text-zinc-600">
        {__('search.results_count', { count: totalCount, query })}
      </p>
      <ProductGrid products={products} />
      <Pagination
        pageInfo={pageInfo}
        basePath="/search"
        params={{ q: query }}
      />
    </>
  )
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          {__('search.title')}
        </h1>
        <p className="mt-2 text-zinc-600">{__('search.description')}</p>
        <div className="mt-6 max-w-xl">
          <Suspense fallback={<SearchBar />}>
            <SearchBarWithQuery searchParams={searchParams} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<ProductGridSkeleton count={RESULTS_PER_PAGE} />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
