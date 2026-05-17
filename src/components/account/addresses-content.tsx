'use client'

import { __ } from '@/lib/utils'
import { useCustomer } from '@/hooks/use-customer'

import { AddressList } from './address-list'

export function AddressesContent() {
  const customer = useCustomer()

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
