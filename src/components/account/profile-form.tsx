'use client'

import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch, type Control } from 'react-hook-form'
import * as z from 'zod'

import type { Customer } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'
import { updateProfile } from '@/actions/account'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  acceptsMarketing: z.boolean().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

type ProfileFormProps = {
  customer: Customer
}

type MarketingCheckboxProps = {
  control: Control<ProfileFormValues>
  setValue: (
    name: 'acceptsMarketing',
    value: boolean,
    options?: { shouldValidate?: boolean; shouldDirty?: boolean },
  ) => void
}

function MarketingCheckbox({ control, setValue }: MarketingCheckboxProps) {
  const acceptsMarketing = useWatch({ control, name: 'acceptsMarketing' })

  return (
    <Field className="flex flex-row items-center gap-3">
      <Checkbox
        id="acceptsMarketing"
        checked={acceptsMarketing}
        onCheckedChange={(checked) =>
          setValue('acceptsMarketing', checked === true)
        }
      />
      <FieldLabel htmlFor="acceptsMarketing" className="font-normal">
        {__('account.profile.accepts_marketing')}
      </FieldLabel>
    </Field>
  )
}

export function ProfileForm({ customer }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: customer.firstName ?? '',
      lastName: customer.lastName ?? '',
      phone: customer.phone ?? '',
      acceptsMarketing: customer.acceptsMarketing,
    },
  })

  const handleSubmit = (data: ProfileFormValues) => {
    setSuccessMessage(null)

    startTransition(async () => {
      const result = await updateProfile({
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
        acceptsMarketing: data.acceptsMarketing,
      })

      if (result.success) {
        setSuccessMessage(__('account.profile.success'))
      } else {
        form.setError('root', { message: result.error })
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}

        {successMessage && (
          <p className="rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
            {successMessage}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.firstName}>
            <FieldLabel htmlFor="firstName">
              {__('account.profile.first_name')}
            </FieldLabel>
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder={__('account.profile.first_name_placeholder')}
              aria-invalid={!!form.formState.errors.firstName}
              {...form.register('firstName')}
            />
            {form.formState.errors.firstName && (
              <FieldError>{form.formState.errors.firstName.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.lastName}>
            <FieldLabel htmlFor="lastName">
              {__('account.profile.last_name')}
            </FieldLabel>
            <Input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder={__('account.profile.last_name_placeholder')}
              aria-invalid={!!form.formState.errors.lastName}
              {...form.register('lastName')}
            />
            {form.formState.errors.lastName && (
              <FieldError>{form.formState.errors.lastName.message}</FieldError>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">{__('account.profile.email')}</FieldLabel>
          <Input
            id="email"
            type="email"
            value={customer.email}
            disabled
            className="bg-muted"
          />
        </Field>

        <Field data-invalid={!!form.formState.errors.phone}>
          <FieldLabel htmlFor="phone">{__('account.profile.phone')}</FieldLabel>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder={__('account.profile.phone_placeholder')}
            aria-invalid={!!form.formState.errors.phone}
            {...form.register('phone')}
          />
          {form.formState.errors.phone && (
            <FieldError>{form.formState.errors.phone.message}</FieldError>
          )}
        </Field>

        <MarketingCheckbox control={form.control} setValue={form.setValue} />

        <Button type="submit" disabled={isPending}>
          {isPending
            ? __('account.profile.submitting')
            : __('account.profile.submit')}
        </Button>
      </FieldGroup>
    </form>
  )
}
