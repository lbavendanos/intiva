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
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {__('account.profile.first_name')}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="text"
                  autoComplete="given-name"
                  placeholder={__('account.profile.first_name_placeholder')}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {__('account.profile.last_name')}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="text"
                  autoComplete="family-name"
                  placeholder={__('account.profile.last_name_placeholder')}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
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

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {__('account.profile.phone')}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="tel"
                autoComplete="tel"
                placeholder={__('account.profile.phone_placeholder')}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
