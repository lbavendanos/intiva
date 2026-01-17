'use client'

import { ShoppingBag } from 'lucide-react'

import type { Cart } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'
import { useMiniCart } from '@/hooks/use-mini-cart'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { CartItem } from './cart-item'
import { CartSummary } from './cart-summary'

type MiniCartProps = {
  cart: Cart | null
}

export function MiniCart({ cart }: MiniCartProps) {
  const { isOpen, setIsOpen } = useMiniCart()

  const itemCount = cart?.totalQuantity ?? 0
  const isEmpty = !cart || cart.lines.length === 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={__('cart.aria_label', { count: itemCount })}
          data-testid="cart-button"
        >
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white"
              data-testid="cart-count"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{__('cart.title', { count: itemCount })}</SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-zinc-300" />
            <p className="mt-4 text-center text-zinc-500">{__('cart.empty')}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsOpen(false)}
            >
              {__('cart.continue_shopping')}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto" data-testid="cart-items">
              <div className="divide-y divide-zinc-200">
                {cart.lines.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
            <CartSummary cart={cart} />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
