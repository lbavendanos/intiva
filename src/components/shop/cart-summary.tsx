import type { Cart } from '@/lib/shopify/types'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

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
          <span className="text-zinc-600">Subtotal</span>
          <Price
            className="font-medium"
            amount={cost.subtotalAmount.amount}
            currencyCode={cost.subtotalAmount.currencyCode}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Envío</span>
          <span className="text-zinc-600">Calculado en checkout</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-base font-semibold">
        <span>Total</span>
        <Price
          amount={cost.totalAmount.amount}
          currencyCode={cost.totalAmount.currencyCode}
        />
      </div>

      <Button asChild className="w-full" size="lg">
        <a href={checkoutUrl}>Finalizar compra</a>
      </Button>

      <p className="text-center text-xs text-zinc-500">
        Impuestos y envío calculados en el checkout
      </p>
    </div>
  )
}
