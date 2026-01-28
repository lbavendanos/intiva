import { extractNodesFromEdges, storefrontQuery } from '../client'
import {
  COLLECTION_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PAGE_INFO_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  SEO_FRAGMENT,
} from '../fragments'
import type { Collection, Image, PageInfo, ProductListItem } from '../types'

export type CollectionCardData = {
  id: string
  title: string
  handle: string
  description: string
  image: Image | null
}

export type GetCollectionsResult = {
  collections: CollectionCardData[]
  pageInfo: PageInfo
}

type GetCollectionsQueryResponse = {
  collections: {
    edges: Array<{ node: CollectionCardData }>
    pageInfo: PageInfo
  }
}

const GET_COLLECTIONS_QUERY = /* GraphQL */ `
  query getCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${PAGE_INFO_FRAGMENT}
`

export async function getCollections(
  first: number = 12,
  after?: string,
): Promise<GetCollectionsResult> {
  const data = await storefrontQuery<GetCollectionsQueryResponse>(
    GET_COLLECTIONS_QUERY,
    {
      variables: { first, after },
    },
  )

  return {
    collections: extractNodesFromEdges(data.collections),
    pageInfo: data.collections.pageInfo,
  }
}

type GetCollectionByHandleQueryResponse = {
  collection: Collection | null
}

const GET_COLLECTION_BY_HANDLE_QUERY = /* GraphQL */ `
  query getCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      ...CollectionFragment
    }
  }
  ${COLLECTION_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${SEO_FRAGMENT}
`

export async function getCollectionByHandle(
  handle: string,
): Promise<Collection | null> {
  const data = await storefrontQuery<GetCollectionByHandleQueryResponse>(
    GET_COLLECTION_BY_HANDLE_QUERY,
    {
      variables: { handle },
    },
  )

  return data.collection
}

export type GetCollectionProductsResult = {
  collection: Collection | null
  products: ProductListItem[]
  pageInfo: PageInfo
}

type GetCollectionProductsQueryResponse = {
  collection: {
    id: string
    title: string
    handle: string
    description: string
    descriptionHtml: string
    image: Image | null
    seo: { title: string | null; description: string | null }
    products: {
      edges: Array<{ node: ProductListItem }>
      pageInfo: PageInfo
    }
  } | null
}

const GET_COLLECTION_PRODUCTS_QUERY = /* GraphQL */ `
  query getCollectionProducts($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      ...CollectionFragment
      products(first: $first, after: $after, sortKey: BEST_SELLING) {
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
  }
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${SEO_FRAGMENT}
`

export async function getCollectionProducts(
  handle: string,
  first: number = 12,
  after?: string,
): Promise<GetCollectionProductsResult> {
  const data = await storefrontQuery<GetCollectionProductsQueryResponse>(
    GET_COLLECTION_PRODUCTS_QUERY,
    {
      variables: { handle, first, after },
    },
  )

  if (!data.collection) {
    return {
      collection: null,
      products: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    }
  }

  return {
    collection: {
      id: data.collection.id,
      title: data.collection.title,
      handle: data.collection.handle,
      description: data.collection.description,
      descriptionHtml: data.collection.descriptionHtml,
      image: data.collection.image,
      seo: data.collection.seo,
    },
    products: extractNodesFromEdges(data.collection.products),
    pageInfo: data.collection.products.pageInfo,
  }
}
