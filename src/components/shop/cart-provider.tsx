'use client'

import { createContext, type ReactNode } from 'react'

import type { Cart } from '@/lib/shopify/types'

type CartContextValue = {
  cartPromise: Promise<Cart | null>
}

export const CartContext = createContext<CartContextValue | null>(null)

type CartProviderProps = {
  children: ReactNode
  cartPromise: Promise<Cart | null>
}

export function CartProvider({ children, cartPromise }: CartProviderProps) {
  return <CartContext value={{ cartPromise }}>{children}</CartContext>
}
