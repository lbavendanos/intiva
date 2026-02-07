import type { CustomerAccountApiConfig, OAuthDiscoveryConfig } from './types'

export class CustomerAccountError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomerAccountError'
  }
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

export async function getOAuthDiscoveryConfig(): Promise<OAuthDiscoveryConfig> {
  const domain = getStoreDomain()
  const url = `https://${domain}/.well-known/openid-configuration`

  let response: Response

  try {
    response = await fetch(url)
  } catch (error) {
    throw new CustomerAccountError(
      `Failed to fetch OAuth discovery config: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  if (!response.ok) {
    throw new CustomerAccountError(
      `OAuth discovery endpoint returned ${response.status} ${response.statusText}`,
    )
  }

  return (await response.json()) as OAuthDiscoveryConfig
}

export async function getCustomerAccountApiConfig(): Promise<CustomerAccountApiConfig> {
  const domain = getStoreDomain()
  const url = `https://${domain}/.well-known/customer-account-api`

  let response: Response

  try {
    response = await fetch(url)
  } catch (error) {
    throw new CustomerAccountError(
      `Failed to fetch Customer Account API config: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  if (!response.ok) {
    throw new CustomerAccountError(
      `Customer Account API config endpoint returned ${response.status} ${response.statusText}`,
    )
  }

  return (await response.json()) as CustomerAccountApiConfig
}
