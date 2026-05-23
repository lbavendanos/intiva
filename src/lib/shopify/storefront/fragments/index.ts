export const CART_USER_ERROR_FRAGMENT = /* GraphQL */ `
  fragment CartUserErrorFragment on CartUserError {
    field
    message
    code
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

export const PRODUCT_COLOR_SIBLING_FRAGMENT = /* GraphQL */ `
  fragment ProductColorSiblingFragment on Product {
    id
    handle
    title
    availableForSale
    featuredImage {
      ...ImageFragment
    }
    colorMetafield: metafield(namespace: "custom", key: "color") {
      reference {
        ... on Metaobject {
          id
          nameField: field(key: "name") {
            value
          }
          hexField: field(key: "hex") {
            value
          }
        }
      }
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
      optionValues {
        id
        name
      }
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
    colorMetafield: metafield(namespace: "custom", key: "color") {
      reference {
        ... on Metaobject {
          id
          nameField: field(key: "name") {
            value
          }
          hexField: field(key: "hex") {
            value
          }
        }
      }
    }
    colorGroupMetafield: metafield(namespace: "custom", key: "color_group") {
      reference {
        ... on Metaobject {
          id
          productsField: field(key: "products") {
            references(first: 50) {
              edges {
                node {
                  ...ProductColorSiblingFragment
                }
              }
            }
          }
        }
      }
    }
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
    }
  }
`
