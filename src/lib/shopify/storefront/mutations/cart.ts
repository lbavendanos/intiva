import { storefrontQuery } from '../client'
import {
  CART_FRAGMENT,
  CART_LINE_FRAGMENT,
  CART_USER_ERROR_FRAGMENT,
  COLOR_METAOBJECT_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
} from '../fragments'
import { transformCart, type CartResponse } from '../transforms'
import type { Cart, CartUserError } from '../types'

type CartMutationPayload = {
  cart: CartResponse | null
  userErrors: CartUserError[]
}

type CartCreateResponse = { cartCreate: CartMutationPayload }
type CartLinesAddResponse = { cartLinesAdd: CartMutationPayload }
type CartLinesUpdateResponse = { cartLinesUpdate: CartMutationPayload }
type CartLinesRemoveResponse = { cartLinesRemove: CartMutationPayload }

type CartLineInput = {
  merchandiseId: string
  quantity?: number
}

type CartLineUpdateInput = {
  id: string
  quantity: number
}

export type CartMutationResult = {
  cart: Cart | null
  userErrors: CartUserError[]
}

const CART_MUTATION_FRAGMENTS = `
  ${CART_FRAGMENT}
  ${CART_LINE_FRAGMENT}
  ${CART_USER_ERROR_FRAGMENT}
  ${COLOR_METAOBJECT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        ...CartUserErrorFragment
      }
    }
  }
  ${CART_MUTATION_FRAGMENTS}
`

const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        ...CartUserErrorFragment
      }
    }
  }
  ${CART_MUTATION_FRAGMENTS}
`

const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        ...CartUserErrorFragment
      }
    }
  }
  ${CART_MUTATION_FRAGMENTS}
`

const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        ...CartUserErrorFragment
      }
    }
  }
  ${CART_MUTATION_FRAGMENTS}
`

function toResult(payload: CartMutationPayload): CartMutationResult {
  return {
    cart: payload.cart ? transformCart(payload.cart) : null,
    userErrors: payload.userErrors,
  }
}

export async function createCart(
  lines?: CartLineInput[],
): Promise<CartMutationResult> {
  const data = await storefrontQuery<CartCreateResponse>(CART_CREATE_MUTATION, {
    variables: { input: lines ? { lines } : undefined },
  })

  return toResult(data.cartCreate)
}

export async function addToCart(
  cartId: string,
  lines: CartLineInput[],
): Promise<CartMutationResult> {
  const data = await storefrontQuery<CartLinesAddResponse>(
    CART_LINES_ADD_MUTATION,
    { variables: { cartId, lines } },
  )

  return toResult(data.cartLinesAdd)
}

export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[],
): Promise<CartMutationResult> {
  const data = await storefrontQuery<CartLinesUpdateResponse>(
    CART_LINES_UPDATE_MUTATION,
    { variables: { cartId, lines } },
  )

  return toResult(data.cartLinesUpdate)
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<CartMutationResult> {
  const data = await storefrontQuery<CartLinesRemoveResponse>(
    CART_LINES_REMOVE_MUTATION,
    { variables: { cartId, lineIds } },
  )

  return toResult(data.cartLinesRemove)
}
