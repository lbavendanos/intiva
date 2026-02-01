'use client'

import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import type { Customer } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'
import { updateCustomer } from '@/actions/customer'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
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
      const result = await updateCustomer({
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
          <Alert variant="success">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
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

        <Controller
          name="acceptsMarketing"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <Checkbox
                id="acceptsMarketing"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldContent>
                <FieldLabel htmlFor="acceptsMarketing">
                  <FieldTitle>
                    {__('account.profile.accepts_marketing')}
                  </FieldTitle>
                </FieldLabel>
              </FieldContent>
            </Field>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending
            ? __('account.profile.submitting')
            : __('account.profile.submit')}
        </Button>
      </FieldGroup>
    </form>
  )
}
