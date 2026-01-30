import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { __ } from '@/lib/utils'
import { getCustomerOrder } from '@/actions/customer'
import { OrderDetail } from '@/components/account/order-detail'

type OrderDetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const orderNumber = parseInt(id, 10)

  return {
    title: __('order.title', { number: orderNumber }),
    description: __('order.description', { number: orderNumber }),
  }
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params
  const orderNumber = parseInt(id, 10)

  if (isNaN(orderNumber)) {
    notFound()
  }

  const order = await getCustomerOrder(orderNumber)

  if (!order) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrderDetail order={order} />
    </div>
  )
}
