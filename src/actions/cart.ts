'use server'

import { cacheLife, cacheTag, updateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  addToCart as addToCartMutation,
  createCart,
  removeFromCart as removeFromCartMutation,
  updateCartLines,
} from '@/lib/shopify/mutations'
import { getCart as getCartQuery } from '@/lib/shopify/queries'
import type { Cart } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'

const CART_COOKIE_NAME = 'cartId'
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const CART_CACHE_TAG = 'cart'

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

export type CartActionResult = {
  success: boolean
  cart: Cart | null
  error?: string
}

export async function getCart(): Promise<Cart | null> {
  'use cache: private'
  cacheTag(CART_CACHE_TAG)
  cacheLife('seconds')

  const cartId = await getCartId()

  if (!cartId) {
    return null
  }

  const cart = await getCartQuery(cartId)

  // If cart doesn't exist or is invalid, return null
  if (!cart) {
    return null
  }

  return cart
}

export async function addToCart(
  merchandiseId: string,
  quantity: number = 1,
): Promise<CartActionResult> {
  const cartId = await getCartId()

  if (!cartId) {
    // Create a new cart with the item
    const { cart, userErrors } = await createCart([{ merchandiseId, quantity }])

    if (userErrors.length > 0) {
      const error = userErrors[0]

      if (error.code === CART_ERROR_CODE.INVALID_MERCHANDISE_LINE) {
        return {
          success: false,
          cart: null,
          error: __('cart.error.invalid_product'),
        }
      }

      return {
        success: false,
        cart: null,
        error: error.message || __('cart.error.generic'),
      }
    }

    if (cart) {
      await setCartId(cart.id)
      updateTag(CART_CACHE_TAG)
    }

    return {
      success: true,
      cart,
    }
  }

  // Add to existing cart
  const { cart, userErrors } = await addToCartMutation(cartId, [
    { merchandiseId, quantity },
  ])

  if (userErrors.length > 0) {
    const error = userErrors[0]

    if (error.code === CART_ERROR_CODE.INVALID_MERCHANDISE_LINE) {
      return {
        success: false,
        cart: null,
        error: __('cart.error.invalid_product'),
      }
    }

    return {
      success: false,
      cart: null,
      error: error.message || __('cart.error.generic'),
    }
  }

  updateTag(CART_CACHE_TAG)

  return {
    success: true,
    cart,
  }
}

export async function updateCartItem(
  lineId: string,
  quantity: number,
): Promise<CartActionResult> {
  const cartId = await getCartId()

  if (!cartId) {
    return {
      success: false,
      cart: null,
      error: __('cart.error.not_found'),
    }
  }

  // If quantity is 0, remove the item instead
  if (quantity <= 0) {
    return removeFromCart(lineId)
  }

  const { cart, userErrors } = await updateCartLines(cartId, [
    { id: lineId, quantity },
  ])

  if (userErrors.length > 0) {
    const error = userErrors[0]

    if (
      error.code === CART_ERROR_CODE.LESS_THAN ||
      error.code === CART_ERROR_CODE.GREATER_THAN
    ) {
      return {
        success: false,
        cart: null,
        error: __('cart.error.invalid_quantity'),
      }
    }

    if (error.code === CART_ERROR_CODE.INVALID) {
      return {
        success: false,
        cart: null,
        error: __('cart.error.item_not_found'),
      }
    }

    return {
      success: false,
      cart: null,
      error: error.message || __('cart.error.generic'),
    }
  }

  updateTag(CART_CACHE_TAG)

  return {
    success: true,
    cart,
  }
}

export async function removeFromCart(
  lineId: string,
): Promise<CartActionResult> {
  const cartId = await getCartId()

  if (!cartId) {
    return {
      success: false,
      cart: null,
      error: __('cart.error.not_found'),
    }
  }

  const { cart, userErrors } = await removeFromCartMutation(cartId, [lineId])

  if (userErrors.length > 0) {
    const error = userErrors[0]

    if (error.code === CART_ERROR_CODE.INVALID) {
      return {
        success: false,
        cart: null,
        error: __('cart.error.item_not_found'),
      }
    }

    return {
      success: false,
      cart: null,
      error: error.message || __('cart.error.generic'),
    }
  }

  updateTag(CART_CACHE_TAG)

  return {
    success: true,
    cart,
  }
}

export async function redirectToCheckout(checkoutUrl: string): Promise<never> {
  redirect(checkoutUrl)
}
