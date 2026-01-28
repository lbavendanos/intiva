import { extractNodesFromEdges, storefrontQuery } from '@/lib/shopify/client'
import {
  CUSTOMER_ADDRESS_FRAGMENT,
  CUSTOMER_FRAGMENT,
} from '@/lib/shopify/fragments'
import type { Connection, Customer, CustomerAddress } from '@/lib/shopify/types'

type CustomerResponse = Omit<Customer, 'addresses'> & {
  addresses: Connection<CustomerAddress>
}

type GetCustomerResponse = {
  customer: CustomerResponse | null
}

const GET_CUSTOMER_QUERY = /* GraphQL */ `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerFragment
    }
  }
  ${CUSTOMER_FRAGMENT}
  ${CUSTOMER_ADDRESS_FRAGMENT}
`

function transformCustomer(customer: CustomerResponse): Customer {
  return {
    ...customer,
    addresses: extractNodesFromEdges(customer.addresses),
  }
}

export async function getCustomer(
  customerAccessToken: string,
): Promise<Customer | null> {
  const response = await storefrontQuery<GetCustomerResponse>(
    GET_CUSTOMER_QUERY,
    {
      variables: { customerAccessToken },
    },
  )

  if (!response.customer) {
    return null
  }

  return transformCustomer(response.customer)
}
