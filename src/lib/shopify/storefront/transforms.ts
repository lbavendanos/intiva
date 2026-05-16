import type { Connection, Money } from '../types'
import { extractNodesFromEdges } from '../utils'
import type { Cart, CartLineItem, ProductPricing } from './types'

export type CartResponse = Omit<Cart, 'lines'> & {
  lines: Connection<CartLineItem>
}

export function transformCart(cart: CartResponse): Cart {
  return {
    ...cart,
    lines: extractNodesFromEdges(cart.lines),
  }
}

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
