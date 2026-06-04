'use client'

import Link from 'next/link'
import { CaretRightIcon, MapPinIcon } from '@phosphor-icons/react'

import { __ } from '@/lib/utils'
import { useCustomer } from '@/hooks/use-customer'

import { AddressCard } from './address-card'

export function AddressSummaryCard() {
  const customer = useCustomer()
  const defaultAddress = customer?.defaultAddress

  return (
    <Link
      href="/account/addresses"
      className="focus-visible:border-ring focus-visible:ring-ring/30 group block rounded-lg outline-none focus-visible:ring-2"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-zinc-900">
          <MapPinIcon className="size-5 text-zinc-500" />
          {__('account.addresses')}
        </span>
        <CaretRightIcon className="size-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
      </div>
      {defaultAddress ? (
        <AddressCard address={defaultAddress} isDefault />
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-200 p-5 text-sm text-zinc-500">
          {__('account.no_address')}
        </div>
      )}
    </Link>
  )
}
