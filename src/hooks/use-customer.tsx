'use client'

import { use } from 'react'

import type { Customer } from '@/lib/shopify/customer-account/types'
import { CustomerContext } from '@/components/account/customer-provider'

export function useCustomer(): Customer | null {
  const context = use(CustomerContext)

  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider')
  }

  return use(context.customerPromise)
}
