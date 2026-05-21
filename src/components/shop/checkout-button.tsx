'use client'

import { useTransition } from 'react'

import { redirectToCheckout } from '@/lib/actions/cart'
import { __ } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type CheckoutButtonProps = {
  checkoutUrl: string
}

export function CheckoutButton({ checkoutUrl }: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleCheckout() {
    startTransition(async () => {
      await redirectToCheckout(checkoutUrl)
    })
  }

  return (
    <Button
      className="w-full"
      size="lg"
      disabled={isPending}
      onClick={handleCheckout}
    >
      {isPending ? __('cart.checkout_redirecting') : __('cart.checkout')}
    </Button>
  )
}
