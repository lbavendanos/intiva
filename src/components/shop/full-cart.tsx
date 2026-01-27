'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

import { __ } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { CartItem } from './cart-item'
import { CartSummary } from './cart-summary'

export function FullCart() {
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

export function FullCartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <Skeleton className="h-24 w-24 rounded-md" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-lg border border-zinc-200 p-6">
          <Skeleton className="mb-4 h-6 w-1/2" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="mt-4 h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
