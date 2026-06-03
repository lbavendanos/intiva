import Image from 'next/image'

import type { Order, OrderLineItem } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { DateTime } from '@/components/format/datetime'
import { Price } from '@/components/format/price'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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

type OrderLineItemRowProps = {
  item: OrderLineItem
}

function OrderInfoSection({ title, children }: OrderInfoSectionProps) {
  return (
    <section className="space-y-1.5">
      <h3 className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
        {title}
      </h3>
      <div className="space-y-0.5 text-sm text-zinc-700">{children}</div>
    </section>
  )
}

function OrderLineItemRow({ item }: OrderLineItemRowProps) {
  return (
    <li className="flex gap-4 py-4 first:pt-0 last:pb-0">
      <div className="relative aspect-2/3 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-100">
        {item.image ? (
          <Image
            src={item.image.url}
            alt={item.image.altText ?? item.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-center text-xs text-zinc-400">
            {__('cart.item.no_image')}
          </div>
        )}
      </div>

      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-900">
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
            {__('order.quantity')}:{' '}
            <span className="font-medium text-zinc-900">{item.quantity}</span>
          </p>
        </div>

        {item.totalPrice && (
          <div className="text-right">
            <Price
              value={item.totalPrice}
              className="text-sm font-medium whitespace-nowrap text-zinc-900"
            />
            {item.quantity > 1 && item.price && (
              <p className="text-xs whitespace-nowrap text-zinc-400">
                <Price value={item.price} /> {__('order.price_each')}
              </p>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

export function OrderDetail({ order }: OrderDetailProps) {
  const itemCount = order.lineItems.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1">
        <OrderBackButton />
        <h1 className="text-2xl font-bold text-zinc-900">
          {__('orders.order_number', { number: order.name })}
        </h1>
        <Button
          type="button"
          variant="outline"
          className="row-span-2 self-center"
        >
          {__('orders.buy_again')}
        </Button>
        <DateTime
          value={order.processedAt}
          className="col-start-2 text-sm text-zinc-500"
        />
      </header>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <Card className="lg:col-span-2 lg:row-start-1">
          <CardHeader className="border-b">
            <CardTitle className="text-base">{__('order.items')}</CardTitle>
            <CardDescription>
              {__('orders.items_count', { count: itemCount })}
            </CardDescription>
            <CardAction className="flex items-center gap-2 self-center">
              <OrderStatusBadges
                financialStatus={order.financialStatus}
                fulfillmentStatus={order.fulfillmentStatus}
              />
            </CardAction>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-zinc-100">
              {order.lineItems.map((item) => (
                <OrderLineItemRow key={item.id} item={item} />
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:sticky lg:top-6 lg:col-start-3 lg:row-start-1">
          <CardHeader className="border-b">
            <CardTitle className="text-base">{__('order.summary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.subtotal && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">{__('order.subtotal')}</span>
                <Price value={order.subtotal} className="text-zinc-900" />
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">{__('order.shipping')}</span>
              <Price value={order.totalShipping} className="text-zinc-900" />
            </div>
            {order.totalTax && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">{__('order.tax')}</span>
                <Price value={order.totalTax} className="text-zinc-900" />
              </div>
            )}
            <Separator />
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-base font-semibold text-zinc-900">
                {__('order.total')}
              </span>
              <Price
                value={order.totalPrice}
                className="text-xl font-bold text-zinc-900"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 lg:row-start-2">
          <CardContent className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <OrderInfoSection title={__('order.contact_information')}>
              {order.contactName && (
                <p className="font-medium text-zinc-900">{order.contactName}</p>
              )}
              {order.email && <p>{order.email}</p>}
            </OrderInfoSection>

            {order.payment && (
              <OrderInfoSection title={__('order.payment')}>
                {order.payment.brand && (
                  <p className="font-medium text-zinc-900">
                    {order.payment.last4
                      ? __('order.payment_card', {
                          brand: order.payment.brand,
                          last4: order.payment.last4,
                        })
                      : order.payment.brand}
                  </p>
                )}
                {order.payment.amount && (
                  <Price as="p" value={order.payment.amount} />
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
      </div>
    </div>
  )
}
