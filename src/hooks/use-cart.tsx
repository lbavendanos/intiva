'use client'

import { use, useContext, useOptimistic, useTransition } from 'react'

import type {
  Cart,
  CartLineItem,
  Image,
  Maybe,
  Money,
  ProductVariant,
} from '@/lib/shopify/types'
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateCartItem as updateCartItemAction,
} from '@/actions/cart'
import { CartContext } from '@/components/shop/cart-provider'

export type AddItemPayload = {
  variant: ProductVariant
  product: {
    id: string
    title: string
    handle: string
    featuredImage: Maybe<Image>
  }
  quantity: number
}

type OptimisticAction =
  | { type: 'ADD_ITEM'; payload: AddItemPayload }
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

function createOptimisticCartLineItem(payload: AddItemPayload): CartLineItem {
  const { variant, product, quantity } = payload
  const totalAmount = multiplyMoney(variant.price, quantity)

  return {
    id: `optimistic-${variant.id}-${Date.now()}`,
    quantity,
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        title: product.title,
        handle: product.handle,
        featuredImage: product.featuredImage,
      },
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
    },
    cost: {
      totalAmount,
      amountPerQuantity: variant.price,
      compareAtAmountPerQuantity: variant.compareAtPrice,
    },
  }
}

function cartReducer(
  state: Cart | null,
  action: OptimisticAction,
): Cart | null {
  if (!state) {
    if (action.type === 'ADD_ITEM') {
      const newLineItem = createOptimisticCartLineItem(action.payload)
      return {
        id: `optimistic-cart-${Date.now()}`,
        checkoutUrl: '',
        totalQuantity: action.payload.quantity,
        lines: [newLineItem],
        cost: {
          subtotalAmount: newLineItem.cost.totalAmount,
          totalAmount: newLineItem.cost.totalAmount,
        },
      }
    }
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
    case 'ADD_ITEM': {
      const newLineItem = createOptimisticCartLineItem(action.payload)
      const existingLineIndex = state.lines.findIndex(
        (line) => line.merchandise.id === action.payload.variant.id,
      )

      let newLines: CartLineItem[]
      if (existingLineIndex >= 0) {
        newLines = state.lines.map((line, index) => {
          if (index !== existingLineIndex) return line
          const newQuantity = line.quantity + action.payload.quantity
          const newTotalAmount = multiplyMoney(
            line.cost.amountPerQuantity,
            newQuantity,
          )
          return {
            ...line,
            quantity: newQuantity,
            cost: { ...line.cost, totalAmount: newTotalAmount },
          }
        })
      } else {
        newLines = [newLineItem, ...state.lines]
      }

      const totalQuantity = newLines.reduce(
        (sum, line) => sum + line.quantity,
        0,
      )
      const cost = calculateCartTotals(newLines)
      return { ...state, lines: newLines, totalQuantity, cost }
    }
    default:
      return state
  }
}

export type UseCartReturn = {
  cart: Cart | null
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  openCart: () => void
  closeCart: () => void
  isPending: boolean
  updateQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
  addItem: (payload: AddItemPayload) => void
}

export function useCart(): UseCartReturn {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  const { cartPromise, isOpen, setIsOpen, openCart, closeCart } = context

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

  const addItem = (payload: AddItemPayload) => {
    startTransition(async () => {
      addOptimisticUpdate({ type: 'ADD_ITEM', payload })
      await addToCartAction(payload.variant.id, payload.quantity)
    })
  }

  return {
    cart: optimisticCart,
    isOpen,
    setIsOpen,
    openCart,
    closeCart,
    isPending,
    updateQuantity,
    removeItem,
    addItem,
  }
}
