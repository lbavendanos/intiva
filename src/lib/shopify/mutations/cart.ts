import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  CART_LINE_FRAGMENT,
  CART_FRAGMENT,
} from '@/lib/shopify/fragments'
import { storefrontQuery, extractNodesFromEdges } from '@/lib/shopify/client'
import type { Cart, UserError, Connection, CartLineItem } from '@/lib/shopify/types'

type CartLineNode = Omit<CartLineItem, 'merchandise'> & {
  merchandise: CartLineItem['merchandise']
}

type CartResponse = Omit<Cart, 'lines'> & {
  lines: Connection<CartLineNode>
}

type CartCreateResponse = {
  cartCreate: {
    cart: CartResponse | null
    userErrors: UserError[]
  }
}

type CartLinesAddResponse = {
  cartLinesAdd: {
    cart: CartResponse | null
    userErrors: UserError[]
  }
}

type CartLinesUpdateResponse = {
  cartLinesUpdate: {
    cart: CartResponse | null
    userErrors: UserError[]
  }
}

type CartLinesRemoveResponse = {
  cartLinesRemove: {
    cart: CartResponse | null
    userErrors: UserError[]
  }
}

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  ${CART_FRAGMENT}
  ${CART_LINE_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  ${CART_FRAGMENT}
  ${CART_LINE_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  ${CART_FRAGMENT}
  ${CART_LINE_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
        code
      }
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

export type CartLineInput = {
  merchandiseId: string
  quantity?: number
}

export type CartLineUpdateInput = {
  id: string
  quantity: number
}

export type CartCreateResult = {
  cart: Cart | null
  userErrors: UserError[]
}

export async function createCart(
  lines?: CartLineInput[]
): Promise<CartCreateResult> {
  const response = await storefrontQuery<CartCreateResponse>(
    CART_CREATE_MUTATION,
    {
      variables: {
        input: lines ? { lines } : undefined,
      },
    }
  )

  const { cart, userErrors } = response.cartCreate

  return {
    cart: cart ? transformCart(cart) : null,
    userErrors,
  }
}

export async function addToCart(
  cartId: string,
  lines: CartLineInput[]
): Promise<CartCreateResult> {
  const response = await storefrontQuery<CartLinesAddResponse>(
    CART_LINES_ADD_MUTATION,
    {
      variables: {
        cartId,
        lines,
      },
    }
  )

  const { cart, userErrors } = response.cartLinesAdd

  return {
    cart: cart ? transformCart(cart) : null,
    userErrors,
  }
}

export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<CartCreateResult> {
  const response = await storefrontQuery<CartLinesUpdateResponse>(
    CART_LINES_UPDATE_MUTATION,
    {
      variables: {
        cartId,
        lines,
      },
    }
  )

  const { cart, userErrors } = response.cartLinesUpdate

  return {
    cart: cart ? transformCart(cart) : null,
    userErrors,
  }
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<CartCreateResult> {
  const response = await storefrontQuery<CartLinesRemoveResponse>(
    CART_LINES_REMOVE_MUTATION,
    {
      variables: {
        cartId,
        lineIds,
      },
    }
  )

  const { cart, userErrors } = response.cartLinesRemove

  return {
    cart: cart ? transformCart(cart) : null,
    userErrors,
  }
}
