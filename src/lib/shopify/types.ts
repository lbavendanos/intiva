export type Maybe<T> = T | null

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: Maybe<string>
  endCursor: Maybe<string>
}

export interface Money {
  amount: string
  currencyCode: string
}

export interface Image {
  url: string
  altText: Maybe<string>
  width: Maybe<number>
  height: Maybe<number>
}

export interface SEO {
  title: Maybe<string>
  description: Maybe<string>
}

export interface SelectedOption {
  name: string
  value: string
}

export interface ProductOption {
  id: string
  name: string
  values: string[]
}

export interface ProductVariant {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: Maybe<number>
  selectedOptions: SelectedOption[]
  price: Money
  compareAtPrice: Maybe<Money>
  image: Maybe<Image>
}

export interface Product {
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
  images: Image[]
  options: ProductOption[]
  variants: ProductVariant[]
  featuredImage: Maybe<Image>
  tags: string[]
  productType: string
  vendor: string
  createdAt: string
  updatedAt: string
}

export interface Collection {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  image: Maybe<Image>
  seo: SEO
  products?: Product[]
}

export interface CartLineItem {
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

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  lines: CartLineItem[]
  cost: {
    subtotalAmount: Money
    totalAmount: Money
    totalTaxAmount: Maybe<Money>
  }
}

export interface CustomerAddress {
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

export interface Customer {
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

export interface CustomerAccessToken {
  accessToken: string
  expiresAt: string
}

export interface OrderLineItem {
  title: string
  quantity: number
  variant: Maybe<{
    id: string
    title: string
    price: Money
    image: Maybe<Image>
  }>
}

export interface Order {
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

export interface ShopifyError {
  message: string
  locations?: Array<{ line: number; column: number }>
  path?: string[]
  extensions?: Record<string, unknown>
}

export interface UserError {
  field: Maybe<string[]>
  message: string
  code?: string
}

export interface ShopifyResponse<T> {
  data?: T
  errors?: ShopifyError[]
}

export interface Connection<T> {
  edges: Array<{ node: T; cursor: string }>
  pageInfo: PageInfo
}
