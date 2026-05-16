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

export type CustomerMutationResult = {
  userErrors: CustomerUserError[]
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

export async function updateCustomer(
  accessToken: string,
  input: CustomerUpdateInput,
): Promise<CustomerMutationResult> {
  const data = await customerAccountQuery<CustomerUpdateResponse>(
    CUSTOMER_UPDATE_MUTATION,
    accessToken,
    { variables: { input } },
  )

  return { userErrors: data.customerUpdate.userErrors }
}
