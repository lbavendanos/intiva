import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'

import { OrderCard } from './order-card'

type OrderGalleryProps = {
  orders: OrderListItem[]
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
