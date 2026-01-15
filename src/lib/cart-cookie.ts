import { cookies } from 'next/headers'

const CART_COOKIE_NAME = 'cartId'
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CART_COOKIE_NAME)?.value
}

export async function setCartId(cartId: string): Promise<void> {
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

export async function deleteCartId(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CART_COOKIE_NAME)
}
