'use server'

import { updateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { CART_CACHE_TAG } from '@/lib/data/cache-tags'
import { CART_COOKIE_NAME } from '@/lib/data/cart'
import {
  addToCart as addToCartMutation,
  createCart,
  removeFromCart as removeFromCartMutation,
  updateCartLines,
} from '@/lib/shopify/storefront/mutations/cart'
import type { Cart, CartUserError } from '@/lib/shopify/storefront/types'
import { __ } from '@/lib/utils'

import { fail, ok, type ActionResult } from './_shared'

type CartResult = ActionResult<Cart | null>

const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

const CART_ERROR_CODE = {
  INVALID: 'INVALID',
  INVALID_MERCHANDISE_LINE: 'INVALID_MERCHANDISE_LINE',
  LESS_THAN: 'LESS_THAN',
  GREATER_THAN: 'GREATER_THAN',
} as const

async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CART_COOKIE_NAME)?.value
}

async function setCartId(cartId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set({
    name: CART_COOKIE_NAME,
    value: cartId,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: CART_COOKIE_MAX_AGE,
  })
}

function translateCartError(
  error: CartUserError,
  fallbackKey: 'cart.error.generic' | 'cart.error.not_found',
): string {
  switch (error.code) {
    case CART_ERROR_CODE.INVALID_MERCHANDISE_LINE:
      return __('cart.error.invalid_product')
    case CART_ERROR_CODE.LESS_THAN:
    case CART_ERROR_CODE.GREATER_THAN:
      return __('cart.error.invalid_quantity')
    case CART_ERROR_CODE.INVALID:
      return __('cart.error.item_not_found')
    default:
      return error.message || __(fallbackKey)
  }
}

export async function addToCart(
  merchandiseId: string,
  quantity: number = 1,
): Promise<CartResult> {
  const cartId = await getCartId()
  const lines = [{ merchandiseId, quantity }]

  const { cart, userErrors } = cartId
    ? await addToCartMutation(cartId, lines)
    : await createCart(lines)

  if (userErrors.length > 0) {
    return fail(translateCartError(userErrors[0], 'cart.error.generic'))
  }

  if (!cartId && cart) {
    await setCartId(cart.id)
  }

  updateTag(CART_CACHE_TAG)

  return ok(cart)
}

export async function updateCartItem(
  lineId: string,
  quantity: number,
): Promise<CartResult> {
  if (quantity <= 0) {
    return removeFromCart(lineId)
  }

  const cartId = await getCartId()

  if (!cartId) {
    return fail(__('cart.error.not_found'))
  }

  const { cart, userErrors } = await updateCartLines(cartId, [
    { id: lineId, quantity },
  ])

  if (userErrors.length > 0) {
    return fail(translateCartError(userErrors[0], 'cart.error.generic'))
  }

  updateTag(CART_CACHE_TAG)

  return ok(cart)
}

export async function removeFromCart(lineId: string): Promise<CartResult> {
  const cartId = await getCartId()

  if (!cartId) {
    return fail(__('cart.error.not_found'))
  }

  const { cart, userErrors } = await removeFromCartMutation(cartId, [lineId])

  if (userErrors.length > 0) {
    return fail(translateCartError(userErrors[0], 'cart.error.generic'))
  }

  updateTag(CART_CACHE_TAG)

  return ok(cart)
}

export async function redirectToCheckout(checkoutUrl: string): Promise<never> {
  redirect(checkoutUrl)
}
