import { describe, expect, it } from 'vitest'

import { computePricing } from '@/lib/shopify/storefront/transforms'

describe('computePricing', () => {
  it('should return compareAtPrice when it is greater than price', () => {
    const result = computePricing({
      priceRange: {
        minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      },
      compareAtPriceRange: {
        minVariantPrice: { amount: '39.99', currencyCode: 'USD' },
      },
    })

    expect(result.price).toEqual({ amount: '29.99', currencyCode: 'USD' })
    expect(result.compareAtPrice).toEqual({
      amount: '39.99',
      currencyCode: 'USD',
    })
  })

  it('should return null compareAtPrice when it equals price', () => {
    const result = computePricing({
      priceRange: {
        minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      },
      compareAtPriceRange: {
        minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      },
    })

    expect(result.compareAtPrice).toBeNull()
  })

  it('should return null compareAtPrice when it is less than price', () => {
    const result = computePricing({
      priceRange: {
        minVariantPrice: { amount: '39.99', currencyCode: 'USD' },
      },
      compareAtPriceRange: {
        minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      },
    })

    expect(result.compareAtPrice).toBeNull()
  })

  it('should return null compareAtPrice when it is zero', () => {
    const result = computePricing({
      priceRange: {
        minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      },
      compareAtPriceRange: {
        minVariantPrice: { amount: '0.0', currencyCode: 'USD' },
      },
    })

    expect(result.compareAtPrice).toBeNull()
  })
})
