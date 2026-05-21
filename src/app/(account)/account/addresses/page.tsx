import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'

import { __ } from '@/lib/utils'
import { AddressDialog } from '@/components/account/address-dialog'
import { AddressList } from '@/components/account/address-list'
import { AddressProvider } from '@/components/account/address-provider'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: __('addresses.title'),
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
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-zinc-900">
          {__('addresses.title')}
        </h2>
        <AddressDialog>
          <Button>
            <PlusIcon data-icon="inline-start" />
            {__('addresses.add')}
          </Button>
        </AddressDialog>
      </div>
      <Suspense fallback={<AddressesSkeleton />}>
        <AddressProvider>
          <AddressList />
        </AddressProvider>
      </Suspense>
    </div>
  )
}
