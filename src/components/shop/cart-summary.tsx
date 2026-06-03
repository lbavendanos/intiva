import type { Cart } from '@/lib/shopify/storefront/types'
import { __ } from '@/lib/utils'
import { Price } from '@/components/format/price'
import { Separator } from '@/components/ui/separator'

import { CheckoutButton } from './checkout-button'

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
          <Price as="p" className="font-medium" value={cost.subtotalAmount} />
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
        <Price as="p" value={cost.totalAmount} />
      </div>

      <CheckoutButton checkoutUrl={checkoutUrl} />

      <p className="text-center text-xs text-zinc-500">
        {__('cart.taxes_note')}
      </p>
    </div>
  )
}
