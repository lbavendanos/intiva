import { extractNodesFromEdges } from '@/lib/shopify/storefront/client'

import type { Connection, PageInfo } from '../../types'
import { customerAccountQuery } from '../client'
import { ORDER_FRAGMENT, ORDER_LIST_ITEM_FRAGMENT } from '../fragments'
import type { Order, OrderLineItem, OrderListItem } from '../types'

type OrderResponse = Omit<Order, 'lineItems'> & {
  lineItems: Connection<OrderLineItem>
}

type GetCustomerOrdersResponse = {
  customer: {
    orders: Connection<OrderListItem>
  }
}

type GetCustomerOrderResponse = {
  order: OrderResponse | null
}

type GetCustomerOrdersResult = {
  orders: OrderListItem[]
  pageInfo: PageInfo
}

const GET_CUSTOMER_ORDERS_QUERY = /* GraphQL */ `
  query getCustomerOrders($first: Int!, $after: String) {
    customer {
      orders(
        first: $first
        after: $after
        sortKey: PROCESSED_AT
        reverse: true
      ) {
        edges {
          node {
            ...OrderListItemFragment
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${ORDER_LIST_ITEM_FRAGMENT}
`

const GET_CUSTOMER_ORDER_QUERY = /* GraphQL */ `
  query getCustomerOrder($orderId: ID!) {
    order(id: $orderId) {
      ...OrderFragment
    }
  }
  ${ORDER_FRAGMENT}
`

export async function getCustomerOrders(
  accessToken: string,
  first: number = 10,
  after?: string,
): Promise<GetCustomerOrdersResult> {
  const data = await customerAccountQuery<GetCustomerOrdersResponse>(
    GET_CUSTOMER_ORDERS_QUERY,
    accessToken,
    { variables: { first, after } },
  )

  return {
    orders: extractNodesFromEdges(data.customer.orders),
    pageInfo: data.customer.orders.pageInfo,
  }
}

export async function getCustomerOrder(
  accessToken: string,
  orderId: string,
): Promise<Order | null> {
  const data = await customerAccountQuery<GetCustomerOrderResponse>(
    GET_CUSTOMER_ORDER_QUERY,
    accessToken,
    { variables: { orderId } },
  )

  if (!data.order) {
    return null
  }

  return {
    ...data.order,
    lineItems: extractNodesFromEdges(data.order.lineItems),
  }
}
