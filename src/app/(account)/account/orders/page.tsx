import { Suspense } from 'react'
import type { Metadata } from 'next'

import { __ } from '@/lib/utils'
import { getOrders } from '@/actions/account'
import { OrderList } from '@/components/account/order-list'
import { Pagination } from '@/components/shop/pagination'
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
  const result = await getOrders(cursor)

  if (!result.success || !result.data) {
    return (
      <p className="text-center text-zinc-500">{__('account.error.generic')}</p>
    )
  }

  return (
    <>
      <OrderList orders={result.data.orders} />
      <Pagination pageInfo={result.data.pageInfo} basePath="/account/orders" />
    </>
  )
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  )
}

export default function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-zinc-900">
        {__('orders.title')}
      </h2>
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
