import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CaretRightIcon, MapPinIcon } from '@phosphor-icons/react/dist/ssr'

import { __ } from '@/lib/utils'
import { ProfileContent } from '@/components/account/profile-content'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: __('profile.title'),
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
      <Link
        href="/account/addresses"
        className="mt-8 flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-4 py-3 transition-colors hover:bg-zinc-50 md:hidden"
      >
        <span className="flex items-center gap-3 text-sm font-medium text-zinc-900">
          <MapPinIcon className="size-5 text-zinc-500" />
          {__('account.addresses')}
        </span>
        <CaretRightIcon className="size-4 text-zinc-400" />
      </Link>
    </div>
  )
}
