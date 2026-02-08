import Image from 'next/image'

import type { Order } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { DateTime } from '@/components/common/datetime'
import { Price } from '@/components/common/price'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type OrderDetailProps = {
  order: Order
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

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {__('orders.order_number', { number: order.name })}
          </h1>
          <DateTime
            value={order.processedAt}
            className="text-sm text-zinc-500"
          />
        </div>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{__('order.items')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.lineItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                {item.image ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText ?? item.title}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-zinc-100 text-xs text-zinc-400">
                    {__('cart.item.no_image')}
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  {item.variantTitle && (
                    <p className="text-sm text-zinc-500">{item.variantTitle}</p>
                  )}
                  <p className="text-sm text-zinc-500">
                    {__('order.quantity')}: {item.quantity}
                  </p>
                </div>

                {item.totalPrice && (
                  <Price
                    amount={item.totalPrice.amount}
                    currencyCode={item.totalPrice.currencyCode}
                    className="font-medium text-zinc-900"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {order.shippingAddress && (
          <Card>
            <CardHeader>
              <CardTitle>{__('order.shipping_address')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-zinc-600">
                {order.shippingAddress.formatted.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{__('order.summary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {order.subtotal && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">{__('order.subtotal')}</span>
                <Price
                  amount={order.subtotal.amount}
                  currencyCode={order.subtotal.currencyCode}
                />
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">{__('order.shipping')}</span>
              <Price
                amount={order.totalShipping.amount}
                currencyCode={order.totalShipping.currencyCode}
              />
            </div>
            {order.totalTax && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">{__('order.tax')}</span>
                <Price
                  amount={order.totalTax.amount}
                  currencyCode={order.totalTax.currencyCode}
                />
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-medium">
              <span>{__('order.total')}</span>
              <Price
                amount={order.totalPrice.amount}
                currencyCode={order.totalPrice.currencyCode}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
