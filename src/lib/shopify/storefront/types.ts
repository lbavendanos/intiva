import type { Image, Maybe, Money, SEO, UserError } from '../types'

export type SelectedOption = {
  name: string
  value: string
}

export type ProductOption = {
  id: string
  name: string
  values: string[]
}

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: Maybe<number>
  selectedOptions: SelectedOption[]
  price: Money
  compareAtPrice: Maybe<Money>
  image: Maybe<Image>
}

/** Derived pricing fields computed from Shopify price ranges */
export type ProductPricing = {
  price: Money
  compareAtPrice: Money
  hasDiscount: boolean
}

export type Product = {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  availableForSale: boolean
  seo: SEO
  priceRange: {
    minVariantPrice: Money
    maxVariantPrice: Money
  }
  compareAtPriceRange: {
    minVariantPrice: Money
    maxVariantPrice: Money
  }
  images: Image[]
  options: ProductOption[]
  variants: ProductVariant[]
  featuredImage: Maybe<Image>
  tags: string[]
  productType: string
  vendor: string
  createdAt: string
  updatedAt: string
} & ProductPricing

export type ProductListItem = {
  id: string
  title: string
  handle: string
  availableForSale: boolean
  priceRange: {
    minVariantPrice: Money
  }
  compareAtPriceRange: {
    minVariantPrice: Money
  }
  featuredImage: Image | null
} & ProductPricing

export type ProductRecommendationIntent = 'RELATED' | 'COMPLEMENTARY'

export type Collection = {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  image: Maybe<Image>
  seo: SEO
  products?: Product[]
}

export type CollectionListItem = {
  id: string
  title: string
  handle: string
  description: string
  image: Image | null
}

export type CartLineItem = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    selectedOptions: SelectedOption[]
    product: {
      id: string
      title: string
      handle: string
      featuredImage: Maybe<Image>
    }
    price: Money
    compareAtPrice: Maybe<Money>
  }
  cost: {
    totalAmount: Money
    amountPerQuantity: Money
    compareAtAmountPerQuantity: Maybe<Money>
  }
}

export type Cart = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: CartLineItem[]
  cost: {
    subtotalAmount: Money
    totalAmount: Money
  }
}

export type CartUserError = UserError & {
  code?: string
}
