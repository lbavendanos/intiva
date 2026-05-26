import type { Connection, Image, Maybe, Money } from '../types'
import { extractNodesFromEdges } from '../utils'
import type {
  Cart,
  CartLineItem,
  ProductColor,
  ProductColorSibling,
  ProductPricing,
  SelectedOption,
} from './types'

export type ColorMetafieldResponse = Maybe<{
  reference: Maybe<{
    id: string
    nameField: Maybe<{ value: Maybe<string> }>
    hexField: Maybe<{ value: Maybe<string> }>
  }>
}>

type ColorSiblingResponse = {
  id: string
  handle: string
  title: string
  availableForSale: boolean
  featuredImage: Maybe<Image>
  colorMetafield: ColorMetafieldResponse
}

export type ColorGroupMetafieldResponse = Maybe<{
  reference: Maybe<{
    id: string
    productsField: Maybe<{
      references: Connection<ColorSiblingResponse>
    }>
  }>
}>

type RawCartLineProduct = Omit<
  CartLineItem['merchandise']['product'],
  'color' | 'displayTitle'
> & {
  colorMetafield: ColorMetafieldResponse
}

type RawCartLineItem = Omit<CartLineItem, 'merchandise'> & {
  merchandise: {
    id: string
    title: string
    selectedOptions: SelectedOption[]
    product: RawCartLineProduct
    price: Money
    compareAtPrice: Maybe<Money>
  }
}

export type CartResponse = Omit<Cart, 'lines'> & {
  lines: Connection<RawCartLineItem>
}

export function parseProductColor(
  metafield: ColorMetafieldResponse,
): ProductColor | null {
  const reference = metafield?.reference
  if (!reference) return null

  const name = reference.nameField?.value
  const hex = reference.hexField?.value
  if (!name || !hex) return null

  return { name, hex }
}

export function parseProductColorSiblings(
  metafield: ColorGroupMetafieldResponse,
): ProductColorSibling[] {
  const references = metafield?.reference?.productsField?.references
  if (!references) return []

  return extractNodesFromEdges(references).flatMap((node) => {
    const color = parseProductColor(node.colorMetafield)
    if (!color) return []

    return [
      {
        id: node.id,
        handle: node.handle,
        title: node.title,
        availableForSale: node.availableForSale,
        featuredImage: node.featuredImage,
        color,
      },
    ]
  })
}

export function stripColorSuffix(title: string, colorName: string): string {
  const escaped = colorName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`\\s*[-–—|/]?\\s*${escaped}\\s*$`, 'i')
  const stripped = title.replace(pattern, '').trim()
  return stripped || title
}

function transformCartLine(line: RawCartLineItem): CartLineItem {
  const { colorMetafield, ...productRest } = line.merchandise.product
  const color = parseProductColor(colorMetafield)
  const displayTitle = color
    ? stripColorSuffix(productRest.title, color.name)
    : productRest.title

  return {
    ...line,
    merchandise: {
      ...line.merchandise,
      product: { ...productRest, color, displayTitle },
    },
  }
}

export function transformCart(cart: CartResponse): Cart {
  return {
    ...cart,
    lines: extractNodesFromEdges(cart.lines).map(transformCartLine),
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
  const isDiscounted =
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount)

  return {
    price,
    compareAtPrice: isDiscounted ? compareAtPrice : null,
  }
}
