export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`

export const MONEY_FRAGMENT = /* GraphQL */ `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`

export const SEO_FRAGMENT = /* GraphQL */ `
  fragment SEOFragment on SEO {
    title
    description
  }
`

export const PAGE_INFO_FRAGMENT = /* GraphQL */ `
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`

export const CUSTOMER_ADDRESS_FRAGMENT = /* GraphQL */ `
  fragment CustomerAddressFragment on MailingAddress {
    id
    firstName
    lastName
    company
    address1
    address2
    city
    province
    provinceCode
    country
    countryCodeV2
    zip
    phone
  }
`

export const PRODUCT_VARIANT_FRAGMENT = /* GraphQL */ `
  fragment ProductVariantFragment on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    selectedOptions {
      name
      value
    }
    price {
      ...MoneyFragment
    }
    compareAtPrice {
      ...MoneyFragment
    }
    image {
      ...ImageFragment
    }
  }
`

export const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment ProductCardFragment on Product {
    id
    title
    handle
    availableForSale
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFragment
      }
    }
    featuredImage {
      ...ImageFragment
    }
  }
`

export const COLLECTION_FRAGMENT = /* GraphQL */ `
  fragment CollectionFragment on Collection {
    id
    title
    handle
    description
    descriptionHtml
    image {
      ...ImageFragment
    }
    seo {
      ...SEOFragment
    }
  }
`

export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    descriptionHtml
    availableForSale
    seo {
      ...SEOFragment
    }
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    featuredImage {
      ...ImageFragment
    }
    images(first: 10) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    options {
      id
      name
      values
    }
    variants(first: 100) {
      edges {
        node {
          ...ProductVariantFragment
        }
      }
    }
    tags
    productType
    vendor
    createdAt
    updatedAt
  }
`

export const CART_LINE_FRAGMENT = /* GraphQL */ `
  fragment CartLineFragment on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        selectedOptions {
          name
          value
        }
        product {
          id
          title
          handle
          featuredImage {
            ...ImageFragment
          }
        }
        price {
          ...MoneyFragment
        }
        compareAtPrice {
          ...MoneyFragment
        }
      }
    }
    cost {
      totalAmount {
        ...MoneyFragment
      }
      amountPerQuantity {
        ...MoneyFragment
      }
      compareAtAmountPerQuantity {
        ...MoneyFragment
      }
    }
  }
`

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      edges {
        node {
          ...CartLineFragment
        }
      }
    }
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
  }
`

export const CUSTOMER_FRAGMENT = /* GraphQL */ `
  fragment CustomerFragment on Customer {
    id
    email
    firstName
    lastName
    displayName
    phone
    acceptsMarketing
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
    createdAt
    updatedAt
  }
`

export const ORDER_FRAGMENT = /* GraphQL */ `
  fragment OrderFragment on Order {
    id
    orderNumber
    name
    processedAt
    financialStatus
    fulfillmentStatus
    totalPrice {
      ...MoneyFragment
    }
    subtotalPrice {
      ...MoneyFragment
    }
    totalTax {
      ...MoneyFragment
    }
    totalShippingPrice {
      ...MoneyFragment
    }
    lineItems(first: 50) {
      edges {
        node {
          title
          quantity
          variant {
            id
            title
            price {
              ...MoneyFragment
            }
            image {
              ...ImageFragment
            }
          }
        }
      }
    }
    shippingAddress {
      ...CustomerAddressFragment
    }
  }
`
