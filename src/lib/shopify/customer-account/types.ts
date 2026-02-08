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
  provinceCode: Maybe<string>
  country: Maybe<string>
  countryCodeV2: Maybe<string>
  zip: Maybe<string>
  phone: Maybe<string>
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

export type CustomerUserError = UserError & {
  code?: string
}
