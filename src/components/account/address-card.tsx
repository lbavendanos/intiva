'use client'

import type { ReactNode } from 'react'

import { formatPhoneNumber } from '@/lib/countries/pe/phone'
import { parseAddressToUbigeo } from '@/lib/countries/pe/ubigeo'
import type { CustomerAddress } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AddressCardProps = {
  address: CustomerAddress
  isDefault?: boolean
  footer?: ReactNode
}

function formatAddressLines(address: CustomerAddress): string[] {
  const { department, province, district } = parseAddressToUbigeo(
    address.zoneCode,
    address.city,
  )

  const location = [district, province, department]
    .filter(Boolean)
    .filter((value, index, list) => value !== list[index - 1])
    .join(', ')

  return [
    address.company,
    address.address1,
    address.address2,
    location,
    address.zip,
  ].filter((line): line is string => Boolean(line))
}

export function AddressCard({ address, isDefault, footer }: AddressCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">
          {address.firstName} {address.lastName}
        </CardTitle>
        {isDefault && (
          <Badge variant="secondary">{__('addresses.default')}</Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-1 text-sm text-zinc-600">
          {formatAddressLines(address).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
          {address.phoneNumber && (
            <p>{formatPhoneNumber(address.phoneNumber)}</p>
          )}
        </div>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}
