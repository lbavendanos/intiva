import { Suspense } from 'react'

import { __ } from '@/lib/utils'
import { AccountNav } from '@/components/account/account-nav'
import { Skeleton } from '@/components/ui/skeleton'

function AccountNavSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  )
}

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900">
        {__('account.title')}
      </h1>
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-56">
          <Suspense fallback={<AccountNavSkeleton />}>
            <AccountNav />
          </Suspense>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
