import { customerAccountQuery } from '../client'
import type { CustomerAddressInput, CustomerUserError } from '../types'

type CustomerAddressCreateResponse = {
  customerAddressCreate: {
    userErrors: CustomerUserError[]
  }
}

type CustomerAddressUpdateResponse = {
  customerAddressUpdate: {
    userErrors: CustomerUserError[]
  }
}

type CustomerAddressDeleteResponse = {
  customerAddressDelete: {
    userErrors: CustomerUserError[]
  }
}

type AddressMutationResult = {
  userErrors: CustomerUserError[]
}

const CUSTOMER_ADDRESS_CREATE_MUTATION = /* GraphQL */ `
  mutation customerAddressCreate(
    $address: CustomerAddressInput!
    $defaultAddress: Boolean
  ) {
    customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
      userErrors {
        field
        message
        code
      }
    }
  }
`

const CUSTOMER_ADDRESS_UPDATE_MUTATION = /* GraphQL */ `
  mutation customerAddressUpdate(
    $addressId: ID!
    $address: CustomerAddressInput!
    $defaultAddress: Boolean
  ) {
    customerAddressUpdate(
      addressId: $addressId
      address: $address
      defaultAddress: $defaultAddress
    ) {
      userErrors {
        field
        message
        code
      }
    }
  }
`

const CUSTOMER_ADDRESS_DELETE_MUTATION = /* GraphQL */ `
  mutation customerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      userErrors {
        field
        message
        code
      }
    }
  }
`

export async function createCustomerAddress(
  accessToken: string,
  address: CustomerAddressInput,
  defaultAddress?: boolean,
): Promise<AddressMutationResult> {
  const data = await customerAccountQuery<CustomerAddressCreateResponse>(
    CUSTOMER_ADDRESS_CREATE_MUTATION,
    accessToken,
    { variables: { address, defaultAddress } },
  )

  return {
    userErrors: data.customerAddressCreate.userErrors,
  }
}

export async function updateCustomerAddress(
  accessToken: string,
  addressId: string,
  address: CustomerAddressInput,
  defaultAddress?: boolean,
): Promise<AddressMutationResult> {
  const data = await customerAccountQuery<CustomerAddressUpdateResponse>(
    CUSTOMER_ADDRESS_UPDATE_MUTATION,
    accessToken,
    { variables: { addressId, address, defaultAddress } },
  )

  return {
    userErrors: data.customerAddressUpdate.userErrors,
  }
}

export async function deleteCustomerAddress(
  accessToken: string,
  addressId: string,
): Promise<AddressMutationResult> {
  const data = await customerAccountQuery<CustomerAddressDeleteResponse>(
    CUSTOMER_ADDRESS_DELETE_MUTATION,
    accessToken,
    { variables: { addressId } },
  )

  return {
    userErrors: data.customerAddressDelete.userErrors,
  }
}
