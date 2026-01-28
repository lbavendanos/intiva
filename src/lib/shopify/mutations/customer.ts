import { extractNodesFromEdges, storefrontQuery } from '@/lib/shopify/client'
import {
  CUSTOMER_ADDRESS_FRAGMENT,
  CUSTOMER_FRAGMENT,
} from '@/lib/shopify/fragments'
import type {
  Connection,
  Customer,
  CustomerAccessToken,
  CustomerAddress,
  UserError,
} from '@/lib/shopify/types'

type CustomerUserError = UserError & {
  code?: string
}

type CustomerResponse = Omit<Customer, 'addresses'> & {
  addresses: Connection<CustomerAddress>
}

type CustomerCreatePayload = {
  customerCreate: {
    customer: CustomerResponse | null
    customerUserErrors: CustomerUserError[]
  }
}

type CustomerAccessTokenCreatePayload = {
  customerAccessTokenCreate: {
    customerAccessToken: CustomerAccessToken | null
    customerUserErrors: CustomerUserError[]
  }
}

type CustomerAccessTokenDeletePayload = {
  customerAccessTokenDelete: {
    deletedAccessToken: string | null
    deletedCustomerAccessTokenId: string | null
    userErrors: CustomerUserError[]
  }
}

type CustomerRecoverPayload = {
  customerRecover: {
    customerUserErrors: CustomerUserError[]
  }
}

const CUSTOMER_CREATE_MUTATION = /* GraphQL */ `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        ...CustomerFragment
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
  ${CUSTOMER_ADDRESS_FRAGMENT}
`

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = /* GraphQL */ `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`

const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = /* GraphQL */ `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`

const CUSTOMER_RECOVER_MUTATION = /* GraphQL */ `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`

export type CustomerCreateInput = {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  acceptsMarketing?: boolean
}

export type CustomerAccessTokenCreateInput = {
  email: string
  password: string
}

export type CustomerCreateResult = {
  customer: Customer | null
  customerUserErrors: CustomerUserError[]
}

export type CustomerAccessTokenCreateResult = {
  customerAccessToken: CustomerAccessToken | null
  customerUserErrors: CustomerUserError[]
}

export type CustomerAccessTokenDeleteResult = {
  deletedAccessToken: string | null
  userErrors: CustomerUserError[]
}

export type CustomerRecoverResult = {
  customerUserErrors: CustomerUserError[]
}

function transformCustomer(customer: CustomerResponse): Customer {
  return {
    ...customer,
    addresses: extractNodesFromEdges(customer.addresses),
  }
}

export async function createCustomer(
  input: CustomerCreateInput,
): Promise<CustomerCreateResult> {
  const response = await storefrontQuery<CustomerCreatePayload>(
    CUSTOMER_CREATE_MUTATION,
    {
      variables: { input },
    },
  )

  const { customer, customerUserErrors } = response.customerCreate

  return {
    customer: customer ? transformCustomer(customer) : null,
    customerUserErrors,
  }
}

export async function createCustomerAccessToken(
  input: CustomerAccessTokenCreateInput,
): Promise<CustomerAccessTokenCreateResult> {
  const response = await storefrontQuery<CustomerAccessTokenCreatePayload>(
    CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    {
      variables: { input },
    },
  )

  const { customerAccessToken, customerUserErrors } =
    response.customerAccessTokenCreate

  return {
    customerAccessToken,
    customerUserErrors,
  }
}

export async function deleteCustomerAccessToken(
  customerAccessToken: string,
): Promise<CustomerAccessTokenDeleteResult> {
  const response = await storefrontQuery<CustomerAccessTokenDeletePayload>(
    CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
    {
      variables: { customerAccessToken },
    },
  )

  const { deletedAccessToken, userErrors } = response.customerAccessTokenDelete

  return {
    deletedAccessToken,
    userErrors,
  }
}

export async function recoverCustomer(
  email: string,
): Promise<CustomerRecoverResult> {
  const response = await storefrontQuery<CustomerRecoverPayload>(
    CUSTOMER_RECOVER_MUTATION,
    {
      variables: { email },
    },
  )

  return {
    customerUserErrors: response.customerRecover.customerUserErrors,
  }
}
