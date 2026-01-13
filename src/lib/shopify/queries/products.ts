import { cacheLife } from 'next/cache'

import { extractNodesFromEdges, storefrontQuery } from '../client'
import { computePricing } from '../common'
import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
  SEO_FRAGMENT,
} from '../fragments'
import type { Image, PageInfo, Product, ProductListItem } from '../types'

export type GetProductsResult = {
  products: ProductListItem[]
  pageInfo: PageInfo
}

type GetProductsQueryResponse = {
  products: {
    edges: Array<{ node: ProductListItem }>
    pageInfo: PageInfo
  }
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

type GetProductByHandleQueryResponse = {
  product: Product | null
}

const GET_PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${SEO_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

export async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  'use cache'
  cacheLife('hours')

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
    images: extractNodesFromEdges(
      product.images as unknown as {
        edges: Array<{ node: Image }>
      },
    ),
    variants: extractNodesFromEdges(
      product.variants as unknown as {
        edges: Array<{ node: Product['variants'][0] }>
      },
    ),
    ...computePricing(product),
  }
}

export type ProductRecommendationIntent = 'RELATED' | 'COMPLEMENTARY'

type GetProductRecommendationsQueryResponse = {
  productRecommendations: ProductListItem[] | null
}

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

export async function getProductRecommendations(
  productId: string,
  intent: ProductRecommendationIntent = 'RELATED',
): Promise<ProductListItem[]> {
  'use cache'
  cacheLife('hours')

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
