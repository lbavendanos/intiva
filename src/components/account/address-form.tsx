'use client'

import { useActionState } from 'react'

import type { CustomerAddress } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { createAddress, updateAddress } from '@/actions/account'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type AddressFormProps = {
  address?: CustomerAddress
  isDefault?: boolean
}

export function AddressForm({ address, isDefault }: AddressFormProps) {
  const action = address ? updateAddress.bind(null, address.id) : createAddress

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
  })

  return (
    <form action={formAction} className="space-y-6">
      {state.success && (
        <Alert variant="success">
          <AlertDescription>{__('address.success')}</AlertDescription>
        </Alert>
      )}

      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="firstName">
            {__('address.first_name')}
          </FieldLabel>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={address?.firstName ?? ''}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">{__('address.last_name')}</FieldLabel>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={address?.lastName ?? ''}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="company">{__('address.company')}</FieldLabel>
        <Input
          id="company"
          name="company"
          defaultValue={address?.company ?? ''}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="address1">{__('address.address1')}</FieldLabel>
        <Input
          id="address1"
          name="address1"
          defaultValue={address?.address1 ?? ''}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="address2">{__('address.address2')}</FieldLabel>
        <Input
          id="address2"
          name="address2"
          defaultValue={address?.address2 ?? ''}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="city">{__('address.city')}</FieldLabel>
          <Input
            id="city"
            name="city"
            defaultValue={address?.city ?? ''}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="zoneCode">{__('address.zone_code')}</FieldLabel>
          <Input
            id="zoneCode"
            name="zoneCode"
            defaultValue={address?.zoneCode ?? ''}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="territoryCode">
            {__('address.territory_code')}
          </FieldLabel>
          <Input
            id="territoryCode"
            name="territoryCode"
            defaultValue={address?.territoryCode ?? ''}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="zip">{__('address.zip')}</FieldLabel>
          <Input
            id="zip"
            name="zip"
            defaultValue={address?.zip ?? ''}
            required
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="phoneNumber">
          {__('address.phone_number')}
        </FieldLabel>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          defaultValue={address?.phoneNumber ?? ''}
        />
      </Field>

      {!isDefault && (
        <div className="flex items-center gap-2">
          <Checkbox id="defaultAddress" name="defaultAddress" />
          <label htmlFor="defaultAddress" className="text-sm text-zinc-700">
            {__('address.set_as_default')}
          </label>
        </div>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending
          ? __('address.saving')
          : address
            ? __('addresses.edit')
            : __('addresses.add')}
      </Button>
    </form>
  )
}
