import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { __ } from '@/lib/utils'
import { getCustomerProfile, getOrders } from '@/actions/account'
import { OrderList } from '@/components/account/order-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: __('account.dashboard'),
}

async function DashboardContent() {
  const [customerResult, ordersResult] = await Promise.all([
    getCustomerProfile(),
    getOrders(),
  ])

  const customer = customerResult.data
  const orders = ordersResult.data?.orders ?? []

  return (
    <div className="space-y-6">
      {customer && (
        <Card>
          <CardHeader>
            <CardTitle>
              {__('account.welcome', { name: customer.displayName })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600">
              {customer.emailAddress?.emailAddress}
            </p>
          </CardContent>
        </Card>
      )}

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

      {customer?.defaultAddress && (
        <Card>
          <CardHeader>
            <CardTitle>{__('account.default_address')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-600">
              {customer.defaultAddress.formatted.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!customer?.defaultAddress && (
        <Card>
          <CardHeader>
            <CardTitle>{__('account.default_address')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">{__('account.no_address')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
