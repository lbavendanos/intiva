import type { ShopifyError, ShopifyResponse } from './types'

const FRAGMENT_NAME_RE = /fragment\s+(\w+)\s+on\s+\w+/

export function composeQuery(query: string, fragments: string[]): string {
  const seen = new Set<string>()
  const unique: string[] = []

  for (const fragment of fragments) {
    const match = fragment.match(FRAGMENT_NAME_RE)
    const key = match?.[1] ?? fragment

    if (seen.has(key)) continue
    seen.add(key)
    unique.push(fragment)
  }

  return `${query}\n${unique.join('\n')}`
}

type GraphQLRequestInit = {
  url: string
  query: string
  variables?: Record<string, unknown>
  headers: HeadersInit
  errorFactory: (message: string, errors?: ShopifyError[]) => Error
  fetchOptions?: RequestInit
}

export async function graphqlFetch<T = unknown>({
  url,
  query,
  variables = {},
  headers,
  errorFactory,
  fetchOptions,
}: GraphQLRequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      ...fetchOptions,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    throw errorFactory(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }

  if (!response.ok) {
    throw errorFactory(`HTTP error: ${response.status} ${response.statusText}`)
  }

  let json: ShopifyResponse<T>

  try {
    json = (await response.json()) as ShopifyResponse<T>
  } catch {
    throw errorFactory('Invalid JSON response')
  }

  if (json.errors && json.errors.length > 0) {
    const message = json.errors.map((e) => e.message).join(', ')
    throw errorFactory(`GraphQL errors: ${message}`, json.errors)
  }

  if (!json.data) {
    throw errorFactory('No data returned')
  }

  return json.data
}
