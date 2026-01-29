import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { __ } from '@/lib/utils'
import { getOrders } from '@/actions/account'
import { isAuthenticated } from '@/actions/auth'
import { OrderList } from '@/components/account/order-list'

export const metadata: Metadata = {
  title: __('orders.title'),
  description: __('orders.description'),
}

export default async function OrdersPage() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/login?redirect=/orders')
  }

  const ordersResult = await getOrders(20)
  const orders = ordersResult?.orders ?? []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{__('orders.title')}</h1>
        <p className="text-muted-foreground">{__('orders.description')}</p>
      </div>

      <OrderList orders={orders} />
    </div>
  )
}
