export const MONEY_FRAGMENT = /* GraphQL */ `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`

export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`

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
`

export const ORDER_LINE_ITEM_FRAGMENT = /* GraphQL */ `
  fragment OrderLineItemFragment on LineItem {
    id
    title
    name
    quantity
    variantTitle
    variantOptions {
      name
      value
    }
    image {
      ...ImageFragment
    }
    price {
      ...MoneyFragment
    }
    totalPrice {
      ...MoneyFragment
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
      ...MoneyFragment
    }
    subtotal {
      ...MoneyFragment
    }
    totalTax {
      ...MoneyFragment
    }
    totalShipping {
      ...MoneyFragment
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
      ...MoneyFragment
    }
    lineItems(first: 50) {
      edges {
        node {
          id
          title
          quantity
          image {
            ...ImageFragment
          }
        }
      }
    }
  }
`
