import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getOrders } from '@/lib/loaders/orders'
import {
  getOrdersView,
  type OrdersView as OrdersViewType,
} from '@/lib/preferences/orders-view'
import { __ } from '@/lib/utils'
import { OrderGallerySkeleton } from '@/components/account/order-gallery'
import { OrderListSkeleton } from '@/components/account/order-list'
import { OrdersView } from '@/components/account/orders-view'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: __('orders.title'),
}

type OrdersPageProps = {
  searchParams: Promise<{ cursor?: string }>
}

async function OrdersSection({ searchParams }: OrdersPageProps) {
  const initialView = await getOrdersView()

  return (
    <Suspense fallback={<OrdersSkeleton view={initialView} />}>
      <OrdersContent searchParams={searchParams} initialView={initialView} />
    </Suspense>
  )
}

async function OrdersContent({
  searchParams,
  initialView,
}: {
  searchParams: Promise<{ cursor?: string }>
  initialView: OrdersViewType
}) {
  const { cursor } = await searchParams
  const result = await getOrders(10, cursor)

  if (!result) {
    return (
      <p className="text-center text-zinc-500">{__('account.error.generic')}</p>
    )
  }

  return (
    <OrdersView
      orders={result.orders}
      pageInfo={result.pageInfo}
      initialView={initialView}
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

function OrdersSkeleton({ view }: { view: OrdersViewType }) {
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
