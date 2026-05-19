import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { getOrders } from '@/lib/data/orders'
import { __ } from '@/lib/utils'
import { DefaultAddressCard } from '@/components/account/default-address-card'
import { OrderList } from '@/components/account/order-list'
import { WelcomeCard } from '@/components/account/welcome-card'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: __('account.dashboard'),
}

async function RecentOrders() {
  const result = await getOrders()
  const orders = result?.orders ?? []

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">
          {__('account.recent_orders')}
        </h2>
        <Link
          href="/account/orders"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          {__('orders.view_all')}
        </Link>
      </div>
      <OrderList orders={orders.slice(0, 3)} />
    </div>
  )
}

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <WelcomeCard />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <RecentOrders />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <DefaultAddressCard />
      </Suspense>
    </div>
  )
}
