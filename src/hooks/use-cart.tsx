'use client'

import { use, useOptimistic, useTransition } from 'react'
import { toast } from 'sonner'

import {
  removeFromCart as removeFromCartAction,
  updateCartItem as updateCartItemAction,
} from '@/lib/actions/cart'
import type { ActionResult } from '@/lib/actions/types'
import { cartReducer } from '@/lib/domain/cart'
import type { Cart } from '@/lib/shopify/storefront/types'
import { __ } from '@/lib/utils'
import { CartContext } from '@/components/shop/cart-provider'

type CartActionResult = ActionResult<Cart | null>

type UseCartReturn = {
  cart: Cart | null
  isPending: boolean
  updateQuantity: (
    lineId: string,
    quantity: number,
  ) => Promise<CartActionResult>
  removeItem: (lineId: string) => Promise<CartActionResult>
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
