import type { Connection, Image, Maybe, PageInfo } from '../../types'
import { extractNodesFromEdges } from '../../utils'
import { storefrontQuery } from '../client'
import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_COLOR_SIBLING_FRAGMENT,
  PRODUCT_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
  SEO_FRAGMENT,
} from '../fragments'
import { computePricing } from '../transforms'
import type {
  Product,
  ProductColor,
  ProductColorSibling,
  ProductListItem,
  ProductRecommendationIntent,
  ProductVariant,
} from '../types'

type GetProductsQueryResponse = {
  products: Connection<ProductListItem>
}

type ColorMetafieldResponse = Maybe<{
  reference: Maybe<{
    id: string
    nameField: Maybe<{ value: Maybe<string> }>
    hexField: Maybe<{ value: Maybe<string> }>
  }>
}>

type ColorSiblingResponse = {
  id: string
  handle: string
  title: string
  availableForSale: boolean
  featuredImage: Maybe<Image>
  colorMetafield: ColorMetafieldResponse
}

type ColorGroupMetafieldResponse = Maybe<{
  reference: Maybe<{
    id: string
    productsField: Maybe<{
      references: Connection<ColorSiblingResponse>
    }>
  }>
}>

type ProductResponse = Omit<
  Product,
  'images' | 'variants' | 'color' | 'colorSiblings'
> & {
  images: Connection<Image>
  variants: Connection<ProductVariant>
  colorMetafield: ColorMetafieldResponse
  colorGroupMetafield: ColorGroupMetafieldResponse
}

type GetProductByHandleQueryResponse = {
  product: ProductResponse | null
}

type GetProductRecommendationsQueryResponse = {
  productRecommendations: ProductListItem[] | null
}

type SearchProductsQueryResponse = {
  predictiveSearch: {
    products: ProductListItem[]
  } | null
}

type GetSearchResultsQueryResponse = {
  search: Connection<ProductListItem> & { totalCount: number }
}

type GetProductsResult = {
  products: ProductListItem[]
  pageInfo: PageInfo
}

type GetSearchResultsResult = {
  products: ProductListItem[]
  pageInfo: PageInfo
  totalCount: number
}

const GET_PRODUCTS_QUERY = /* GraphQL */ `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          ...ProductCardFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

const GET_PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
  ${PRODUCT_COLOR_SIBLING_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

const GET_PRODUCT_RECOMMENDATIONS_QUERY = /* GraphQL */ `
  query getProductRecommendations(
    $productId: ID!
    $intent: ProductRecommendationIntent
  ) {
    productRecommendations(productId: $productId, intent: $intent) {
      ...ProductCardFragment
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

const SEARCH_PRODUCTS_QUERY = /* GraphQL */ `
  query searchProducts($query: String!, $limit: Int!) {
    predictiveSearch(query: $query, limit: $limit, types: [PRODUCT]) {
      products {
        ...ProductCardFragment
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

const GET_SEARCH_RESULTS_QUERY = /* GraphQL */ `
  query getSearchResults($query: String!, $first: Int!, $after: String) {
    search(query: $query, first: $first, after: $after, types: [PRODUCT]) {
      edges {
        node {
          ... on Product {
            ...ProductCardFragment
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

function parseProductColor(
  metafield: ColorMetafieldResponse,
): ProductColor | null {
  const reference = metafield?.reference
  if (!reference) return null

  const name = reference.nameField?.value
  const hex = reference.hexField?.value
  if (!name || !hex) return null

  return { name, hex }
}

function parseProductColorSiblings(
  metafield: ColorGroupMetafieldResponse,
): ProductColorSibling[] {
  const references = metafield?.reference?.productsField?.references
  if (!references) return []

  return extractNodesFromEdges(references).flatMap((node) => {
    const color = parseProductColor(node.colorMetafield)
    if (!color) return []

    return [
      {
        id: node.id,
        handle: node.handle,
        title: node.title,
        availableForSale: node.availableForSale,
        featuredImage: node.featuredImage,
        color,
      },
    ]
  })
}

export async function getProducts(
  first: number = 12,
  after?: string,
): Promise<GetProductsResult> {
  const data = await storefrontQuery<GetProductsQueryResponse>(
    GET_PRODUCTS_QUERY,
    {
      variables: { first, after },
    },
  )

  const products = extractNodesFromEdges(data.products).map((product) => ({
    ...product,
    ...computePricing(product),
  }))

  return {
    products,
    pageInfo: data.products.pageInfo,
  }
}

export async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  const data = await storefrontQuery<GetProductByHandleQueryResponse>(
    GET_PRODUCT_BY_HANDLE_QUERY,
    {
      variables: { handle },
    },
  )

  if (!data.product) {
    return null
  }

  const product = data.product

  return {
    ...product,
    images: extractNodesFromEdges(product.images),
    variants: extractNodesFromEdges(product.variants),
    color: parseProductColor(product.colorMetafield),
    colorSiblings: parseProductColorSiblings(product.colorGroupMetafield),
    ...computePricing(product),
  }
}

export async function getProductRecommendations(
  productId: string,
  intent: ProductRecommendationIntent = 'RELATED',
): Promise<ProductListItem[]> {
  const data = await storefrontQuery<GetProductRecommendationsQueryResponse>(
    GET_PRODUCT_RECOMMENDATIONS_QUERY,
    {
      variables: { productId, intent },
    },
  )

  if (!data.productRecommendations) {
    return []
  }

  return data.productRecommendations.map((product) => ({
    ...product,
    ...computePricing(product),
  }))
}

export async function searchProducts(
  query: string,
  limit: number = 8,
): Promise<ProductListItem[]> {
  const data = await storefrontQuery<SearchProductsQueryResponse>(
    SEARCH_PRODUCTS_QUERY,
    {
      variables: { query, limit },
    },
  )

  const products = data.predictiveSearch?.products ?? []

  return products.map((product) => ({
    ...product,
    ...computePricing(product),
  }))
}

export async function getSearchResults(
  query: string,
  first: number = 12,
  after?: string,
): Promise<GetSearchResultsResult> {
  const data = await storefrontQuery<GetSearchResultsQueryResponse>(
    GET_SEARCH_RESULTS_QUERY,
    {
      variables: { query, first, after },
    },
  )

  const products = extractNodesFromEdges(data.search).map((product) => ({
    ...product,
    ...computePricing(product),
  }))

  return {
    products,
    pageInfo: data.search.pageInfo,
    totalCount: data.search.totalCount,
  }
}
