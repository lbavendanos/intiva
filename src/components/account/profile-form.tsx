'use client'

import { useActionState } from 'react'

import { __ } from '@/lib/utils'
import { updateCustomer } from '@/actions/customer'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type ProfileFormProps = {
  firstName: string
  lastName: string
  email: string
}

export function ProfileForm({ firstName, lastName, email }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateCustomer, {
    success: false,
    customer: null,
  })

  return (
    <form action={formAction} className="space-y-6">
      {state.success && (
        <Alert>
          <AlertDescription>{__('profile.success')}</AlertDescription>
        </Alert>
      )}

      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <Field>
        <FieldLabel htmlFor="email">{__('profile.email')}</FieldLabel>
        <Input id="email" type="email" value={email} disabled />
      </Field>

      <Field>
        <FieldLabel htmlFor="firstName">{__('profile.first_name')}</FieldLabel>
        <Input
          id="firstName"
          name="firstName"
          defaultValue={firstName}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="lastName">{__('profile.last_name')}</FieldLabel>
        <Input id="lastName" name="lastName" defaultValue={lastName} required />
      </Field>

      <Button type="submit" disabled={isPending}>
        {isPending ? __('profile.saving') : __('profile.save')}
      </Button>
    </form>
  )
}
