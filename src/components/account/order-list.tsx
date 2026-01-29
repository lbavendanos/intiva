import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import type { TranslationKeys } from '@/lib/foundation/translation/translator'
import type { Order } from '@/lib/shopify/types'
import { __, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(process.env.NEXT_PUBLIC_APP_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat(process.env.NEXT_PUBLIC_APP_LOCALE, {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount))
}

function getFinancialStatusVariant(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'default'
    case 'PENDING':
    case 'AUTHORIZED':
      return 'secondary'
    case 'REFUNDED':
    case 'PARTIALLY_REFUNDED':
    case 'VOIDED':
      return 'destructive'
    default:
      return 'outline'
  }
}

function getFulfillmentStatusVariant(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status.toUpperCase()) {
    case 'FULFILLED':
      return 'default'
    case 'IN_PROGRESS':
    case 'PARTIALLY_FULFILLED':
    case 'PENDING_FULFILLMENT':
      return 'secondary'
    case 'UNFULFILLED':
    case 'ON_HOLD':
      return 'outline'
    default:
      return 'outline'
  }
}

function getFinancialStatusLabel(status: string): string {
  const key =
    `orders.financial_status.${status.toLowerCase()}` as TranslationKeys
  return __(key)
}

function getFulfillmentStatusLabel(status: string): string {
  const key =
    `orders.fulfillment_status.${status.toLowerCase()}` as TranslationKeys
  return __(key)
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
            <CardDescription>{formatDate(order.processedAt)}</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getFinancialStatusVariant(order.financialStatus)}>
              {getFinancialStatusLabel(order.financialStatus)}
            </Badge>
            <Badge
              variant={getFulfillmentStatusVariant(order.fulfillmentStatus)}
            >
              {getFulfillmentStatusLabel(order.fulfillmentStatus)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn(compact && 'pt-0')}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">
              {__('orders.items', { count: totalItems })}
            </p>
            <p className="font-medium">
              {formatPrice(
                order.totalPrice.amount,
                order.totalPrice.currencyCode,
              )}
            </p>
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
