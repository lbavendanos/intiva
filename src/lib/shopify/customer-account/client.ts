import { graphqlFetch } from '../graphql'
import { CustomerAccountError, getCustomerAccountApiConfig } from './discovery'

export type CustomerAccountQueryOptions = {
  variables?: Record<string, unknown>
}

export async function customerAccountQuery<T = unknown>(
  query: string,
  accessToken: string,
  options: CustomerAccountQueryOptions = {},
): Promise<T> {
  const config = await getCustomerAccountApiConfig()

  return graphqlFetch<T>({
    url: config.graphql_api,
    query,
    variables: options.variables,
    headers: {
      Authorization: accessToken,
    },
    errorFactory: (message) => new CustomerAccountError(message),
  })
}
