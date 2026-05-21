'use client'

import { PencilIcon, StarIcon, TrashIcon } from '@phosphor-icons/react'

import { __ } from '@/lib/utils'
import { useAddress } from '@/hooks/use-address'
import { Button } from '@/components/ui/button'

import { AddressCard } from './address-card'
import { AddressDialog } from './address-dialog'

export function AddressList() {
  const { addresses, defaultAddressId, deleteAddress, setDefaultAddress } =
    useAddress()

  if (addresses.length === 0) {
    return <p className="text-center text-zinc-500">{__('addresses.empty')}</p>
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
                      onClick={() => setDefaultAddress(address.id)}
                    >
                      <StarIcon data-icon="inline-start" />
                      {__('addresses.set_default')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteAddress(address.id)}
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
