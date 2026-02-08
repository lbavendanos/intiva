'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Star, Trash2 } from 'lucide-react'

import type { CustomerAddress } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { deleteAddress, setDefaultAddress } from '@/actions/account'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
          <Card key={address.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                {address.firstName} {address.lastName}
              </CardTitle>
              {isDefault && (
                <Badge variant="secondary">{__('addresses.default')}</Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-sm text-zinc-600">
                {address.formatted.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/account/addresses/${encodeURIComponent(address.id)}`}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
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
                      <Star className="mr-1 h-3 w-3" />
                      {__('addresses.set_default')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      {__('addresses.delete')}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
