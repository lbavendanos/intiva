'use client'

import { __ } from '@/lib/utils'
import { useCustomer } from '@/hooks/use-customer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function WelcomeCard() {
  const customer = useCustomer()

  if (!customer) {
    return (
      <p className="text-center text-zinc-500">{__('account.error.generic')}</p>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {__('account.welcome', { name: customer.displayName })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-600">
          {customer.emailAddress?.emailAddress}
        </p>
      </CardContent>
    </Card>
  )
}
