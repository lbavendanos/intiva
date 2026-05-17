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

type CustomerEmailMarketingSubscribeResponse = {
  customerEmailMarketingSubscribe: {
    userErrors: CustomerUserError[]
  }
}

type CustomerEmailMarketingUnsubscribeResponse = {
  customerEmailMarketingUnsubscribe: {
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

const CUSTOMER_EMAIL_MARKETING_SUBSCRIBE_MUTATION = /* GraphQL */ `
  mutation customerEmailMarketingSubscribe {
    customerEmailMarketingSubscribe {
      userErrors {
        field
        message
        code
      }
    }
  }
`

const CUSTOMER_EMAIL_MARKETING_UNSUBSCRIBE_MUTATION = /* GraphQL */ `
  mutation customerEmailMarketingUnsubscribe {
    customerEmailMarketingUnsubscribe {
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

export async function subscribeCustomerEmailMarketing(
  accessToken: string,
): Promise<CustomerMutationResult> {
  const data =
    await customerAccountQuery<CustomerEmailMarketingSubscribeResponse>(
      CUSTOMER_EMAIL_MARKETING_SUBSCRIBE_MUTATION,
      accessToken,
    )

  return { userErrors: data.customerEmailMarketingSubscribe.userErrors }
}

export async function unsubscribeCustomerEmailMarketing(
  accessToken: string,
): Promise<CustomerMutationResult> {
  const data =
    await customerAccountQuery<CustomerEmailMarketingUnsubscribeResponse>(
      CUSTOMER_EMAIL_MARKETING_UNSUBSCRIBE_MUTATION,
      accessToken,
    )

  return { userErrors: data.customerEmailMarketingUnsubscribe.userErrors }
}
