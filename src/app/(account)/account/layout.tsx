import { Suspense } from 'react'

import { AccountNav } from '@/components/account/account-nav'
import {
  AccountWelcome,
  AccountWelcomeSkeleton,
} from '@/components/account/account-welcome'

type AccountLayoutProps = {
  children: React.ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<AccountWelcomeSkeleton />}>
        <AccountWelcome />
      </Suspense>

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
