'use client'

import { __ } from '@/lib/utils'
import { useCustomer } from '@/hooks/use-customer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DefaultAddressCard() {
  const customer = useCustomer()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{__('account.default_address')}</CardTitle>
      </CardHeader>
      <CardContent>
        {customer?.defaultAddress ? (
          <div className="text-sm text-zinc-600">
            {customer.defaultAddress.formatted.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">{__('account.no_address')}</p>
        )}
      </CardContent>
    </Card>
  )
}
