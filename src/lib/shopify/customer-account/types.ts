import type { Image, Maybe, Money, UserError } from '../types'

export type SessionTokens = {
  accessToken: string
  refreshToken: string
  idToken: string
  expiresAt: number
}

export type PKCEParams = {
  codeVerifier: string
  codeChallenge: string
  state: string
  nonce: string
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
  zoneCode: Maybe<string>
  country: Maybe<string>
  territoryCode: Maybe<string>
  zip: Maybe<string>
  phoneNumber: Maybe<string>
  formatted: string[]
  formattedArea: Maybe<string>
}

export type CustomerEmailAddress = {
  emailAddress: Maybe<string>
  marketingState: string
}

export type CustomerPhoneNumber = {
  phoneNumber: string
  marketingState: string
}

export type Customer = {
  id: string
  firstName: Maybe<string>
  lastName: Maybe<string>
  displayName: string
  imageUrl: string
  emailAddress: Maybe<CustomerEmailAddress>
  phoneNumber: Maybe<CustomerPhoneNumber>
  creationDate: string
  defaultAddress: Maybe<CustomerAddress>
  addresses: CustomerAddress[]
}

export type OrderLineItem = {
  id: string
  title: string
  name: string
  quantity: number
  image: Maybe<Image>
  price: Maybe<Money>
  variantTitle: Maybe<string>
  totalPrice: Maybe<Money>
}

export type Order = {
  id: string
  name: string
  number: number
  processedAt: string
  financialStatus: Maybe<string>
  fulfillmentStatus: string
  totalPrice: Money
  subtotal: Maybe<Money>
  totalTax: Maybe<Money>
  totalShipping: Money
  lineItems: OrderLineItem[]
  shippingAddress: Maybe<CustomerAddress>
  statusPageUrl: string
}

export type OrderListItem = {
  id: string
  name: string
  number: number
  processedAt: string
  financialStatus: Maybe<string>
  fulfillmentStatus: string
  totalPrice: Money
}

export type CustomerAddressInput = {
  firstName?: Maybe<string>
  lastName?: Maybe<string>
  address1?: string
  address2?: Maybe<string>
  city?: string
  company?: Maybe<string>
  territoryCode?: string
  zoneCode?: string
  zip?: Maybe<string>
  phoneNumber?: string
}

export type CustomerUserError = UserError & {
  code: Maybe<string>
}
