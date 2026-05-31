import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'

import { OrderRowList } from './order-row-list'

type OrderListProps = {
  orders: OrderListItem[]
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return <p className="text-center text-zinc-500">{__('orders.empty')}</p>
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderRowList key={order.id} order={order} />
      ))}
    </div>
  )
}
