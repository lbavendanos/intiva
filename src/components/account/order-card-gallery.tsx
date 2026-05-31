'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import { __, cn } from '@/lib/utils'
import { DateTime } from '@/components/common/datetime'
import { Price } from '@/components/common/price'
import { Button } from '@/components/ui/button'

import { getOrderUrl, OrderStatusBadges } from './order-helpers'

type OrderCardGalleryProps = {
  order: OrderListItem
}

const MAX_PREVIEW_IMAGES = 4

export function OrderCardGallery({ order }: OrderCardGalleryProps) {
  const orderUrl = getOrderUrl(order)
  const previewItems = order.lineItems.slice(0, MAX_PREVIEW_IMAGES)
  const itemsLabel = __('orders.items_count', { count: order.lineItems.length })

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <Link href={orderUrl} className="block">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-zinc-50 px-5 py-4">
          <OrderStatusBadges
            financialStatus={order.financialStatus}
            fulfillmentStatus={order.fulfillmentStatus}
          />
          <DateTime
            value={order.processedAt}
            className="text-sm text-zinc-600"
          />
        </div>

        <div
          className={cn(
            'grid gap-px bg-zinc-100',
            previewItems.length === 1 && 'grid-cols-1',
            previewItems.length === 2 && 'grid-cols-2',
            previewItems.length >= 3 && 'grid-cols-2 grid-rows-2',
          )}
        >
          {previewItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-3/4 overflow-hidden bg-zinc-100"
            >
              {item.image ? (
                <Image
                  src={item.image.url}
                  alt={item.image.altText ?? item.title}
                  fill
                  sizes="(min-width: 768px) 320px, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                  {__('cart.item.no_image')}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3 px-5 pt-5">
          <div>
            <p className="font-semibold text-zinc-900">{itemsLabel}</p>
            <p className="text-sm text-zinc-500">
              {__('orders.order_number', { number: order.name })}
            </p>
          </div>
          <Price
            amount={order.totalPrice.amount}
            currencyCode={order.totalPrice.currencyCode}
            className="block text-base font-semibold text-zinc-900"
          />
        </div>
      </Link>

      <div className="px-5 pt-4 pb-5">
        <Button variant="outline" className="w-full" type="button">
          {__('orders.buy_again')}
        </Button>
      </div>
    </div>
  )
}
