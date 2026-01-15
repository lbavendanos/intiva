import { extractNodesFromEdges, storefrontQuery } from '@/lib/shopify/client'
import {
  CART_FRAGMENT,
  CART_LINE_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
} from '@/lib/shopify/fragments'
import type { Cart, CartLineItem, Connection } from '@/lib/shopify/types'

type CartLineNode = Omit<CartLineItem, 'merchandise'> & {
  merchandise: CartLineItem['merchandise']
}

type CartResponse = Omit<Cart, 'lines'> & {
  lines: Connection<CartLineNode>
}

type GetCartResponse = {
  cart: CartResponse | null
}

const GET_CART_QUERY = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
  ${CART_LINE_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

function transformCart(cart: CartResponse): Cart {
  return {
    ...cart,
    lines: extractNodesFromEdges(cart.lines),
  }
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const response = await storefrontQuery<GetCartResponse>(GET_CART_QUERY, {
    variables: { cartId },
  })

  if (!response.cart) {
    return null
  }

  return transformCart(response.cart)
}
