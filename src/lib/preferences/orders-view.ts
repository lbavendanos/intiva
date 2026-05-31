export type OrdersView = 'gallery' | 'list'

export const ORDERS_VIEW_COOKIE = 'intiva.orders-view'
export const ORDERS_VIEW_DEFAULT: OrdersView = 'gallery'
export const ORDERS_VIEW_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function isOrdersView(value: unknown): value is OrdersView {
  return value === 'gallery' || value === 'list'
}
