import type { Money } from '../types'
import type { ProductPricing } from './types'

export function computePricing({
  priceRange,
  compareAtPriceRange,
}: {
  priceRange: { minVariantPrice: Money }
  compareAtPriceRange: { minVariantPrice: Money }
}): ProductPricing {
  const price = priceRange.minVariantPrice
  const compareAtPrice = compareAtPriceRange.minVariantPrice
  const hasDiscount =
    compareAtPrice != null &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  return { price, compareAtPrice, hasDiscount }
}
