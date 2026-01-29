import type { Metadata } from 'next'

import { __ } from '@/lib/utils'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: __('auth.register.title'),
  description: __('auth.register.description'),
}

type RegisterPageProps = {
  searchParams: Promise<{ redirect?: string }>
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { redirect } = await searchParams

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{__('auth.register.title')}</h1>
        <p className="text-muted-foreground">
          {__('auth.register.description')}
        </p>
      </div>
      <RegisterForm redirectTo={redirect || '/account'} />
    </div>
  )
}
