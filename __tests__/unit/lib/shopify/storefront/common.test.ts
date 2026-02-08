import { describe, expect, it } from 'vitest'

import { computePricing } from '@/lib/shopify/storefront/common'

describe('computePricing', () => {
  it('should return hasDiscount true when compareAtPrice is greater than price', () => {
    const result = computePricing({
      priceRange: {
        minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      },
      compareAtPriceRange: {
        minVariantPrice: { amount: '39.99', currencyCode: 'USD' },
      },
    })

    expect(result.hasDiscount).toBe(true)
    expect(result.price).toEqual({ amount: '29.99', currencyCode: 'USD' })
    expect(result.compareAtPrice).toEqual({
      amount: '39.99',
      currencyCode: 'USD',
    })
  })

  it('should return hasDiscount false when compareAtPrice equals price', () => {
    const result = computePricing({
      priceRange: {
        minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      },
      compareAtPriceRange: {
        minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      },
    })

    expect(result.hasDiscount).toBe(false)
  })

  it('should return hasDiscount false when compareAtPrice is less than price', () => {
    const result = computePricing({
      priceRange: {
        minVariantPrice: { amount: '39.99', currencyCode: 'USD' },
      },
      compareAtPriceRange: {
        minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      },
    })

    expect(result.hasDiscount).toBe(false)
  })

  it('should return hasDiscount false when compareAtPrice is zero', () => {
    const result = computePricing({
      priceRange: {
        minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      },
      compareAtPriceRange: {
        minVariantPrice: { amount: '0.0', currencyCode: 'USD' },
      },
    })

    expect(result.hasDiscount).toBe(false)
  })
})
