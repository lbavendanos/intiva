import 'server-only'

import { cookies } from 'next/headers'

export type OrdersView = 'gallery' | 'list'

export const ORDERS_VIEW_COOKIE = 'intiva.orders-view'
export const ORDERS_VIEW_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const DEFAULT: OrdersView = 'gallery'

export function isOrdersView(value: unknown): value is OrdersView {
  return value === 'gallery' || value === 'list'
}

export async function getOrdersView(): Promise<OrdersView> {
  const store = await cookies()
  const value = store.get(ORDERS_VIEW_COOKIE)?.value
  return isOrdersView(value) ? value : DEFAULT
}
