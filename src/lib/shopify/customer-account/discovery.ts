type OAuthDiscoveryConfig = {
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

type CustomerAccountApiConfig = {
  graphql_api: string
}

const oauthDiscoveryCache = new Map<string, Promise<OAuthDiscoveryConfig>>()
const customerAccountApiCache = new Map<
  string,
  Promise<CustomerAccountApiConfig>
>()

export class CustomerAccountError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomerAccountError'
  }
}

async function fetchJson<T>(url: string, context: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(url)
  } catch (error) {
    throw new CustomerAccountError(
      `Failed to fetch ${context}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  if (!response.ok) {
    throw new CustomerAccountError(
      `${context} returned ${response.status} ${response.statusText}`,
    )
  }

  return (await response.json()) as T
}

export function getStoreDomain(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN

  if (!domain) {
    throw new CustomerAccountError(
      'Missing SHOPIFY_STORE_DOMAIN environment variable',
    )
  }

  return domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function getClientId(): string {
  const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID

  if (!clientId) {
    throw new CustomerAccountError(
      'Missing SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID environment variable',
    )
  }

  return clientId
}

export function getOAuthDiscoveryConfig(): Promise<OAuthDiscoveryConfig> {
  const domain = getStoreDomain()
  const cached = oauthDiscoveryCache.get(domain)

  if (cached) {
    return cached
  }

  const promise = fetchJson<OAuthDiscoveryConfig>(
    `https://${domain}/.well-known/openid-configuration`,
    'OAuth discovery endpoint',
  ).catch((error) => {
    oauthDiscoveryCache.delete(domain)
    throw error
  })

  oauthDiscoveryCache.set(domain, promise)
  return promise
}

export function getCustomerAccountApiConfig(): Promise<CustomerAccountApiConfig> {
  const domain = getStoreDomain()
  const cached = customerAccountApiCache.get(domain)

  if (cached) {
    return cached
  }

  const promise = fetchJson<CustomerAccountApiConfig>(
    `https://${domain}/.well-known/customer-account-api`,
    'Customer Account API config endpoint',
  ).catch((error) => {
    customerAccountApiCache.delete(domain)
    throw error
  })

  customerAccountApiCache.set(domain, promise)
  return promise
}
