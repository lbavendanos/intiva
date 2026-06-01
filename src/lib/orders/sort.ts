export type OrdersSort =
  | 'newest'
  | 'oldest'
  | 'order_number_high'
  | 'order_number_low'
  | 'total_high'
  | 'total_low'

type ShopifyOrderSortKey = 'PROCESSED_AT' | 'ORDER_NUMBER' | 'TOTAL_PRICE'

export const ORDERS_SORT_VALUES: ReadonlyArray<OrdersSort> = [
  'newest',
  'oldest',
  'order_number_high',
  'order_number_low',
  'total_high',
  'total_low',
]

export function isOrdersSort(value: unknown): value is OrdersSort {
  return (
    typeof value === 'string' &&
    (ORDERS_SORT_VALUES as ReadonlyArray<string>).includes(value)
  )
}

export function parseOrdersSort(value: string | undefined): OrdersSort | null {
  return isOrdersSort(value) ? value : null
}

export function toShopifySort(sort: OrdersSort | null): {
  sortKey: ShopifyOrderSortKey
  reverse: boolean
} {
  switch (sort) {
    case 'oldest':
      return { sortKey: 'PROCESSED_AT', reverse: false }
    case 'order_number_high':
      return { sortKey: 'ORDER_NUMBER', reverse: true }
    case 'order_number_low':
      return { sortKey: 'ORDER_NUMBER', reverse: false }
    case 'total_high':
      return { sortKey: 'TOTAL_PRICE', reverse: true }
    case 'total_low':
      return { sortKey: 'TOTAL_PRICE', reverse: false }
    case 'newest':
    case null:
    default:
      return { sortKey: 'PROCESSED_AT', reverse: true }
  }
}
