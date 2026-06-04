'use client'

import { useState, type ReactElement } from 'react'

import type { Customer } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { ProfileForm } from './profile-form'

type ProfileDialogProps = {
  children: ReactElement
  customer: Customer
}

export function ProfileDialog({ children, customer }: ProfileDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{__('profile.edit')}</DialogTitle>
          <DialogDescription>
            {__('profile.edit_description')}
          </DialogDescription>
        </DialogHeader>
        <ProfileForm customer={customer} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
