import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getOrder } from '@/lib/loaders/orders'
import { OrderDetail } from '@/components/account/order-detail'
import { Skeleton } from '@/components/ui/skeleton'

type OrderPageProps = {
  params: Promise<{ id: string }>
}

async function OrderContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(decodeURIComponent(id))

  if (!order) {
    notFound()
  }

  return <OrderDetail order={order} />
}

function OrderSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-64 w-full" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}

export default function OrderPage({ params }: OrderPageProps) {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderContent params={params} />
    </Suspense>
  )
}
