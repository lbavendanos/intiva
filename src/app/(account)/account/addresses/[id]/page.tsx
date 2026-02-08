import { Suspense } from 'react'
import { notFound } from 'next/navigation'

import { __ } from '@/lib/utils'
import { getCustomerProfile } from '@/actions/account'
import { AddressForm } from '@/components/account/address-form'
import { Skeleton } from '@/components/ui/skeleton'

type AddressEditPageProps = {
  params: Promise<{ id: string }>
}

async function AddressEditContent({ addressId }: { addressId: string }) {
  const result = await getCustomerProfile()

  if (!result.success || !result.data) {
    notFound()
  }

  const customer = result.data
  const address = customer.addresses.find((a) => a.id === addressId)

  if (!address) {
    notFound()
  }

  const isDefault = customer.defaultAddress?.id === addressId

  return <AddressForm address={address} isDefault={isDefault} />
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
        {params.then(({ id }) => (
          <AddressEditContent addressId={decodeURIComponent(id)} />
        ))}
      </Suspense>
    </div>
  )
}
