import 'server-only'

import { cookies } from 'next/headers'

import {
  isOrdersView,
  ORDERS_VIEW_COOKIE,
  ORDERS_VIEW_DEFAULT,
  type OrdersView,
} from './orders-view'

export async function getOrdersViewPreference(): Promise<OrdersView> {
  const cookieStore = await cookies()
  const value = cookieStore.get(ORDERS_VIEW_COOKIE)?.value
  return isOrdersView(value) ? value : ORDERS_VIEW_DEFAULT
}
