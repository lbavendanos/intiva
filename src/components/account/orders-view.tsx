'use client'

import { CaretDownIcon, ListIcon, SquaresFourIcon } from '@phosphor-icons/react'

import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import type { PageInfo } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'
import { useOrdersView, type OrdersView } from '@/hooks/use-orders-view'
import { Pagination } from '@/components/shop/pagination'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { OrderCardGallery } from './order-card-gallery'
import { OrderList } from './order-list'

type OrdersViewProps = {
  orders: OrderListItem[]
  pageInfo: PageInfo
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

export function OrdersView({ orders, pageInfo }: OrdersViewProps) {
  const { view, setView } = useOrdersView()
  const current = VIEW_OPTIONS.find((option) => option.value === view)!
  const CurrentIcon = current.Icon

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
              onValueChange={(value) => setView(value as OrdersView)}
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

      {orders.length === 0 ? (
        <p className="text-center text-zinc-500">{__('orders.empty')}</p>
      ) : view === 'gallery' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCardGallery key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <OrderList orders={orders} />
      )}

      <Pagination pageInfo={pageInfo} basePath="/account/orders" />
    </div>
  )
}
