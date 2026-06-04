import { Suspense } from 'react'
import type { Metadata } from 'next'

import { __ } from '@/lib/utils'
import { AddressSummaryCard } from '@/components/account/address-summary-card'
import { ProfileCard } from '@/components/account/profile-card'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: __('profile.title'),
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
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
        <div className="space-y-4">
          <ProfileCard />
          <AddressSummaryCard />
        </div>
      </Suspense>
    </div>
  )
}
