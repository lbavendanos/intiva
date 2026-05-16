import { Suspense } from 'react'
import type { Metadata } from 'next'

import { getCustomer } from '@/lib/data/customer'
import { __ } from '@/lib/utils'
import { ProfileForm } from '@/components/account/profile-form'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: __('profile.title'),
}

async function ProfileContent() {
  const customer = await getCustomer()

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

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-24" />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-zinc-900">
        {__('profile.title')}
      </h2>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  )
}
