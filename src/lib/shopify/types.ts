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

export type ShopifyError = {
  message: string
  locations?: Array<{ line: number; column: number }>
  path?: string[]
  extensions?: Record<string, unknown>
}

export type UserError = {
  field: Maybe<string[]>
  message: string
}

export type ShopifyResponse<T> = {
  data?: T
  errors?: ShopifyError[]
}

export type Connection<T> = {
  edges: Array<{ node: T; cursor: string }>
  pageInfo: PageInfo
}
