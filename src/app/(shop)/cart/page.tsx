import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

import { getCart } from '@/lib/actions/cart'
import { CartItem, CartSummary } from '@/components/shop'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Carrito',
  description: 'Tu carrito de compras',
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Carrito de compras</h1>
      <Suspense fallback={<CartSkeleton />}>
        <CartContent />
      </Suspense>
    </div>
  )
}

async function CartContent() {
  const cart = await getCart()

  const isEmpty = !cart || cart.lines.length === 0

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShoppingBag className="h-16 w-16 text-zinc-300" />
        <p className="mt-4 text-lg text-zinc-500">Tu carrito está vacío</p>
        <Button asChild className="mt-6">
          <Link href="/products">Explorar productos</Link>
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
          <h2 className="mb-4 text-lg font-semibold">Resumen del pedido</h2>
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="space-y-4 rounded-lg border border-zinc-200 p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 py-4">
              <Skeleton className="h-20 w-20 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="space-y-4 rounded-lg border border-zinc-200 p-6">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
