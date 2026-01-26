'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

import { __ } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'

import { CartItem } from './cart-item'
import { CartSummary } from './cart-summary'

export function CartContent() {
  const { cart } = useCart()

  const isEmpty = !cart || cart.lines.length === 0

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShoppingBag className="h-16 w-16 text-zinc-300" />
        <p className="mt-4 text-lg text-zinc-500">{__('cart.empty')}</p>
        <Button asChild className="mt-6">
          <Link href="/products">{__('cart.explore_products')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 p-4">
          {cart.lines.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-lg border border-zinc-200 p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {__('cart.order_summary')}
          </h2>
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
