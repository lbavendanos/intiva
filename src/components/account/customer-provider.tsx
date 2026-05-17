'use client'

import { createContext, type ReactNode } from 'react'

import type { Customer } from '@/lib/shopify/customer-account/types'

type CustomerContextValue = {
  customerPromise: Promise<Customer | null>
}

export const CustomerContext = createContext<CustomerContextValue | null>(null)

type CustomerProviderProps = {
  children: ReactNode
  customerPromise: Promise<Customer | null>
}

export function CustomerProvider({
  children,
  customerPromise,
}: CustomerProviderProps) {
  return (
    <CustomerContext value={{ customerPromise }}>{children}</CustomerContext>
  )
}
