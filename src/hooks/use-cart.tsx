'use client'

import { use, useContext, useOptimistic, useTransition } from 'react'

import type { Cart, CartLineItem } from '@/lib/shopify/storefront/types'
import type { Money } from '@/lib/shopify/types'
import {
  removeFromCart as removeFromCartAction,
  updateCartItem as updateCartItemAction,
} from '@/actions/cart'
import { CartContext } from '@/components/shop/cart-provider'

type OptimisticAction =
  | { type: 'UPDATE_QUANTITY'; lineId: string; quantity: number }
  | { type: 'REMOVE_ITEM'; lineId: string }

type UseCartReturn = {
  cart: Cart | null
  isPending: boolean
  updateQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
}

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

function cartReducer(
  state: Cart | null,
  action: OptimisticAction,
): Cart | null {
  if (!state) {
    return state
  }

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

export function useCart(): UseCartReturn {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  const { cartPromise } = context

  const initialCart = use(cartPromise)
  const [isPending, startTransition] = useTransition()
  const [optimisticCart, addOptimisticUpdate] = useOptimistic(
    initialCart,
    cartReducer,
  )

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

  return {
    cart: optimisticCart,
    isPending,
    updateQuantity,
    removeItem,
  }
}
