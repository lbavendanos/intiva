'use client'

import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import type { Customer } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'
import { updateCustomer } from '@/actions/customer'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type ProfileFormProps = {
  customer: Customer
}

function isMarketingSubscribed(state: string): boolean {
  return state === 'SUBSCRIBED' || state === 'PENDING'
}

function createFormSchema() {
  return z.object({
    firstName: z.string().min(1, __('profile.first_name_required')),
    lastName: z.string().min(1, __('profile.last_name_required')),
    acceptsMarketing: z.boolean(),
  })
}

export function ProfileForm({ customer }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [showSuccess, setShowSuccess] = useState(false)

  const email = customer.emailAddress?.emailAddress ?? ''
  const marketingState = customer.emailAddress?.marketingState ?? ''

  const formSchema = createFormSchema()
  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: customer.firstName ?? '',
      lastName: customer.lastName ?? '',
      acceptsMarketing: isMarketingSubscribed(marketingState),
    },
  })

  const handleSubmit = (values: FormValues) => {
    setShowSuccess(false)

    startTransition(async () => {
      const result = await updateCustomer({
        firstName: values.firstName,
        lastName: values.lastName,
        acceptsMarketing: values.acceptsMarketing,
        previousMarketingState: marketingState,
      })

      if (!result.success) {
        form.setError('root', {
          message: result.error || __('account.error.generic'),
        })
        return
      }

      setShowSuccess(true)
    })
  }

  return (
    <form
      id="profile-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      noValidate
    >
      <FieldGroup>
        {showSuccess && (
          <Alert>
            <AlertDescription>{__('profile.success')}</AlertDescription>
          </Alert>
        )}

        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <Field>
          <FieldLabel htmlFor="email">{__('profile.email')}</FieldLabel>
          <Input id="email" type="email" value={email} disabled />
        </Field>

        <Field data-invalid={!!form.formState.errors.firstName}>
          <FieldLabel htmlFor="firstName">
            {__('profile.first_name')}
          </FieldLabel>
          <Input
            id="firstName"
            aria-invalid={!!form.formState.errors.firstName}
            {...form.register('firstName')}
          />
          {form.formState.errors.firstName && (
            <FieldError errors={[form.formState.errors.firstName]} />
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.lastName}>
          <FieldLabel htmlFor="lastName">{__('profile.last_name')}</FieldLabel>
          <Input
            id="lastName"
            aria-invalid={!!form.formState.errors.lastName}
            {...form.register('lastName')}
          />
          {form.formState.errors.lastName && (
            <FieldError errors={[form.formState.errors.lastName]} />
          )}
        </Field>

        <Controller
          control={form.control}
          name="acceptsMarketing"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Checkbox
                id="acceptsMarketing"
                checked={field.value}
                onCheckedChange={(value) => field.onChange(value === true)}
              />
              <FieldLabel htmlFor="acceptsMarketing" className="font-normal">
                {__('profile.accepts_marketing')}
              </FieldLabel>
            </Field>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? __('profile.saving') : __('profile.save')}
        </Button>
      </FieldGroup>
    </form>
  )
}
