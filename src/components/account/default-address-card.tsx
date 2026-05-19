'use client'

import { __ } from '@/lib/utils'
import { useCustomer } from '@/hooks/use-customer'

import { AddressCard } from './address-card'

export function DefaultAddressCard() {
  const customer = useCustomer()

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">
        {__('account.default_address')}
      </h2>
      {customer?.defaultAddress ? (
        <AddressCard address={customer.defaultAddress} />
      ) : (
        <p className="text-sm text-zinc-500">{__('account.no_address')}</p>
      )}
    </div>
  )
}
