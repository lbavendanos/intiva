import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

import { OrderCard } from './order-card'

type OrderGalleryProps = {
  orders: OrderListItem[]
}

type OrderGallerySkeletonProps = {
  count?: number
}

export function OrderGallery({ orders }: OrderGalleryProps) {
  if (orders.length === 0) {
    return <p className="text-center text-zinc-500">{__('orders.empty')}</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

export function OrderGallerySkeleton({ count = 3 }: OrderGallerySkeletonProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-96 w-full" />
      ))}
    </div>
  )
}
