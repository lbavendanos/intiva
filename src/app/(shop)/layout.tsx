import { Suspense } from 'react'

import { Header } from '@/components/layout/header'

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
    </div>
  )
}

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="h-6 w-24 animate-pulse rounded bg-zinc-200" />
        <div className="h-9 w-9 animate-pulse rounded bg-zinc-200" />
      </div>
    </header>
  )
}
