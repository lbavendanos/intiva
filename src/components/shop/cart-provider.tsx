'use client'

import { createContext, useState, type ReactNode } from 'react'

import type { Cart } from '@/lib/shopify/types'

type CartContextValue = {
  cartPromise: Promise<Cart | null>
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  openCart: () => void
  closeCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

type CartProviderProps = {
  children: ReactNode
  cartPromise: Promise<Cart | null>
}

export function CartProvider({ children, cartPromise }: CartProviderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <CartContext
      value={{
        cartPromise,
        isOpen,
        setIsOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext>
  )
}
