export type Maybe<T> = T | null

export type PageInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: Maybe<string>
  endCursor: Maybe<string>
}

export type Money = {
  amount: string
  currencyCode: string
}

export type Image = {
  url: string
  altText: Maybe<string>
  width: Maybe<number>
  height: Maybe<number>
}

export type SEO = {
  title: Maybe<string>
  description: Maybe<string>
}

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

export type CustomerAddress = {
  id: string
  firstName: Maybe<string>
  lastName: Maybe<string>
  company: Maybe<string>
  address1: Maybe<string>
  address2: Maybe<string>
  city: Maybe<string>
  province: Maybe<string>
  provinceCode: Maybe<string>
  country: Maybe<string>
  countryCodeV2: Maybe<string>
  zip: Maybe<string>
  phone: Maybe<string>
}

export type Customer = {
  id: string
  email: string
  firstName: Maybe<string>
  lastName: Maybe<string>
  displayName: string
  phone: Maybe<string>
  acceptsMarketing: boolean
  defaultAddress: Maybe<CustomerAddress>
  addresses: CustomerAddress[]
  createdAt: string
  updatedAt: string
}

export type CustomerAccessToken = {
  accessToken: string
  expiresAt: string
}

export type OrderLineItem = {
  title: string
  quantity: number
  variant: Maybe<{
    id: string
    title: string
    price: Money
    image: Maybe<Image>
  }>
}

export type Order = {
  id: string
  orderNumber: number
  name: string
  processedAt: string
  financialStatus: string
  fulfillmentStatus: string
  totalPrice: Money
  subtotalPrice: Money
  totalTax: Maybe<Money>
  totalShippingPrice: Money
  lineItems: OrderLineItem[]
  shippingAddress: Maybe<CustomerAddress>
}

export type ShopifyError = {
  message: string
  locations?: Array<{ line: number; column: number }>
  path?: string[]
  extensions?: Record<string, unknown>
}

export type UserError = {
  field: Maybe<string[]>
  message: string
  code?: string
}

export type ShopifyResponse<T> = {
  data?: T
  errors?: ShopifyError[]
}

export type Connection<T> = {
  edges: Array<{ node: T; cursor: string }>
  pageInfo: PageInfo
}
