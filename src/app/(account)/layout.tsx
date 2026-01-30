import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/actions/session'
import { Skeleton } from '@/components/ui/skeleton'

type AccountGroupLayoutProps = {
  children: React.ReactNode
}

async function AuthCheck({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/login')
  }

  return children
}

function AuthCheckSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function AccountGroupLayout({
  children,
}: AccountGroupLayoutProps) {
  return (
    <Suspense fallback={<AuthCheckSkeleton />}>
      <AuthCheck>{children}</AuthCheck>
    </Suspense>
  )
}
