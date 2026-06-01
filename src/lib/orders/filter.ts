export type OrdersInterval =
  | 'today'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'last_12_months'
  | 'custom'

export type OrdersFilter =
  | { interval: Exclude<OrdersInterval, 'custom'> }
  | { interval: 'custom'; from: string; to: string }

export const ORDERS_INTERVAL_VALUES: ReadonlyArray<OrdersInterval> = [
  'today',
  'last_7_days',
  'last_30_days',
  'last_90_days',
  'last_12_months',
  'custom',
]

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function isOrdersInterval(value: unknown): value is OrdersInterval {
  return (
    typeof value === 'string' &&
    (ORDERS_INTERVAL_VALUES as ReadonlyArray<string>).includes(value)
  )
}

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime())
}

export function parseOrdersFilter({
  interval,
  from,
  to,
}: {
  interval: string | undefined
  from: string | undefined
  to: string | undefined
}): OrdersFilter | null {
  if (!isOrdersInterval(interval)) return null
  if (interval === 'custom') {
    if (!isIsoDate(from) || !isIsoDate(to)) return null
    if (from > to) return null
    return { interval, from, to }
  }
  return { interval }
}

export function toShopifyOrdersQuery(
  filter: OrdersFilter | null,
): string | undefined {
  if (!filter) return undefined

  if (filter.interval === 'custom') {
    return `processed_at:>=${filter.from} AND processed_at:<=${filter.to}`
  }

  const since = computeIntervalStart(filter.interval)
  return `processed_at:>=${since}`
}

function computeIntervalStart(
  interval: Exclude<OrdersInterval, 'custom'>,
): string {
  const now = new Date()
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )

  switch (interval) {
    case 'today':
      return toIsoDate(start)
    case 'last_7_days':
      start.setUTCDate(start.getUTCDate() - 6)
      return toIsoDate(start)
    case 'last_30_days':
      start.setUTCDate(start.getUTCDate() - 29)
      return toIsoDate(start)
    case 'last_90_days':
      start.setUTCDate(start.getUTCDate() - 89)
      return toIsoDate(start)
    case 'last_12_months':
      start.setUTCMonth(start.getUTCMonth() - 12)
      return toIsoDate(start)
  }
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
