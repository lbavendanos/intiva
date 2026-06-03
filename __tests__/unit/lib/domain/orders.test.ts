import { describe, expect, it } from 'vitest'

import { buildCartLinesFromOrder } from '@/lib/domain/orders'
import type { OrderLineItem } from '@/lib/shopify/customer-account/types'

function lineItem(overrides: Partial<OrderLineItem> = {}): OrderLineItem {
  return {
    id: 'gid://shopify/LineItem/1',
    title: 'Sample product',
    name: 'Sample product',
    quantity: 1,
    variantId: 'gid://shopify/ProductVariant/1',
    image: null,
    price: null,
    variantTitle: null,
    variantOptions: [],
    totalPrice: null,
    displayTitle: 'Sample product',
    color: null,
    ...overrides,
  }
}

describe('buildCartLinesFromOrder', () => {
  it('maps line items to cart lines keyed by variant id', () => {
    const { lines, skipped } = buildCartLinesFromOrder([
      lineItem({ variantId: 'gid://shopify/ProductVariant/1', quantity: 2 }),
      lineItem({ variantId: 'gid://shopify/ProductVariant/2', quantity: 1 }),
    ])

    expect(skipped).toBe(0)
    expect(lines).toEqual([
      { merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 2 },
      { merchandiseId: 'gid://shopify/ProductVariant/2', quantity: 1 },
    ])
  })

  it('merges quantities when the same variant appears twice', () => {
    const { lines } = buildCartLinesFromOrder([
      lineItem({ variantId: 'gid://shopify/ProductVariant/1', quantity: 2 }),
      lineItem({ variantId: 'gid://shopify/ProductVariant/1', quantity: 3 }),
    ])

    expect(lines).toEqual([
      { merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 5 },
    ])
  })

  it('skips items whose variant no longer exists and counts them', () => {
    const { lines, skipped } = buildCartLinesFromOrder([
      lineItem({ variantId: 'gid://shopify/ProductVariant/1', quantity: 1 }),
      lineItem({ variantId: null, quantity: 4 }),
      lineItem({ variantId: null, quantity: 1 }),
    ])

    expect(skipped).toBe(2)
    expect(lines).toEqual([
      { merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 1 },
    ])
  })

  it('returns no lines when every variant is gone', () => {
    const { lines, skipped } = buildCartLinesFromOrder([
      lineItem({ variantId: null }),
      lineItem({ variantId: null }),
    ])

    expect(lines).toEqual([])
    expect(skipped).toBe(2)
  })

  it('normalizes a zero or negative quantity to at least one', () => {
    const { lines } = buildCartLinesFromOrder([
      lineItem({ variantId: 'gid://shopify/ProductVariant/1', quantity: 0 }),
    ])

    expect(lines).toEqual([
      { merchandiseId: 'gid://shopify/ProductVariant/1', quantity: 1 },
    ])
  })

  it('handles an empty order', () => {
    expect(buildCartLinesFromOrder([])).toEqual({ lines: [], skipped: 0 })
  })
})
