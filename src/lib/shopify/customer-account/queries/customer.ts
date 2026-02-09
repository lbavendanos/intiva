import { extractNodesFromEdges } from '@/lib/shopify/storefront/client'

import type { Connection } from '../../types'
import { customerAccountQuery } from '../client'
import { CUSTOMER_FRAGMENT } from '../fragments'
import type { Customer, CustomerAddress } from '../types'

type CustomerResponse = Omit<Customer, 'addresses'> & {
  addresses: Connection<CustomerAddress>
}

type GetCustomerResponse = {
  customer: CustomerResponse
}

const GET_CUSTOMER_QUERY = /* GraphQL */ `
  query getCustomer {
    customer {
      ...CustomerFragment
    }
  }
  ${CUSTOMER_FRAGMENT}
`

export async function getCustomer(accessToken: string): Promise<Customer> {
  const data = await customerAccountQuery<GetCustomerResponse>(
    GET_CUSTOMER_QUERY,
    accessToken,
  )

  return {
    ...data.customer,
    addresses: extractNodesFromEdges(data.customer.addresses),
  }
}
