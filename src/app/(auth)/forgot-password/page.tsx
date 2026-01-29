import type { Metadata } from 'next'

import { __ } from '@/lib/utils'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: __('auth.forgot_password.title'),
  description: __('auth.forgot_password.description'),
}

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">
          {__('auth.forgot_password.title')}
        </h1>
        <p className="text-muted-foreground">
          {__('auth.forgot_password.description')}
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
