'use client'

import { useTransition } from 'react'

import { __ } from '@/lib/utils'
import { redirectToCheckout } from '@/actions/cart'
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
