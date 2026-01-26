import { Suspense } from 'react'

import { Header } from '@/components/layout/header'
import { HeaderSkeleton } from '@/components/layout/header-skeleton'
import { CartProvider } from '@/components/shop/cart-provider'
import { getCart } from '@/actions/cart'

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<HeaderSkeleton />}>
        <CartProviderWrapper>{children}</CartProviderWrapper>
      </Suspense>
    </div>
  )
}

async function CartProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const cart = await getCart()

  return (
    <CartProvider initialCart={cart}>
      <Header />
      <main className="flex-1">{children}</main>
    </CartProvider>
  )
}
