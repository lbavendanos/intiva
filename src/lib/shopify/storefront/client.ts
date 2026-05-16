import { STOREFRONT_API_VERSION } from '../constants'
import { graphqlFetch } from '../graphql'
import type { ShopifyError } from '../types'

type StorefrontClientConfig = {
  storeDomain: string
  storefrontAccessToken: string
}

export type StorefrontQueryOptions = {
  variables?: Record<string, unknown>
}

export class ShopifyClientError extends Error {
  constructor(
    message: string,
    public errors?: ShopifyError[],
  ) {
    super(message)
    this.name = 'ShopifyClientError'
  }
}

function getConfig(): StorefrontClientConfig {
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

  return { storeDomain, storefrontAccessToken }
}

function getStorefrontApiUrl(storeDomain: string): string {
  const domain = storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return `https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`
}

export async function storefrontQuery<T = unknown>(
  query: string,
  options: StorefrontQueryOptions = {},
): Promise<T> {
  const { storeDomain, storefrontAccessToken } = getConfig()

  return graphqlFetch<T>({
    url: getStorefrontApiUrl(storeDomain),
    query,
    variables: options.variables,
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    errorFactory: (message, errors) => new ShopifyClientError(message, errors),
  })
}
