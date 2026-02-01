'use client'

import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import { __ } from '@/lib/utils'
import { login } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const loginSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined || issue.input === ''
        ? __('auth.validation.email_required')
        : __('auth.validation.email_invalid'),
  }),
  password: z.string().min(1, __('auth.validation.password_required')),
})

type LoginFormValues = z.infer<typeof loginSchema>

type LoginFormProps = {
  redirectTo?: string
}

export function LoginForm({ redirectTo = '/account' }: LoginFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      const result = await login(data.email, data.password, redirectTo)

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

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {__('auth.login.email')}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="email"
                autoComplete="email"
                placeholder={__('auth.login.email_placeholder')}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {__('auth.login.password')}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                autoComplete="current-password"
                placeholder={__('auth.login.password_placeholder')}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <FieldDescription>
                <a
                  href="/forgot-password"
                  className="text-primary hover:underline"
                >
                  {__('auth.login.forgot_password')}
                </a>
              </FieldDescription>
            </Field>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? __('auth.login.submitting') : __('auth.login.submit')}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          {__('auth.login.no_account')}{' '}
          <a href="/register" className="text-primary hover:underline">
            {__('auth.login.register_link')}
          </a>
        </p>
      </FieldGroup>
    </form>
  )
}
