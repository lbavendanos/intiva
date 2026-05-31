import Image from 'next/image'

import type { Order } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { DateTime } from '@/components/common/datetime'
import { Price } from '@/components/common/price'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { OrderBackButton } from './order-back-button'
import { OrderStatusBadges } from './order-status-badges'

type OrderDetailProps = {
  order: Order
}

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1">
        <OrderBackButton />
        <h1 className="text-2xl font-bold text-zinc-900">
          {__('orders.order_number', { number: order.name })}
        </h1>
        <div className="row-span-2 flex gap-2 self-center">
          <OrderStatusBadges
            financialStatus={order.financialStatus}
            fulfillmentStatus={order.fulfillmentStatus}
          />
        </div>
        <DateTime
          value={order.processedAt}
          className="col-start-2 text-sm text-zinc-500"
        />
      </header>

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
                  <div className="flex size-16 items-center justify-center rounded-md bg-zinc-100 text-xs text-zinc-400">
                    {__('cart.item.no_image')}
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-medium text-zinc-900">
                    {item.displayTitle}
                  </p>
                  {item.color && (
                    <p className="text-sm text-zinc-500">
                      {__('product.color')}: {item.color}
                    </p>
                  )}
                  {item.variantOptions.map((option) => (
                    <p key={option.name} className="text-sm text-zinc-500">
                      {option.name}: {option.value}
                    </p>
                  ))}
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
