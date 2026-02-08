import { customerAccountQuery } from '../client'
import type { CustomerUserError } from '../types'

type CustomerUpdateInput = {
  firstName?: string
  lastName?: string
}

type CustomerUpdateResponse = {
  customerUpdate: {
    userErrors: CustomerUserError[]
  }
}

const CUSTOMER_UPDATE_MUTATION = /* GraphQL */ `
  mutation customerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      userErrors {
        field
        message
        code
      }
    }
  }
`

type CustomerUpdateResult = {
  userErrors: CustomerUserError[]
}

export async function updateCustomer(
  accessToken: string,
  input: CustomerUpdateInput,
): Promise<CustomerUpdateResult> {
  const data = await customerAccountQuery<CustomerUpdateResponse>(
    CUSTOMER_UPDATE_MUTATION,
    accessToken,
    { variables: { input } },
  )

  return {
    userErrors: data.customerUpdate.userErrors,
  }
}
