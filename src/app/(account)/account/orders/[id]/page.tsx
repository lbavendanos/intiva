import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { getOrder } from '@/actions/account'
import { OrderDetail } from '@/components/account/order-detail'
import { Skeleton } from '@/components/ui/skeleton'

type OrderPageProps = {
  params: Promise<{ id: string }>
}

async function OrderContent({ orderId }: { orderId: string }) {
  const result = await getOrder(orderId)

  if (!result.success || !result.data) {
    notFound()
  }

  return <OrderDetail order={result.data} />
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
      {params.then(({ id }) => (
        <OrderContent orderId={decodeURIComponent(id)} />
      ))}
    </Suspense>
  )
}
