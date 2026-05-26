import { storefrontQuery } from '../client'
import {
  CART_FRAGMENT,
  CART_LINE_FRAGMENT,
  COLOR_METAOBJECT_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
} from '../fragments'
import { transformCart, type CartResponse } from '../transforms'
import type { Cart } from '../types'

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
  ${COLOR_METAOBJECT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefrontQuery<GetCartResponse>(GET_CART_QUERY, {
    variables: { cartId },
  })

  return data.cart ? transformCart(data.cart) : null
}
