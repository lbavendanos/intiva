'use client'

import Image from 'next/image'
import Link from 'next/link'

import { getOrderUrl } from '@/lib/domain/orders'
import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { DateTime } from '@/components/format/datetime'
import { Price } from '@/components/format/price'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import { OrderStatusBadges } from './order-status-badges'

type OrderCardProps = {
  order: OrderListItem
}

export function OrderCard({ order }: OrderCardProps) {
  const orderUrl = getOrderUrl(order)
  const itemsLabel = __('orders.items_count', { count: order.lineItems.length })
  const hasMultiple = order.lineItems.length > 1

  return (
    <div className="flex flex-col gap-y-5 rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:bg-zinc-50">
      <Link href={orderUrl} className="flex flex-col items-start gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadges
            financialStatus={order.financialStatus}
            fulfillmentStatus={order.fulfillmentStatus}
          />
        </div>
        <DateTime value={order.processedAt} className="text-sm text-zinc-600" />
      </Link>

      <Carousel
        opts={{ loop: hasMultiple, watchDrag: hasMultiple }}
        className="overflow-hidden rounded-lg"
      >
        <CarouselContent className="ml-0">
          {order.lineItems.map((item) => (
            <CarouselItem key={item.id} className="basis-full pl-0">
              <Link
                href={orderUrl}
                className="relative block aspect-2/3 bg-zinc-100"
              >
                {item.image ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText ?? item.title}
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 360px, 90vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                    {__('cart.item.no_image')}
                  </div>
                )}
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {hasMultiple && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      <Link href={orderUrl} className="space-y-3">
        <div className="flex flex-col">
          <p className="font-semibold text-zinc-900">{itemsLabel}</p>
          <p className="text-sm text-zinc-500">
            {__('orders.order_number', { number: order.name })}
          </p>
        </div>
        <Price
          value={order.totalPrice}
          className="block text-base font-semibold text-zinc-900"
        />
      </Link>

      <Button variant="outline" className="w-full" type="button">
        {__('orders.buy_again')}
      </Button>
    </div>
  )
}
