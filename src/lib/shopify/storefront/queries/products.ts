import type { Connection, Image, PageInfo } from '../../types'
import { extractNodesFromEdges } from '../../utils'
import { storefrontQuery } from '../client'
import {
  COLOR_GROUP_METAOBJECT_FRAGMENT,
  COLOR_METAOBJECT_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_COLOR_SIBLING_FRAGMENT,
  PRODUCT_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
  SEO_FRAGMENT,
} from '../fragments'
import {
  computeDisplayTitle,
  computePricing,
  parseProductColor,
  parseProductColorSiblings,
  transformProductListItem,
  type ColorGroupMetafieldResponse,
  type ColorMetafieldResponse,
  type ProductListItemResponse,
} from '../transforms'
import type {
  Product,
  ProductListItem,
  ProductRecommendationIntent,
  ProductVariant,
} from '../types'

type ProductResponse = Omit<
  Product,
  'images' | 'variants' | 'color' | 'colorSiblings' | 'displayTitle'
> & {
  images: Connection<Image>
  variants: Connection<ProductVariant>
  colorMetafield: ColorMetafieldResponse
  colorGroupMetafield: ColorGroupMetafieldResponse
}

type GetProductsQueryResponse = {
  products: Connection<ProductListItemResponse>
}

type GetProductByHandleQueryResponse = {
  product: ProductResponse | null
}

type GetProductRecommendationsQueryResponse = {
  productRecommendations: ProductListItemResponse[] | null
}

type SearchProductsQueryResponse = {
  predictiveSearch: {
    products: ProductListItemResponse[]
  } | null
}

type GetSearchResultsQueryResponse = {
  search: Connection<ProductListItemResponse> & { totalCount: number }
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

const PRODUCT_CARD_QUERY_FRAGMENTS = `
  ${PRODUCT_CARD_FRAGMENT}
  ${PRODUCT_COLOR_SIBLING_FRAGMENT}
  ${COLOR_METAOBJECT_FRAGMENT}
  ${COLOR_GROUP_METAOBJECT_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

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
  ${PRODUCT_CARD_QUERY_FRAGMENTS}
  ${PAGE_INFO_FRAGMENT}
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
  ${COLOR_METAOBJECT_FRAGMENT}
  ${COLOR_GROUP_METAOBJECT_FRAGMENT}
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
  ${PRODUCT_CARD_QUERY_FRAGMENTS}
`

const SEARCH_PRODUCTS_QUERY = /* GraphQL */ `
  query searchProducts($query: String!, $limit: Int!) {
    predictiveSearch(query: $query, limit: $limit, types: [PRODUCT]) {
      products {
        ...ProductCardFragment
      }
    }
  }
  ${PRODUCT_CARD_QUERY_FRAGMENTS}
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
  ${PRODUCT_CARD_QUERY_FRAGMENTS}
  ${PAGE_INFO_FRAGMENT}
`

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

  const products = extractNodesFromEdges(data.products).map(
    transformProductListItem,
  )

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
  const color = parseProductColor(product.colorMetafield)
  const colorSiblings = parseProductColorSiblings(product.colorGroupMetafield)

  return {
    ...product,
    images: extractNodesFromEdges(product.images),
    variants: extractNodesFromEdges(product.variants),
    color,
    colorSiblings,
    displayTitle: computeDisplayTitle(product.title, color, colorSiblings),
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

  return data.productRecommendations.map(transformProductListItem)
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

  return products.map(transformProductListItem)
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

  const products = extractNodesFromEdges(data.search).map(
    transformProductListItem,
  )

  return {
    products,
    pageInfo: data.search.pageInfo,
    totalCount: data.search.totalCount,
  }
}
