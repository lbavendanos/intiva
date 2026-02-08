import type { Image, Maybe, Money, UserError } from '../types'

export type OAuthDiscoveryConfig = {
  issuer: string
  authorization_endpoint: string
  token_endpoint: string
  end_session_endpoint: string
  userinfo_endpoint: string
  jwks_uri: string
  scopes_supported: string[]
  response_types_supported: string[]
  subject_types_supported: string[]
  id_token_signing_alg_values_supported: string[]
}

export type CustomerAccountApiConfig = {
  graphql_api: string
}

export type TokenResponse = {
  access_token: string
  expires_in: number
  refresh_token: string
  id_token: string
  token_type: string
}

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
  firstName?: string
  lastName?: string
  address1?: string
  address2?: string
  city?: string
  company?: string
  territoryCode?: string
  zoneCode?: string
  zip?: string
  phoneNumber?: string
}

export type CustomerUserError = UserError & {
  code?: string
}
