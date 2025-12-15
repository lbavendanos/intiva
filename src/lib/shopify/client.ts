import type { ShopifyError, ShopifyResponse } from './types'

const SHOPIFY_STOREFRONT_API_VERSION = '2025-10'

export class ShopifyClientError extends Error {
  constructor(
    message: string,
    public errors?: ShopifyError[],
  ) {
    super(message)
    this.name = 'ShopifyClientError'
  }
}

export interface ShopifyClientConfig {
  storeDomain: string
  storefrontAccessToken: string
  apiVersion?: string
}

function getConfig(): ShopifyClientConfig {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!storeDomain) {
    throw new ShopifyClientError(
      'Missing SHOPIFY_STORE_DOMAIN environment variable',
    )
  }

  if (!storefrontAccessToken) {
    throw new ShopifyClientError(
      'Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable',
    )
  }

  return {
    storeDomain,
    storefrontAccessToken,
    apiVersion: SHOPIFY_STOREFRONT_API_VERSION,
  }
}

function getStorefrontApiUrl(config: ShopifyClientConfig): string {
  const { storeDomain, apiVersion } = config
  const domain = storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return `https://${domain}/api/${apiVersion}/graphql.json`
}

function getHeaders(config: ShopifyClientConfig): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': config.storefrontAccessToken,
  }
}

export interface StorefrontQueryOptions {
  variables?: Record<string, unknown>
}

export async function storefrontQuery<T = unknown>(
  query: string,
  options: StorefrontQueryOptions = {},
): Promise<T> {
  const { variables = {} } = options
  const config = getConfig()
  const url = getStorefrontApiUrl(config)
  const headers = getHeaders(config)

  let response: Response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    throw new ShopifyClientError(
      `Network error while fetching from Shopify: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  if (!response.ok) {
    throw new ShopifyClientError(
      `HTTP error from Shopify: ${response.status} ${response.statusText}`,
    )
  }

  let json: ShopifyResponse<T>

  try {
    json = (await response.json()) as ShopifyResponse<T>
  } catch {
    throw new ShopifyClientError('Invalid JSON response from Shopify')
  }

  if (json.errors && json.errors.length > 0) {
    const errorMessages = json.errors.map((e) => e.message).join(', ')
    throw new ShopifyClientError(
      `GraphQL errors: ${errorMessages}`,
      json.errors,
    )
  }

  if (!json.data) {
    throw new ShopifyClientError('No data returned from Shopify')
  }

  return json.data
}

export function extractNodesFromEdges<T>(
  connection: { edges: Array<{ node: T }> } | undefined | null,
): T[] {
  if (!connection?.edges) {
    return []
  }
  return connection.edges.map((edge) => edge.node)
}
