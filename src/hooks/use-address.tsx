'use client'

import { use } from 'react'

import {
  AddressContext,
  type AddressContextValue,
} from '@/components/account/address-provider'

export function useAddress(): AddressContextValue {
  const context = use(AddressContext)

  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider')
  }

  return context
}
