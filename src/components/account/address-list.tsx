'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { PencilIcon, StarIcon, TrashIcon } from '@phosphor-icons/react'

import type { CustomerAddress } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { deleteAddress, setDefaultAddress } from '@/actions/address'
import { Button } from '@/components/ui/button'

import { AddressCard } from './address-card'

type AddressListProps = {
  addresses: CustomerAddress[]
  defaultAddressId: string | null
}

export function AddressList({ addresses, defaultAddressId }: AddressListProps) {
  const [isPending, startTransition] = useTransition()

  if (addresses.length === 0) {
    return <p className="text-center text-zinc-500">{__('addresses.empty')}</p>
  }

  function handleDelete(addressId: string) {
    startTransition(async () => {
      await deleteAddress(addressId)
    })
  }

  function handleSetDefault(addressId: string) {
    startTransition(async () => {
      await setDefaultAddress(addressId)
    })
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {addresses.map((address) => {
        const isDefault = address.id === defaultAddressId

        return (
          <AddressCard key={address.id} address={address} isDefault={isDefault}>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/account/addresses/${encodeURIComponent(address.id)}`}
                >
                  <PencilIcon data-icon="inline-start" />
                  {__('addresses.edit')}
                </Link>
              </Button>
              {!isDefault && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleSetDefault(address.id)}
                  >
                    <StarIcon data-icon="inline-start" />
                    {__('addresses.set_default')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleDelete(address.id)}
                  >
                    <TrashIcon data-icon="inline-start" />
                    {__('addresses.delete')}
                  </Button>
                </>
              )}
            </div>
          </AddressCard>
        )
      })}
    </div>
  )
}
