import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { __ } from '@/lib/utils'
import { getCustomerSession } from '@/actions/auth'
import { AccountNav } from '@/components/account/account-nav'
import { Skeleton } from '@/components/ui/skeleton'

type AccountLayoutProps = {
  children: React.ReactNode
}

async function AccountContent({ children }: { children: React.ReactNode }) {
  const customer = await getCustomerSession()

  if (!customer) {
    redirect('/login?redirect=/account')
  }

  const displayName = customer.firstName || customer.displayName || ''

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {displayName
            ? __('account.welcome', { name: displayName })
            : __('account.welcome_guest')}
        </h1>
        <p className="text-muted-foreground">{__('account.description')}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <AccountNav />
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      <div className="mt-8 border-t pt-8 lg:hidden">
        <AccountNav />
      </div>
    </div>
  )
}

function AccountSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden space-y-2 lg:block">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </aside>

        <main>
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    </div>
  )
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <Suspense fallback={<AccountSkeleton />}>
      <AccountContent>{children}</AccountContent>
    </Suspense>
  )
}
