import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/actions/session'

type AuthFormLayoutProps = {
  children: React.ReactNode
}

async function AuthFormCheck({ children }: { children: React.ReactNode }) {
  if (await isAuthenticated()) {
    redirect('/account')
  }

  return children
}

export default function AuthFormLayout({ children }: AuthFormLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense
          fallback={<div className="bg-muted h-96 animate-pulse rounded-lg" />}
        >
          <AuthFormCheck>{children}</AuthFormCheck>
        </Suspense>
      </div>
    </div>
  )
}
