'use server'

import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

import {
  addToCart as addToCartMutation,
  createCart,
  removeFromCart as removeFromCartMutation,
  updateCartLines,
} from '@/lib/shopify/mutations'
import { getCart as getCartQuery } from '@/lib/shopify/queries'
import type { Cart } from '@/lib/shopify/types'

const CART_COOKIE_NAME = 'cartId'
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

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
      return {
        success: false,
        cart: null,
        error: userErrors[0].message,
      }
    }

    if (cart) {
      await setCartId(cart.id)
      revalidateTag('cart', 'max')
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
    return {
      success: false,
      cart: null,
      error: userErrors[0].message,
    }
  }

  revalidateTag('cart', 'max')

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
      error: 'No cart found',
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
    return {
      success: false,
      cart: null,
      error: userErrors[0].message,
    }
  }

  revalidateTag('cart', 'max')

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
      error: 'No cart found',
    }
  }

  const { cart, userErrors } = await removeFromCartMutation(cartId, [lineId])

  if (userErrors.length > 0) {
    return {
      success: false,
      cart: null,
      error: userErrors[0].message,
    }
  }

  revalidateTag('cart', 'max')

  return {
    success: true,
    cart,
  }
}
