import Image from 'next/image'

import type { Order } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { DateTime } from '@/components/format/datetime'
import { Price } from '@/components/format/price'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { OrderBackButton } from './order-back-button'
import { OrderStatusBadges } from './order-status-badges'

type OrderDetailProps = {
  order: Order
}

type OrderInfoSectionProps = {
  title: string
  children: React.ReactNode
}

function OrderInfoSection({ title, children }: OrderInfoSectionProps) {
  return (
    <section>
      <h2 className="font-heading mb-2 text-sm font-medium text-zinc-900">
        {title}
      </h2>
      <div className="space-y-0.5 text-sm text-zinc-600">{children}</div>
    </section>
  )
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
                    value={item.totalPrice}
                    className="font-medium text-zinc-900"
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-x-8 gap-y-6 md:grid-cols-2">
          <OrderInfoSection title={__('order.contact_information')}>
            {order.contactName && <p>{order.contactName}</p>}
            {order.email && <p>{order.email}</p>}
          </OrderInfoSection>

          {order.payment && (
            <OrderInfoSection title={__('order.payment')}>
              {order.payment.brand && (
                <p>
                  {order.payment.last4
                    ? __('order.payment_card', {
                        brand: order.payment.brand,
                        last4: order.payment.last4,
                      })
                    : order.payment.brand}
                </p>
              )}
              {order.payment.amount && (
                <Price
                  as="p"
                  value={order.payment.amount}
                  className="text-zinc-500"
                />
              )}
              {order.payment.processedAt && (
                <DateTime
                  as="p"
                  value={order.payment.processedAt}
                  format={{ month: 'short', day: 'numeric' }}
                  className="text-zinc-500"
                />
              )}
            </OrderInfoSection>
          )}

          {order.shippingAddress && (
            <OrderInfoSection title={__('order.shipping_address')}>
              {order.shippingAddress.formatted.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </OrderInfoSection>
          )}

          {order.billingAddress && (
            <OrderInfoSection title={__('order.billing_address')}>
              {order.billingAddress.formatted.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </OrderInfoSection>
          )}

          {order.shippingLine && (
            <OrderInfoSection title={__('order.shipping_method')}>
              <p>{order.shippingLine.title}</p>
            </OrderInfoSection>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{__('order.summary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {order.subtotal && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">{__('order.subtotal')}</span>
                <Price value={order.subtotal} />
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">{__('order.shipping')}</span>
              <Price value={order.totalShipping} />
            </div>
            {order.totalTax && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">{__('order.tax')}</span>
                <Price value={order.totalTax} />
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-medium">
              <span>{__('order.total')}</span>
              <Price value={order.totalPrice} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
