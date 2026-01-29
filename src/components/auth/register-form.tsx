'use client'

import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import { __ } from '@/lib/utils'
import { register } from '@/actions/auth'
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

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { error: __('auth.validation.first_name_required') }),
    lastName: z
      .string()
      .min(1, { error: __('auth.validation.last_name_required') }),
    email: z
      .string()
      .min(1, { error: __('auth.validation.email_required') })
      .email({ error: __('auth.validation.email_invalid') }),
    password: z.string().min(8, { error: __('auth.validation.password_min') }),
    confirmPassword: z
      .string()
      .min(1, { error: __('auth.validation.password_required') }),
    acceptsMarketing: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: __('auth.validation.password_mismatch'),
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptsMarketing: false,
    },
  })

  const handleSubmit = (data: RegisterFormValues) => {
    startTransition(async () => {
      const result = await register(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.acceptsMarketing,
      )

      if (!result.success) {
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

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.firstName}>
            <FieldLabel htmlFor="firstName">
              {__('auth.register.first_name')}
            </FieldLabel>
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder={__('auth.register.first_name_placeholder')}
              aria-invalid={!!form.formState.errors.firstName}
              {...form.register('firstName')}
            />
            {form.formState.errors.firstName && (
              <FieldError>{form.formState.errors.firstName.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.lastName}>
            <FieldLabel htmlFor="lastName">
              {__('auth.register.last_name')}
            </FieldLabel>
            <Input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder={__('auth.register.last_name_placeholder')}
              aria-invalid={!!form.formState.errors.lastName}
              {...form.register('lastName')}
            />
            {form.formState.errors.lastName && (
              <FieldError>{form.formState.errors.lastName.message}</FieldError>
            )}
          </Field>
        </div>

        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="email">{__('auth.register.email')}</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={__('auth.register.email_placeholder')}
            aria-invalid={!!form.formState.errors.email}
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.password}>
          <FieldLabel htmlFor="password">
            {__('auth.register.password')}
          </FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder={__('auth.register.password_placeholder')}
            aria-invalid={!!form.formState.errors.password}
            {...form.register('password')}
          />
          {form.formState.errors.password && (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword">
            {__('auth.register.confirm_password')}
          </FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder={__('auth.register.confirm_password_placeholder')}
            aria-invalid={!!form.formState.errors.confirmPassword}
            {...form.register('confirmPassword')}
          />
          {form.formState.errors.confirmPassword && (
            <FieldError>
              {form.formState.errors.confirmPassword.message}
            </FieldError>
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
                    {__('auth.register.accepts_marketing')}
                  </FieldTitle>
                </FieldLabel>
              </FieldContent>
            </Field>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? __('auth.register.submitting')
            : __('auth.register.submit')}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          {__('auth.register.has_account')}{' '}
          <a href="/login" className="text-primary hover:underline">
            {__('auth.register.login_link')}
          </a>
        </p>
      </FieldGroup>
    </form>
  )
}
