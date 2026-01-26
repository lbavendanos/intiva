'use client'

import {
  createContext,
  useContext,
  useOptimistic,
  useState,
  useTransition,
  type ReactNode,
} from 'react'

import type { Cart, CartLineItem, Money } from '@/lib/shopify/types'
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateCartItem as updateCartItemAction,
} from '@/actions/cart'

type OptimisticAction =
  | { type: 'UPDATE_QUANTITY'; lineId: string; quantity: number }
  | { type: 'REMOVE_ITEM'; lineId: string }

function multiplyMoney(money: Money, quantity: number): Money {
  const amount = (parseFloat(money.amount) * quantity).toFixed(2)
  return { amount, currencyCode: money.currencyCode }
}

function calculateCartTotals(lines: CartLineItem[]): {
  subtotalAmount: Money
  totalAmount: Money
} {
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? 'USD'
  const subtotal = lines.reduce(
    (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
    0,
  )
  const subtotalAmount: Money = {
    amount: subtotal.toFixed(2),
    currencyCode,
  }
  return { subtotalAmount, totalAmount: subtotalAmount }
}

type CartContextValue = {
  cart: Cart | null
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  openCart: () => void
  closeCart: () => void
  isPending: boolean
  updateQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
  addItem: (merchandiseId: string, quantity?: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)

function cartReducer(
  state: Cart | null,
  action: OptimisticAction,
): Cart | null {
  if (!state) return state

  switch (action.type) {
    case 'UPDATE_QUANTITY': {
      const newLines = state.lines.map((line) => {
        if (line.id !== action.lineId) return line

        const newTotalAmount = multiplyMoney(
          line.cost.amountPerQuantity,
          action.quantity,
        )
        return {
          ...line,
          quantity: action.quantity,
          cost: { ...line.cost, totalAmount: newTotalAmount },
        }
      })
      const totalQuantity = newLines.reduce(
        (sum, line) => sum + line.quantity,
        0,
      )
      const cost = calculateCartTotals(newLines)
      return { ...state, lines: newLines, totalQuantity, cost }
    }
    case 'REMOVE_ITEM': {
      const newLines = state.lines.filter((line) => line.id !== action.lineId)
      const totalQuantity = newLines.reduce(
        (sum, line) => sum + line.quantity,
        0,
      )
      const cost =
        newLines.length > 0 ? calculateCartTotals(newLines) : state.cost
      return { ...state, lines: newLines, totalQuantity, cost }
    }
    default:
      return state
  }
}

type CartProviderProps = {
  children: ReactNode
  initialCart: Cart | null
}

export function CartProvider({ children, initialCart }: CartProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [optimisticCart, addOptimisticUpdate] = useOptimistic(
    initialCart,
    cartReducer,
  )

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const updateQuantity = (lineId: string, quantity: number) => {
    startTransition(async () => {
      addOptimisticUpdate({ type: 'UPDATE_QUANTITY', lineId, quantity })
      await updateCartItemAction(lineId, quantity)
    })
  }

  const removeItem = (lineId: string) => {
    startTransition(async () => {
      addOptimisticUpdate({ type: 'REMOVE_ITEM', lineId })
      await removeFromCartAction(lineId)
    })
  }

  const addItem = (merchandiseId: string, quantity: number = 1) => {
    startTransition(async () => {
      await addToCartAction(merchandiseId, quantity)
    })
  }

  return (
    <CartContext
      value={{
        cart: optimisticCart,
        isOpen,
        setIsOpen,
        openCart,
        closeCart,
        isPending,
        updateQuantity,
        removeItem,
        addItem,
      }}
    >
      {children}
    </CartContext>
  )
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
