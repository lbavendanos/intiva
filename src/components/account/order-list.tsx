import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

import { OrderRow } from './order-row'

type OrderListProps = {
  orders: OrderListItem[]
}

type OrderListSkeletonProps = {
  count?: number
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return <p className="text-center text-zinc-500">{__('orders.empty')}</p>
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  )
}

export function OrderListSkeleton({ count = 3 }: OrderListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  )
}
