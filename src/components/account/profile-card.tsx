'use client'

import { CaretRightIcon, UserIcon } from '@phosphor-icons/react'

import type { Customer } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { useCustomer } from '@/hooks/use-customer'

import { ProfileDialog } from './profile-dialog'

function getFullName(customer: Customer): string {
  const fullName = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(' ')
  return fullName || customer.displayName
}

export function ProfileCard() {
  const customer = useCustomer()

  if (!customer) {
    return (
      <p className="text-center text-zinc-500">{__('account.error.generic')}</p>
    )
  }

  const name = getFullName(customer)
  const email = customer.emailAddress?.emailAddress

  return (
    <ProfileDialog customer={customer}>
      <button
        type="button"
        className="focus-visible:border-ring focus-visible:ring-ring/30 flex w-full items-center gap-4 rounded-lg border border-zinc-200 bg-white p-5 text-left transition-colors outline-none hover:bg-zinc-50 focus-visible:ring-2"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
          <UserIcon className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-zinc-500">
            {__('profile.personal_info')}
          </span>
          <span className="block truncate font-semibold text-zinc-900">
            {name}
          </span>
          {email && (
            <span className="block truncate text-sm text-zinc-600">
              {email}
            </span>
          )}
        </span>
        <CaretRightIcon className="size-5 shrink-0 text-zinc-400" />
      </button>
    </ProfileDialog>
  )
}
