'use server'

import { cookies } from 'next/headers'

import {
  isOrdersView,
  ORDERS_VIEW_COOKIE,
  ORDERS_VIEW_COOKIE_MAX_AGE,
  type OrdersView,
} from './orders-view'

export async function setOrdersView(view: OrdersView): Promise<void> {
  if (!isOrdersView(view)) return

  const store = await cookies()
  store.set({
    name: ORDERS_VIEW_COOKIE,
    value: view,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ORDERS_VIEW_COOKIE_MAX_AGE,
  })
}
