import { composeQuery } from '../../graphql'
import type { Connection, PageInfo } from '../../types'
import { extractNodesFromEdges } from '../../utils'
import { customerAccountQuery } from '../client'
import {
  CUSTOMER_ADDRESS_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  ORDER_FRAGMENT,
  ORDER_LINE_ITEM_FRAGMENT,
  ORDER_LIST_ITEM_FRAGMENT,
} from '../fragments'
import type { Order, OrderLineItem, OrderListItem } from '../types'

type RawOrderLineItem = Omit<OrderLineItem, 'displayTitle' | 'color'>

type OrderResponse = Omit<Order, 'lineItems'> & {
  lineItems: Connection<RawOrderLineItem>
}

function splitOrderLineTitle(title: string): {
  displayTitle: string
  color: string | null
} {
  const lastSeparator = title.lastIndexOf(' - ')
  if (lastSeparator === -1) return { displayTitle: title, color: null }

  const displayTitle = title.slice(0, lastSeparator).trim()
  const color = title.slice(lastSeparator + 3).trim()
  if (!displayTitle || !color) return { displayTitle: title, color: null }

  return { displayTitle, color }
}

function transformOrderLineItem(line: RawOrderLineItem): OrderLineItem {
  const { displayTitle, color } = splitOrderLineTitle(line.title)
  return { ...line, displayTitle, color }
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

const GET_CUSTOMER_ORDERS_QUERY = composeQuery(
  /* GraphQL */ `
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
  `,
  [ORDER_LIST_ITEM_FRAGMENT, MONEY_FRAGMENT],
)

const GET_CUSTOMER_ORDER_QUERY = composeQuery(
  /* GraphQL */ `
    query getCustomerOrder($orderId: ID!) {
      order(id: $orderId) {
        ...OrderFragment
      }
    }
  `,
  [
    ORDER_FRAGMENT,
    ORDER_LINE_ITEM_FRAGMENT,
    CUSTOMER_ADDRESS_FRAGMENT,
    MONEY_FRAGMENT,
    IMAGE_FRAGMENT,
  ],
)

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
    lineItems: extractNodesFromEdges(data.order.lineItems).map(
      transformOrderLineItem,
    ),
  }
}
