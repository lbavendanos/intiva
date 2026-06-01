import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getOrders } from '@/lib/loaders/orders'
import { parseOrdersFilter } from '@/lib/orders/filter'
import { parseOrdersSort } from '@/lib/orders/sort'
import { getOrdersView, type OrdersView } from '@/lib/preferences/orders-view'
import { __ } from '@/lib/utils'
import { OrderGallerySkeleton } from '@/components/account/order-gallery'
import { OrderListSkeleton } from '@/components/account/order-list'
import { OrdersListing } from '@/components/account/orders-listing'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: __('orders.title'),
}

type OrdersSearchParams = {
  cursor?: string
  sortBy?: string
  interval?: string
  from?: string
  to?: string
}

type OrdersPageProps = {
  searchParams: Promise<OrdersSearchParams>
}

async function OrdersSection({ searchParams }: OrdersPageProps) {
  const initialView = await getOrdersView()

  return (
    <Suspense fallback={<OrdersListingSkeleton view={initialView} />}>
      <OrdersContent searchParams={searchParams} initialView={initialView} />
    </Suspense>
  )
}

async function OrdersContent({
  searchParams,
  initialView,
}: OrdersPageProps & { initialView: OrdersView }) {
  const { cursor, sortBy, interval, from, to } = await searchParams
  const sort = parseOrdersSort(sortBy)
  const filter = parseOrdersFilter({ interval, from, to })

  const result = await getOrders({ first: 10, after: cursor, sort, filter })

  if (!result) {
    return (
      <p className="text-center text-zinc-500">{__('account.error.generic')}</p>
    )
  }

  return (
    <OrdersListing
      orders={result.orders}
      pageInfo={result.pageInfo}
      initialView={initialView}
      sort={sort}
      filter={filter}
    />
  )
}

function OrdersHeaderSkeleton() {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-7 w-28" />
    </div>
  )
}

function OrdersListingSkeleton({ view }: { view: OrdersView }) {
  return (
    <div>
      <OrdersHeaderSkeleton />
      {view === 'gallery' ? <OrderGallerySkeleton /> : <OrderListSkeleton />}
    </div>
  )
}

export default function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <Suspense fallback={<OrdersHeaderSkeleton />}>
      <OrdersSection searchParams={searchParams} />
    </Suspense>
  )
}
