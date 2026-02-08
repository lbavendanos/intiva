import type { ShopifyError, ShopifyResponse } from '../types'
import { CustomerAccountError, getCustomerAccountApiConfig } from './discovery'

export type CustomerAccountQueryOptions = {
  variables?: Record<string, unknown>
}

export async function customerAccountQuery<T = unknown>(
  query: string,
  accessToken: string,
  options: CustomerAccountQueryOptions = {},
): Promise<T> {
  const { variables = {} } = options
  const config = await getCustomerAccountApiConfig()

  let response: Response

  try {
    response = await fetch(config.graphql_api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    throw new CustomerAccountError(
      `Network error while fetching from Customer Account API: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  if (!response.ok) {
    throw new CustomerAccountError(
      `HTTP error from Customer Account API: ${response.status} ${response.statusText}`,
    )
  }

  let json: ShopifyResponse<T>

  try {
    json = (await response.json()) as ShopifyResponse<T>
  } catch {
    throw new CustomerAccountError(
      'Invalid JSON response from Customer Account API',
    )
  }

  if (json.errors && json.errors.length > 0) {
    const errorMessages = json.errors
      .map((e: ShopifyError) => e.message)
      .join(', ')
    throw new CustomerAccountError(`GraphQL errors: ${errorMessages}`)
  }

  if (!json.data) {
    throw new CustomerAccountError('No data returned from Customer Account API')
  }

  return json.data
}
