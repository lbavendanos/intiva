import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getOrders } from '@/lib/loaders/orders'
import { __ } from '@/lib/utils'
import { OrdersView } from '@/components/account/orders-view'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: __('orders.title'),
}

type OrdersPageProps = {
  searchParams: Promise<{ cursor?: string }>
}

async function OrdersContent({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string }>
}) {
  const { cursor } = await searchParams
  const result = await getOrders(10, cursor)

  if (!result) {
    return (
      <p className="text-center text-zinc-500">{__('account.error.generic')}</p>
    )
  }

  return <OrdersView orders={result.orders} pageInfo={result.pageInfo} />
}

function OrdersSkeleton() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-7 w-28" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-96 w-full" />
        ))}
      </div>
    </div>
  )
}

export default function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersContent searchParams={searchParams} />
    </Suspense>
  )
}
