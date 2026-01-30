import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { __ } from '@/lib/utils'
import { getCustomerOrders } from '@/actions/customer'
import { OrderCard } from '@/components/account/order-list'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: __('account.dashboard.title'),
  description: __('account.dashboard.overview'),
}

export default async function AccountPage() {
  const ordersResult = await getCustomerOrders(3)
  const recentOrders = ordersResult?.orders ?? []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{__('account.dashboard.recent_orders')}</CardTitle>
              <CardDescription>
                {__('account.dashboard.overview')}
              </CardDescription>
            </div>
            {recentOrders.length > 0 && (
              <Link
                href="/orders"
                className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
              >
                {__('account.dashboard.view_all_orders')}
                <ChevronRight className="size-4" />
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} compact />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">
                {__('account.dashboard.no_orders')}
              </p>
              <Link
                href="/products"
                className="text-primary text-sm font-medium hover:underline"
              >
                {__('orders.explore_products')}
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
