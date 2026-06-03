'use client'

import { __ } from '@/lib/utils'
import { useBuyAgain } from '@/hooks/use-buy-again'
import { Button } from '@/components/ui/button'

type BuyAgainButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'onClick' | 'children'
> & {
  orderId: string
}

export function BuyAgainButton({
  orderId,
  disabled,
  ...props
}: BuyAgainButtonProps) {
  const { buyAgain, isPending } = useBuyAgain(orderId)

  return (
    <Button
      type="button"
      {...props}
      onClick={buyAgain}
      disabled={disabled || isPending}
    >
      {isPending ? __('cart.add_order.adding') : __('orders.buy_again')}
    </Button>
  )
}
