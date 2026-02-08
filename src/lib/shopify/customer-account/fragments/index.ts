export const CUSTOMER_ADDRESS_FRAGMENT = /* GraphQL */ `
  fragment CustomerAddressFragment on CustomerAddress {
    id
    firstName
    lastName
    company
    address1
    address2
    city
    province
    zoneCode
    country
    territoryCode
    zip
    phoneNumber
    formatted
    formattedArea
  }
`

export const CUSTOMER_FRAGMENT = /* GraphQL */ `
  fragment CustomerFragment on Customer {
    id
    firstName
    lastName
    displayName
    imageUrl
    creationDate
    emailAddress {
      emailAddress
      marketingState
    }
    phoneNumber {
      phoneNumber
      marketingState
    }
    defaultAddress {
      ...CustomerAddressFragment
    }
    addresses(first: 10) {
      edges {
        node {
          ...CustomerAddressFragment
        }
      }
    }
  }
  ${CUSTOMER_ADDRESS_FRAGMENT}
`

export const ORDER_LINE_ITEM_FRAGMENT = /* GraphQL */ `
  fragment OrderLineItemFragment on LineItem {
    id
    title
    name
    quantity
    variantTitle
    image {
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    totalPrice {
      amount
      currencyCode
    }
  }
`

export const ORDER_FRAGMENT = /* GraphQL */ `
  fragment OrderFragment on Order {
    id
    name
    number
    processedAt
    financialStatus
    fulfillmentStatus
    statusPageUrl
    totalPrice {
      amount
      currencyCode
    }
    subtotal {
      amount
      currencyCode
    }
    totalTax {
      amount
      currencyCode
    }
    totalShipping {
      amount
      currencyCode
    }
    shippingAddress {
      ...CustomerAddressFragment
    }
    lineItems(first: 50) {
      edges {
        node {
          ...OrderLineItemFragment
        }
      }
    }
  }
  ${CUSTOMER_ADDRESS_FRAGMENT}
  ${ORDER_LINE_ITEM_FRAGMENT}
`

export const ORDER_LIST_ITEM_FRAGMENT = /* GraphQL */ `
  fragment OrderListItemFragment on Order {
    id
    name
    number
    processedAt
    financialStatus
    fulfillmentStatus
    totalPrice {
      amount
      currencyCode
    }
  }
`
