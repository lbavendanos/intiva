'use client'

import { useState, type ReactNode } from 'react'

import type { CustomerAddress } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { AddressForm } from './address-form'

type AddressDialogProps = {
  children: ReactNode
  address?: CustomerAddress
  isDefault?: boolean
}

export function AddressDialog({
  children,
  address,
  isDefault,
}: AddressDialogProps) {
  const [open, setOpen] = useState(false)
  const isEdit = !!address

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? __('addresses.edit') : __('addresses.add')}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? __('addresses.edit_description')
              : __('addresses.add_description')}
          </DialogDescription>
        </DialogHeader>
        <AddressForm
          address={address}
          isDefault={isDefault}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
