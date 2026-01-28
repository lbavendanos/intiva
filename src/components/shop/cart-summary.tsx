import type { Cart } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

import { CheckoutButton } from './checkout-button'
import { Price } from './price'

type CartSummaryProps = {
  cart: Cart
}

export function CartSummary({ cart }: CartSummaryProps) {
  const { cost, checkoutUrl } = cart

  return (
    <div className="space-y-4" data-testid="cart-summary">
      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">{__('cart.subtotal')}</span>
          <Price
            className="font-medium"
            amount={cost.subtotalAmount.amount}
            currencyCode={cost.subtotalAmount.currencyCode}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">{__('cart.shipping')}</span>
          <span className="text-zinc-600">
            {__('cart.shipping_calculated')}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-base font-semibold">
        <span>{__('cart.total')}</span>
        <Price
          amount={cost.totalAmount.amount}
          currencyCode={cost.totalAmount.currencyCode}
        />
      </div>

      <CheckoutButton checkoutUrl={checkoutUrl} />

      <p className="text-center text-xs text-zinc-500">
        {__('cart.taxes_note')}
      </p>
    </div>
  )
}
