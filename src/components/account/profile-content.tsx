'use client'

import { __ } from '@/lib/utils'
import { useCustomer } from '@/hooks/use-customer'

import { ProfileForm } from './profile-form'

export function ProfileContent() {
  const customer = useCustomer()

  if (!customer) {
    return (
      <p className="text-center text-zinc-500">{__('account.error.generic')}</p>
    )
  }

  return (
    <ProfileForm
      firstName={customer.firstName ?? ''}
      lastName={customer.lastName ?? ''}
      email={customer.emailAddress?.emailAddress ?? ''}
    />
  )
}
