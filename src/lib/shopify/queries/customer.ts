import { extractNodesFromEdges, storefrontQuery } from '@/lib/shopify/client'
import {
  CUSTOMER_ADDRESS_FRAGMENT,
  CUSTOMER_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  ORDER_FRAGMENT,
} from '@/lib/shopify/fragments'
import type {
  Connection,
  Customer,
  CustomerAddress,
  Order,
  OrderLineItem,
  PageInfo,
} from '@/lib/shopify/types'

type CustomerResponse = Omit<Customer, 'addresses'> & {
  addresses: Connection<CustomerAddress>
}

type GetCustomerResponse = {
  customer: CustomerResponse | null
}

type OrderLineItemResponse = Omit<OrderLineItem, 'variant'> & {
  variant: OrderLineItem['variant']
}

type OrderResponse = Omit<Order, 'lineItems'> & {
  lineItems: Connection<OrderLineItemResponse>
}

type GetCustomerOrdersResponse = {
  customer: {
    orders: Connection<OrderResponse>
  } | null
}

type GetCustomerOrderResponse = {
  customer: {
    orders: Connection<OrderResponse>
  } | null
}

export type GetCustomerOrdersResult = {
  orders: Order[]
  pageInfo: PageInfo
}

const GET_CUSTOMER_QUERY = /* GraphQL */ `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerFragment
    }
  }
  ${CUSTOMER_FRAGMENT}
  ${CUSTOMER_ADDRESS_FRAGMENT}
`

const GET_CUSTOMER_ORDERS_QUERY = /* GraphQL */ `
  query getCustomerOrders(
    $customerAccessToken: String!
    $first: Int!
    $after: String
  ) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(
        first: $first
        after: $after
        sortKey: PROCESSED_AT
        reverse: true
      ) {
        edges {
          node {
            ...OrderFragment
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
  ${ORDER_FRAGMENT}
  ${CUSTOMER_ADDRESS_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

const GET_CUSTOMER_ORDER_QUERY = /* GraphQL */ `
  query getCustomerOrder($customerAccessToken: String!, $orderId: ID!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 1, query: $orderId) {
        edges {
          node {
            ...OrderFragment
          }
        }
      }
    }
  }
  ${ORDER_FRAGMENT}
  ${CUSTOMER_ADDRESS_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

function transformCustomer(customer: CustomerResponse): Customer {
  return {
    ...customer,
    addresses: extractNodesFromEdges(customer.addresses),
  }
}

function transformOrder(order: OrderResponse): Order {
  return {
    ...order,
    lineItems: extractNodesFromEdges(order.lineItems),
  }
}

export async function getCustomer(
  customerAccessToken: string,
): Promise<Customer | null> {
  const response = await storefrontQuery<GetCustomerResponse>(
    GET_CUSTOMER_QUERY,
    {
      variables: { customerAccessToken },
    },
  )

  if (!response.customer) {
    return null
  }

  return transformCustomer(response.customer)
}

export async function getCustomerOrders(
  customerAccessToken: string,
  first: number = 10,
  after?: string,
): Promise<GetCustomerOrdersResult | null> {
  const response = await storefrontQuery<GetCustomerOrdersResponse>(
    GET_CUSTOMER_ORDERS_QUERY,
    {
      variables: { customerAccessToken, first, after },
    },
  )

  if (!response.customer) {
    return null
  }

  const orders = response.customer.orders.edges.map((edge) =>
    transformOrder(edge.node),
  )

  return {
    orders,
    pageInfo: response.customer.orders.pageInfo,
  }
}

export async function getCustomerOrder(
  customerAccessToken: string,
  orderNumber: number,
): Promise<Order | null> {
  const response = await storefrontQuery<GetCustomerOrderResponse>(
    GET_CUSTOMER_ORDER_QUERY,
    {
      variables: {
        customerAccessToken,
        orderId: `name:#${orderNumber}`,
      },
    },
  )

  if (!response.customer || response.customer.orders.edges.length === 0) {
    return null
  }

  return transformOrder(response.customer.orders.edges[0].node)
}
