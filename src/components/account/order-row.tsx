'use client'

import Image from 'next/image'
import Link from 'next/link'
import { DotsThreeIcon } from '@phosphor-icons/react'

import { getOrderUrl } from '@/lib/domain/orders'
import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { DateTime } from '@/components/format/datetime'
import { Price } from '@/components/format/price'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { OrderStatusBadges } from './order-status-badges'

type OrderRowProps = {
  order: OrderListItem
}

export function OrderRow({ order }: OrderRowProps) {
  const orderUrl = getOrderUrl(order)
  const itemsLabel = __('orders.items_count', { count: order.lineItems.length })
  const [previewItem] = order.lineItems

  return (
    <div className="flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 sm:items-center">
      <Link
        href={orderUrl}
        className="flex flex-1 items-start gap-4 sm:items-center"
      >
        <div className="relative aspect-2/3 h-36 shrink-0 overflow-hidden rounded-lg bg-zinc-100 sm:h-20">
          {previewItem?.image ? (
            <Image
              src={previewItem.image.url}
              alt={previewItem.image.altText ?? previewItem.title}
              fill
              sizes="(min-width: 640px) 56px, 96px"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_1fr_auto] sm:gap-6">
          <div>
            <p className="font-semibold text-zinc-900">{order.name}</p>
            <p className="text-sm text-zinc-500">{itemsLabel}</p>
          </div>

          <div className="order-first flex flex-col items-start gap-1 sm:order-0">
            <div className="flex flex-wrap items-center gap-2">
              <OrderStatusBadges
                financialStatus={order.financialStatus}
                fulfillmentStatus={order.fulfillmentStatus}
              />
            </div>
            <DateTime
              value={order.processedAt}
              className="text-sm text-zinc-500"
            />
          </div>

          <Price
            value={order.totalPrice}
            className="font-medium text-zinc-900 sm:text-right"
          />
        </div>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={__('orders.actions_label')}
            >
              <DotsThreeIcon weight="bold" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem>{__('orders.buy_again')}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
