import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import type { TranslationKeys } from '@/lib/foundation/translation/translator'
import type { Order } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type OrderDetailProps = {
  order: Order
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(process.env.NEXT_PUBLIC_APP_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

export function OrderDetail({ order }: OrderDetailProps) {
  const currencyCode = order.totalPrice.currencyCode

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/orders"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
          <span className="sr-only">{__('order.back_to_orders')}</span>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {__('order.title', { number: order.orderNumber })}
          </h1>
          <p className="text-muted-foreground text-sm">
            {__('order.placed_on', { date: formatDate(order.processedAt) })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getFinancialStatusVariant(order.financialStatus)}>
            {getFinancialStatusLabel(order.financialStatus)}
          </Badge>
          <Badge variant={getFulfillmentStatusVariant(order.fulfillmentStatus)}>
            {getFulfillmentStatusLabel(order.fulfillmentStatus)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{__('order.summary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="hidden border-b pb-3 sm:grid sm:grid-cols-12 sm:gap-4">
                  <div className="text-muted-foreground col-span-6 text-sm font-medium">
                    {__('order.product')}
                  </div>
                  <div className="text-muted-foreground col-span-2 text-center text-sm font-medium">
                    {__('order.quantity')}
                  </div>
                  <div className="text-muted-foreground col-span-4 text-right text-sm font-medium">
                    {__('order.price')}
                  </div>
                </div>

                {order.lineItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-4 border-b pb-4 last:border-0 last:pb-0 sm:grid-cols-12"
                  >
                    <div className="col-span-6 flex gap-4">
                      {item.variant?.image ? (
                        <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={item.variant.image.url}
                            alt={item.variant.image.altText || item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-md">
                          <span className="text-muted-foreground text-xs">
                            {__('cart.item.no_image')}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{item.title}</p>
                        {item.variant?.title &&
                          item.variant.title !== 'Default Title' && (
                            <p className="text-muted-foreground text-sm">
                              {item.variant.title}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-muted-foreground sm:hidden">
                        {__('order.quantity')}:{' '}
                      </span>
                      {item.quantity}
                    </div>
                    <div className="col-span-4 flex items-center justify-end">
                      {item.variant?.price &&
                        formatPrice(item.variant.price.amount, currencyCode)}
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {__('order.subtotal')}
                    </span>
                    <span>
                      {formatPrice(order.subtotalPrice.amount, currencyCode)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {__('order.shipping')}
                    </span>
                    <span>
                      {formatPrice(
                        order.totalShippingPrice.amount,
                        currencyCode,
                      )}
                    </span>
                  </div>
                  {order.totalTax && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {__('order.tax')}
                      </span>
                      <span>
                        {formatPrice(order.totalTax.amount, currencyCode)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>{__('order.total')}</span>
                    <span>
                      {formatPrice(order.totalPrice.amount, currencyCode)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{__('order.shipping_address')}</CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingAddress ? (
                <address className="text-muted-foreground not-italic">
                  <p className="text-foreground font-medium">
                    {order.shippingAddress.firstName}{' '}
                    {order.shippingAddress.lastName}
                  </p>
                  {order.shippingAddress.company && (
                    <p>{order.shippingAddress.company}</p>
                  )}
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && (
                    <p>{order.shippingAddress.address2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.province} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-2">{order.shippingAddress.phone}</p>
                  )}
                </address>
              ) : (
                <p className="text-muted-foreground">
                  {__('order.no_shipping_address')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
