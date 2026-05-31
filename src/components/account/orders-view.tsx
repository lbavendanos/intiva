'use client'

import { useState, useTransition } from 'react'
import { CaretDownIcon, ListIcon, SquaresFourIcon } from '@phosphor-icons/react'

import type { OrdersView } from '@/lib/preferences/orders-view'
import { setOrdersView } from '@/lib/preferences/orders-view.actions'
import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import type { PageInfo } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'
import { Pagination } from '@/components/shop/pagination'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { OrderGallery } from './order-gallery'
import { OrderList } from './order-list'

type OrdersViewProps = {
  orders: OrderListItem[]
  pageInfo: PageInfo
  initialView: OrdersView
}

const VIEW_OPTIONS: ReadonlyArray<{
  value: OrdersView
  label: () => string
  Icon: typeof SquaresFourIcon
}> = [
  {
    value: 'gallery',
    label: () => __('orders.view_gallery'),
    Icon: SquaresFourIcon,
  },
  { value: 'list', label: () => __('orders.view_list'), Icon: ListIcon },
]

export function OrdersView({ orders, pageInfo, initialView }: OrdersViewProps) {
  const [view, setView] = useState<OrdersView>(initialView)
  const [, startTransition] = useTransition()
  const current = VIEW_OPTIONS.find((option) => option.value === view)!
  const CurrentIcon = current.Icon

  const handleViewChange = (next: OrdersView) => {
    setView(next)
    startTransition(() => setOrdersView(next))
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-zinc-900">
          {__('orders.title')}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                aria-label={__('orders.view_selector_label')}
              >
                <CurrentIcon data-icon="inline-start" />
                {current.label()}
                <CaretDownIcon data-icon="inline-end" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={view}
              onValueChange={(value) => handleViewChange(value as OrdersView)}
            >
              {VIEW_OPTIONS.map(({ value, label, Icon }) => (
                <DropdownMenuRadioItem key={value} value={value} closeOnClick>
                  <Icon />
                  {label()}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {view === 'gallery' ? (
        <OrderGallery orders={orders} />
      ) : (
        <OrderList orders={orders} />
      )}

      <Pagination pageInfo={pageInfo} basePath="/account/orders" />
    </div>
  )
}
