'use client'

import {
  createContext,
  use,
  useOptimistic,
  useTransition,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'

import type { CustomerAddress } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import {
  deleteAddress as deleteAddressAction,
  setDefaultAddress as setDefaultAddressAction,
} from '@/actions/address'
import type { ActionResult } from '@/actions/types'

import { CustomerContext } from './customer-provider'

type AddressState = {
  addresses: CustomerAddress[]
  defaultAddressId: string | null
}

type OptimisticAction =
  | { type: 'DELETE_ADDRESS'; addressId: string }
  | { type: 'SET_DEFAULT_ADDRESS'; addressId: string }

type AddressProviderProps = {
  children: ReactNode
}

export type AddressContextValue = {
  addresses: CustomerAddress[]
  defaultAddressId: string | null
  deleteAddress: (id: string) => Promise<ActionResult>
  setDefaultAddress: (id: string) => Promise<ActionResult>
}

export const AddressContext = createContext<AddressContextValue | null>(null)

function addressReducer(
  state: AddressState,
  action: OptimisticAction,
): AddressState {
  switch (action.type) {
    case 'DELETE_ADDRESS': {
      const addresses = state.addresses.filter(
        (address) => address.id !== action.addressId,
      )
      const defaultAddressId =
        state.defaultAddressId === action.addressId
          ? null
          : state.defaultAddressId
      return { addresses, defaultAddressId }
    }
    case 'SET_DEFAULT_ADDRESS': {
      return { ...state, defaultAddressId: action.addressId }
    }
    default:
      return state
  }
}

export function AddressProvider({ children }: AddressProviderProps) {
  const customerContext = use(CustomerContext)

  if (!customerContext) {
    throw new Error('AddressProvider must be used within a CustomerProvider')
  }

  const customer = use(customerContext.customerPromise)

  const initialState: AddressState = {
    addresses: customer?.addresses ?? [],
    defaultAddressId: customer?.defaultAddress?.id ?? null,
  }

  const [optimisticState, applyOptimistic] = useOptimistic(
    initialState,
    addressReducer,
  )
  const [, startTransition] = useTransition()

  const notifyOnError = (result: ActionResult) => {
    if (!result.success) {
      toast.error(result.error || __('account.error.generic'))
    }
    return result
  }

  const deleteAddress = (id: string) => {
    return new Promise<ActionResult>((resolve) => {
      startTransition(async () => {
        applyOptimistic({ type: 'DELETE_ADDRESS', addressId: id })
        resolve(notifyOnError(await deleteAddressAction(id)))
      })
    })
  }

  const setDefaultAddress = (id: string) => {
    return new Promise<ActionResult>((resolve) => {
      startTransition(async () => {
        applyOptimistic({ type: 'SET_DEFAULT_ADDRESS', addressId: id })
        resolve(notifyOnError(await setDefaultAddressAction(id)))
      })
    })
  }

  const value: AddressContextValue = {
    addresses: optimisticState.addresses,
    defaultAddressId: optimisticState.defaultAddressId,
    deleteAddress,
    setDefaultAddress,
  }

  return <AddressContext value={value}>{children}</AddressContext>
}
