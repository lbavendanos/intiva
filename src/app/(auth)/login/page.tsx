import type { Metadata } from 'next'

import { __ } from '@/lib/utils'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: __('auth.login.title'),
  description: __('auth.login.description'),
}

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{__('auth.login.title')}</h1>
        <p className="text-muted-foreground">{__('auth.login.description')}</p>
      </div>
      <LoginForm redirectTo={redirect || '/account'} />
    </div>
  )
}
