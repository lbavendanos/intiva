'use client'

import { useState, useTransition } from 'react'

import { setOrdersViewPreference } from '@/lib/actions/preferences'
import {
  ORDERS_VIEW_DEFAULT,
  type OrdersView,
} from '@/lib/preferences/orders-view'

export type { OrdersView }

export function useOrdersView(initialView: OrdersView = ORDERS_VIEW_DEFAULT): {
  view: OrdersView
  setView: (view: OrdersView) => void
} {
  const [view, setViewState] = useState<OrdersView>(initialView)
  const [, startTransition] = useTransition()

  const setView = (next: OrdersView) => {
    setViewState(next)
    startTransition(async () => {
      await setOrdersViewPreference(next)
    })
  }

  return { view, setView }
}
