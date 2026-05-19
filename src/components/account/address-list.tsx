'use client'

import { useTransition } from 'react'
import { PencilIcon, StarIcon, TrashIcon } from '@phosphor-icons/react'

import type { CustomerAddress } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { deleteAddress, setDefaultAddress } from '@/actions/address'
import { Button } from '@/components/ui/button'

import { AddressCard } from './address-card'
import { AddressDialog } from './address-dialog'

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
          <AddressCard
            key={address.id}
            address={address}
            isDefault={isDefault}
            footer={
              <div className="flex gap-2">
                <AddressDialog address={address} isDefault={isDefault}>
                  <Button variant="outline" size="sm">
                    <PencilIcon data-icon="inline-start" />
                    {__('addresses.edit')}
                  </Button>
                </AddressDialog>
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
            }
          />
        )
      })}
    </div>
  )
}
