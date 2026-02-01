import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import type { Order } from '@/lib/shopify/types'
import { __, cn } from '@/lib/utils'
import { DateTime } from '@/components/common/datetime'
import { PaymentBadge } from '@/components/common/payment-badge'
import { Price } from '@/components/common/price'
import { ShippingBadge } from '@/components/common/shipping-badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type OrderListProps = {
  orders: Order[]
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">{__('orders.empty')}</p>
          <Link
            href="/products"
            className="text-primary text-sm font-medium hover:underline"
          >
            {__('orders.explore_products')}
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

type OrderCardProps = {
  order: Order
  compact?: boolean
}

export function OrderCard({ order, compact = false }: OrderCardProps) {
  const totalItems = order.lineItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  return (
    <Card>
      <CardHeader className={cn(compact && 'pb-2')}>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">
              {__('orders.order_number', { number: order.orderNumber })}
            </CardTitle>
            <CardDescription>
              <DateTime as="span" value={order.processedAt} />
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PaymentBadge status={order.financialStatus} />
            <ShippingBadge status={order.fulfillmentStatus} />
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn(compact && 'pt-0')}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">
              {__('orders.items', { count: totalItems })}
            </p>
            <Price
              as="p"
              className="font-medium"
              amount={order.totalPrice.amount}
              currencyCode={order.totalPrice.currencyCode}
            />
          </div>
          <Link
            href={`/orders/${order.orderNumber}`}
            className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
          >
            {__('orders.view_details')}
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
