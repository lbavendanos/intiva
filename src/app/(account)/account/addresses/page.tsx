import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getCustomer } from '@/lib/data/customer'
import { __ } from '@/lib/utils'
import { AddressForm } from '@/components/account/address-form'
import { AddressList } from '@/components/account/address-list'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: __('addresses.title'),
}

async function AddressesContent() {
  const customer = await getCustomer()

  if (!customer) {
    return (
      <p className="text-center text-zinc-500">{__('account.error.generic')}</p>
    )
  }

  return (
    <AddressList
      addresses={customer.addresses}
      defaultAddressId={customer.defaultAddress?.id ?? null}
    />
  )
}

function AddressesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  )
}

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">
          {__('addresses.title')}
        </h2>
      </div>
      <Suspense fallback={<AddressesSkeleton />}>
        <AddressesContent />
      </Suspense>
      <div>
        <h3 className="mb-4 text-lg font-semibold text-zinc-900">
          {__('addresses.add')}
        </h3>
        <AddressForm />
      </div>
    </div>
  )
}
