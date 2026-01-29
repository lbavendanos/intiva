'use client'

import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { __ } from '@/lib/utils'
import { recoverPassword } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const forgotPasswordSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined || issue.input === ''
        ? __('auth.validation.email_required')
        : __('auth.validation.email_invalid'),
  }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleSubmit = (data: ForgotPasswordFormValues) => {
    startTransition(async () => {
      const result = await recoverPassword(data.email)

      if (!result.success) {
        form.setError('root', {
          message: __('auth.forgot_password.error.generic'),
        })
        return
      }

      setIsSuccess(true)
    })
  }

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">
          {__('auth.forgot_password.success')}
        </p>
        <a href="/login" className="text-primary hover:underline">
          {__('auth.forgot_password.back_to_login')}
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}

        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="email">
            {__('auth.forgot_password.email')}
          </FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={__('auth.forgot_password.email_placeholder')}
            aria-invalid={!!form.formState.errors.email}
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          )}
        </Field>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? __('auth.forgot_password.submitting')
            : __('auth.forgot_password.submit')}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          <a href="/login" className="text-primary hover:underline">
            {__('auth.forgot_password.back_to_login')}
          </a>
        </p>
      </FieldGroup>
    </form>
  )
}
