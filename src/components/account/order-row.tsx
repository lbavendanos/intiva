'use client'

import Image from 'next/image'
import Link from 'next/link'
import { DotsThreeIcon } from '@phosphor-icons/react'

import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import { __, cn } from '@/lib/utils'
import { DateTime } from '@/components/common/datetime'
import { Price } from '@/components/common/price'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { OrderStatusBadges } from './order-status-badges'
import { getOrderUrl } from './order-utils'

type OrderRowProps = {
  order: OrderListItem
}

const MAX_PREVIEW_IMAGES = 2

export function OrderRow({ order }: OrderRowProps) {
  const orderUrl = getOrderUrl(order)
  const previewItems = order.lineItems.slice(0, MAX_PREVIEW_IMAGES)
  const itemsLabel = __('orders.items_count', { count: order.lineItems.length })

  return (
    <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50">
      <Link href={orderUrl} className="flex flex-1 items-center gap-4">
        <div
          className={cn(
            'grid h-16 shrink-0 gap-px overflow-hidden rounded-md bg-zinc-100',
            previewItems.length <= 1 ? 'w-16 grid-cols-1' : 'w-24 grid-cols-2',
          )}
        >
          {previewItems.map((item) => (
            <div
              key={item.id}
              className="relative h-full overflow-hidden bg-zinc-100"
            >
              {item.image ? (
                <Image
                  src={item.image.url}
                  alt={item.image.altText ?? item.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_1fr_auto] sm:gap-6">
          <div>
            <p className="font-semibold text-zinc-900">{order.name}</p>
            <p className="text-sm text-zinc-500">{itemsLabel}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <OrderStatusBadges
              financialStatus={order.financialStatus}
              fulfillmentStatus={order.fulfillmentStatus}
            />
            <DateTime
              value={order.processedAt}
              className="text-sm text-zinc-500"
            />
          </div>

          <Price
            amount={order.totalPrice.amount}
            currencyCode={order.totalPrice.currencyCode}
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
