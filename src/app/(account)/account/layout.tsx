import { Suspense } from 'react'

import { getCustomer } from '@/lib/loaders/customer'
import { __ } from '@/lib/utils'
import {
  AccountBottomNav,
  AccountBottomNavSkeleton,
} from '@/components/account/account-bottom-nav'
import {
  AccountSidebarNav,
  AccountSidebarNavSkeleton,
} from '@/components/account/account-sidebar-nav'
import { CustomerProvider } from '@/components/account/customer-provider'

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const customerPromise = getCustomer()

  return (
    <CustomerProvider customerPromise={customerPromise}>
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">
          {__('account.title')}
        </h1>
        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="hidden shrink-0 md:block md:w-56">
            <Suspense fallback={<AccountSidebarNavSkeleton />}>
              <AccountSidebarNav />
            </Suspense>
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
      <Suspense fallback={<AccountBottomNavSkeleton />}>
        <AccountBottomNav />
      </Suspense>
    </CustomerProvider>
  )
}
