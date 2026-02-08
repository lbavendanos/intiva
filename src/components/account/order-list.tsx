import Link from 'next/link'

import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { DateTime } from '@/components/common/datetime'
import { Price } from '@/components/common/price'
import { Badge } from '@/components/ui/badge'

type OrderListProps = {
  orders: OrderListItem[]
}

function getStatusVariant(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'PAID':
    case 'FULFILLED':
      return 'default'
    case 'PARTIALLY_PAID':
    case 'PARTIALLY_FULFILLED':
    case 'IN_PROGRESS':
      return 'secondary'
    case 'REFUNDED':
    case 'VOIDED':
      return 'destructive'
    default:
      return 'outline'
  }
}

function formatStatus(status: string): string {
  const key = `order.status.${status.toLowerCase()}` as Parameters<typeof __>[0]
  return __(key)
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return <p className="text-center text-zinc-500">{__('orders.empty')}</p>
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${encodeURIComponent(order.id)}`}
          className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50"
        >
          <div className="space-y-1">
            <p className="font-medium text-zinc-900">{order.name}</p>
            <DateTime
              value={order.processedAt}
              className="text-sm text-zinc-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {order.financialStatus && (
                <Badge variant={getStatusVariant(order.financialStatus)}>
                  {formatStatus(order.financialStatus)}
                </Badge>
              )}
              <Badge variant={getStatusVariant(order.fulfillmentStatus)}>
                {formatStatus(order.fulfillmentStatus)}
              </Badge>
            </div>
            <Price
              amount={order.totalPrice.amount}
              currencyCode={order.totalPrice.currencyCode}
              className="font-medium text-zinc-900"
            />
          </div>
        </Link>
      ))}
    </div>
  )
}
