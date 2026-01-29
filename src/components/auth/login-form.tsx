'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
  email: z
    .string()
    .min(1, { error: __('auth.validation.email_required') })
    .email({ error: __('auth.validation.email_invalid') }),
  password: z
    .string()
    .min(1, { error: __('auth.validation.password_required') }),
})

type LoginFormValues = z.infer<typeof loginSchema>

type LoginFormProps = {
  redirectTo?: string
}

export function LoginForm({ redirectTo = '/account' }: LoginFormProps) {
  const router = useRouter()
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
      const result = await login(data.email, data.password)

      if (!result.success) {
        form.setError('root', { message: result.error })
        return
      }

      router.push(redirectTo)
      router.refresh()
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}

        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="email">{__('auth.login.email')}</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={__('auth.login.email_placeholder')}
            aria-invalid={!!form.formState.errors.email}
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.password}>
          <FieldLabel htmlFor="password">
            {__('auth.login.password')}
          </FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder={__('auth.login.password_placeholder')}
            aria-invalid={!!form.formState.errors.password}
            {...form.register('password')}
          />
          {form.formState.errors.password && (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          )}
          <FieldDescription>
            <a href="/forgot-password" className="text-primary hover:underline">
              {__('auth.login.forgot_password')}
            </a>
          </FieldDescription>
        </Field>

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
