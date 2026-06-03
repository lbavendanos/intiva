import { composeQuery } from '../../graphql'
import type { Connection, Maybe, Money, PageInfo } from '../../types'
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
import type {
  CustomerAddress,
  Order,
  OrderLineItem,
  OrderListItem,
  OrderListLineItem,
  OrderPayment,
} from '../types'

type RawOrderLineItem = Omit<OrderLineItem, 'displayTitle' | 'color'>

type RawCardPaymentDetails = {
  cardBrand?: Maybe<string>
  last4?: Maybe<string>
}

type RawTransaction = {
  processedAt: string
  type: string
  transactionAmount: { presentmentMoney: Money }
  paymentDetails: Maybe<RawCardPaymentDetails>
}

type RawPaymentInformation = Maybe<{
  totalPaidAmount: Money
}>

type OrderResponse = Omit<Order, 'lineItems' | 'payment' | 'contactName'> & {
  lineItems: Connection<RawOrderLineItem>
  transactions: RawTransaction[]
  paymentInformation: RawPaymentInformation
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
  const variantOptions = line.variantOptions.filter(
    (option) => option.value !== 'Default Title',
  )
  return { ...line, displayTitle, color, variantOptions }
}

function buildContactName(address: Maybe<CustomerAddress>): string | null {
  if (!address) return null
  const name = [address.firstName, address.lastName].filter(Boolean).join(' ')
  return name.trim() || null
}

function buildPayment(
  transactions: RawTransaction[],
  paymentInformation: RawPaymentInformation,
): OrderPayment | null {
  const transaction =
    transactions.find((t) => t.type === 'SALE' || t.type === 'CAPTURE') ??
    transactions[0]

  const amount =
    paymentInformation?.totalPaidAmount ??
    transaction?.transactionAmount.presentmentMoney ??
    null

  if (!transaction && !amount) return null

  return {
    brand: transaction?.paymentDetails?.cardBrand ?? null,
    last4: transaction?.paymentDetails?.last4 ?? null,
    amount,
    processedAt: transaction?.processedAt ?? null,
  }
}

type RawOrderListItem = Omit<OrderListItem, 'lineItems' | 'totalQuantity'> & {
  lineItems: Connection<OrderListLineItem>
}

type GetCustomerOrdersResponse = {
  customer: {
    orders: Connection<RawOrderListItem>
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
    query getCustomerOrders(
      $first: Int!
      $after: String
      $sortKey: OrderSortKeys
      $reverse: Boolean
      $query: String
    ) {
      customer {
        orders(
          first: $first
          after: $after
          sortKey: $sortKey
          reverse: $reverse
          query: $query
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
  [ORDER_LIST_ITEM_FRAGMENT, MONEY_FRAGMENT, IMAGE_FRAGMENT],
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

function transformOrderListItem(order: RawOrderListItem): OrderListItem {
  const lineItems = extractNodesFromEdges(order.lineItems)
  const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0)
  return { ...order, lineItems, totalQuantity }
}

type GetCustomerOrdersOptions = {
  first?: number
  after?: string
  sortKey?: string
  reverse?: boolean
  query?: string
}

export async function getCustomerOrders(
  accessToken: string,
  { first = 10, after, sortKey, reverse, query }: GetCustomerOrdersOptions = {},
): Promise<GetCustomerOrdersResult> {
  const data = await customerAccountQuery<GetCustomerOrdersResponse>(
    GET_CUSTOMER_ORDERS_QUERY,
    accessToken,
    { variables: { first, after, sortKey, reverse, query } },
  )

  return {
    orders: extractNodesFromEdges(data.customer.orders).map(
      transformOrderListItem,
    ),
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

  const { lineItems, transactions, paymentInformation, ...order } = data.order

  return {
    ...order,
    lineItems: extractNodesFromEdges(lineItems).map(transformOrderLineItem),
    payment: buildPayment(transactions, paymentInformation),
    contactName: buildContactName(
      order.shippingAddress ?? order.billingAddress,
    ),
  }
}
