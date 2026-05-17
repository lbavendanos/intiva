import { Suspense } from 'react'

import { __ } from '@/lib/utils'
import { AddressEditContent } from '@/components/account/address-edit-content'
import { Skeleton } from '@/components/ui/skeleton'

type AddressEditPageProps = {
  params: Promise<{ id: string }>
}

function AddressEditSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
      <Skeleton className="h-10 w-24" />
    </div>
  )
}

export default function AddressEditPage({ params }: AddressEditPageProps) {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-zinc-900">
        {__('addresses.edit')}
      </h2>
      <Suspense fallback={<AddressEditSkeleton />}>
        <AddressEditContent params={params} />
      </Suspense>
    </div>
  )
}
