'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'

import { addOrderToCart } from '@/lib/actions/cart'
import { __ } from '@/lib/utils'

type UseBuyAgainReturn = {
  buyAgain: () => void
  isPending: boolean
}

export function useBuyAgain(orderId: string): UseBuyAgainReturn {
  const [isPending, startTransition] = useTransition()

  const buyAgain = () => {
    startTransition(async () => {
      const result = await addOrderToCart(orderId)

      if (!result.success) {
        toast.error(result.error || __('cart.add_order.error'))
        return
      }

      const skipped = result.data?.skipped ?? 0

      if (skipped > 0) {
        toast.warning(__('cart.add_order.partial', { count: skipped }))
      }
    })
  }

  return { buyAgain, isPending }
}
