import { extractNodesFromEdges, storefrontQuery } from '../client'
import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
  SEO_FRAGMENT,
} from '../fragments'
import type { Image, Money, PageInfo, Product } from '../types'

export interface ProductCardData {
  id: string
  title: string
  handle: string
  availableForSale: boolean
  priceRange: {
    minVariantPrice: Money
  }
  featuredImage: Image | null
}

export interface GetProductsResult {
  products: ProductCardData[]
  pageInfo: PageInfo
}

interface GetProductsQueryResponse {
  products: {
    edges: Array<{ node: ProductCardData }>
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

  return {
    products: extractNodesFromEdges(data.products),
    pageInfo: data.products.pageInfo,
  }
}

interface GetProductByHandleQueryResponse {
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
  const data = await storefrontQuery<GetProductByHandleQueryResponse>(
    GET_PRODUCT_BY_HANDLE_QUERY,
    {
      variables: { handle },
    },
  )

  if (!data.product) {
    return null
  }

  return {
    ...data.product,
    images: extractNodesFromEdges(
      data.product.images as unknown as {
        edges: Array<{ node: Image }>
      },
    ),
    variants: extractNodesFromEdges(
      data.product.variants as unknown as {
        edges: Array<{ node: Product['variants'][0] }>
      },
    ),
  }
}
