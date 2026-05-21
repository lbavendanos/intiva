'use client'

import { use, useOptimistic, useTransition } from 'react'
import { toast } from 'sonner'

import {
  removeFromCart as removeFromCartAction,
  updateCartItem as updateCartItemAction,
} from '@/lib/actions/cart'
import type { ActionResult } from '@/lib/actions/types'
import type { Cart, CartLineItem } from '@/lib/shopify/storefront/types'
import type { Money } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'
import { CartContext } from '@/components/shop/cart-provider'

type CartActionResult = ActionResult<Cart | null>

type OptimisticAction =
  | { type: 'UPDATE_QUANTITY'; lineId: string; quantity: number }
  | { type: 'REMOVE_ITEM'; lineId: string }

type UseCartReturn = {
  cart: Cart | null
  isPending: boolean
  updateQuantity: (
    lineId: string,
    quantity: number,
  ) => Promise<CartActionResult>
  removeItem: (lineId: string) => Promise<CartActionResult>
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
  const context = use(CartContext)

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

  const notifyOnError = (result: CartActionResult) => {
    if (!result.success) {
      toast.error(result.error || __('cart.error.generic'))
    }
    return result
  }

  const updateQuantity = (lineId: string, quantity: number) => {
    return new Promise<CartActionResult>((resolve) => {
      startTransition(async () => {
        addOptimisticUpdate({ type: 'UPDATE_QUANTITY', lineId, quantity })
        resolve(notifyOnError(await updateCartItemAction(lineId, quantity)))
      })
    })
  }

  const removeItem = (lineId: string) => {
    return new Promise<CartActionResult>((resolve) => {
      startTransition(async () => {
        addOptimisticUpdate({ type: 'REMOVE_ITEM', lineId })
        resolve(notifyOnError(await removeFromCartAction(lineId)))
      })
    })
  }

  return {
    cart: optimisticCart,
    isPending,
    updateQuantity,
    removeItem,
  }
}
