'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'

import { useCustomer } from '@/hooks/use-customer'

import { AddressForm } from './address-form'

type AddressEditContentProps = {
  params: Promise<{ id: string }>
}

export function AddressEditContent({ params }: AddressEditContentProps) {
  const { id } = use(params)
  const addressId = decodeURIComponent(id)
  const customer = useCustomer()

  if (!customer) {
    notFound()
  }

  const address = customer.addresses.find((a) => a.id === addressId)

  if (!address) {
    notFound()
  }

  const isDefault = customer.defaultAddress?.id === addressId

  return <AddressForm address={address} isDefault={isDefault} />
}
