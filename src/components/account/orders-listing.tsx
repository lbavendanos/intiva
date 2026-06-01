'use client'

import { useState, useTransition } from 'react'

import { type OrdersFilter } from '@/lib/orders/filter'
import { type OrdersSort } from '@/lib/orders/sort'
import type { OrdersView } from '@/lib/preferences/orders-view'
import { setOrdersView } from '@/lib/preferences/orders-view.actions'
import type { OrderListItem } from '@/lib/shopify/customer-account/types'
import type { PageInfo } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'
import { Pagination } from '@/components/shop/pagination'

import { OrderGallery } from './order-gallery'
import { OrderList } from './order-list'
import { OrdersFilterMenu } from './orders-filter-menu'
import { OrdersSortMenu } from './orders-sort-menu'
import { OrdersViewMenu } from './orders-view-menu'

type OrdersListingProps = {
  orders: OrderListItem[]
  pageInfo: PageInfo
  initialView: OrdersView
  sort: OrdersSort | null
  filter: OrdersFilter | null
}

export function OrdersListing({
  orders,
  pageInfo,
  initialView,
  sort,
  filter,
}: OrdersListingProps) {
  const [view, setView] = useState<OrdersView>(initialView)
  const [, startTransition] = useTransition()

  const handleViewChange = (next: OrdersView) => {
    setView(next)
    startTransition(() => setOrdersView(next))
  }

  const paginationParams: Record<string, string> = {}
  if (sort) paginationParams.sortBy = sort
  if (filter?.interval === 'custom') {
    paginationParams.interval = 'custom'
    paginationParams.from = filter.from
    paginationParams.to = filter.to
  } else if (filter) {
    paginationParams.interval = filter.interval
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-zinc-900">
          {__('orders.title')}
        </h2>
        <div className="flex flex-wrap items-center gap-1">
          <OrdersFilterMenu value={filter} />
          <OrdersSortMenu value={sort} />
          <OrdersViewMenu value={view} onChange={handleViewChange} />
        </div>
      </div>

      {view === 'gallery' ? (
        <OrderGallery orders={orders} />
      ) : (
        <OrderList orders={orders} />
      )}

      <Pagination
        pageInfo={pageInfo}
        basePath="/account/orders"
        params={paginationParams}
      />
    </div>
  )
}
