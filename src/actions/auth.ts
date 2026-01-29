'use server'

import { redirect } from 'next/navigation'

import {
  createCustomer,
  createCustomerAccessToken,
  recoverCustomer,
  deleteCustomerAccessToken as revokeCustomerAccessToken,
} from '@/lib/shopify/mutations/customer'
import type { Customer } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'

import {
  deleteCustomerAccessToken,
  getCustomerAccessToken,
  setCustomerAccessToken,
} from './session'

type AuthActionResult = {
  success: boolean
  error?: string
}

type LoginActionResult = AuthActionResult & {
  customer?: Customer | null
}

type RegisterActionResult = AuthActionResult & {
  customer?: Customer | null
}

const CUSTOMER_ERROR_CODE = {
  UNIDENTIFIED_CUSTOMER: 'UNIDENTIFIED_CUSTOMER',
  TAKEN: 'TAKEN',
  CUSTOMER_DISABLED: 'CUSTOMER_DISABLED',
} as const

export async function login(
  email: string,
  password: string,
  redirectTo: string = '/account',
): Promise<LoginActionResult> {
  const { customerAccessToken, customerUserErrors } =
    await createCustomerAccessToken({
      email,
      password,
    })

  if (customerUserErrors.length > 0) {
    const error = customerUserErrors[0]

    if (error.code === CUSTOMER_ERROR_CODE.UNIDENTIFIED_CUSTOMER) {
      return {
        success: false,
        error: __('auth.login.error.invalid_credentials'),
      }
    }

    return {
      success: false,
      error: error.message || __('auth.login.error.generic'),
    }
  }

  if (!customerAccessToken) {
    return {
      success: false,
      error: __('auth.login.error.generic'),
    }
  }

  await setCustomerAccessToken(customerAccessToken)

  redirect(redirectTo)
}

export async function register(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  acceptsMarketing?: boolean,
): Promise<RegisterActionResult> {
  const { customer, customerUserErrors } = await createCustomer({
    email,
    password,
    firstName,
    lastName,
    acceptsMarketing,
  })

  if (customerUserErrors.length > 0) {
    const error = customerUserErrors[0]

    if (
      error.code === CUSTOMER_ERROR_CODE.TAKEN ||
      error.code === CUSTOMER_ERROR_CODE.CUSTOMER_DISABLED
    ) {
      return {
        success: false,
        error: __('auth.register.error.email_taken'),
      }
    }

    return {
      success: false,
      error: error.message || __('auth.register.error.generic'),
    }
  }

  if (!customer) {
    return {
      success: false,
      error: __('auth.register.error.generic'),
    }
  }

  // Auto-login after registration
  const loginResult = await login(email, password, '/account')

  // If login fails, return the error (redirect happens in login on success)
  return loginResult
}

export async function logout(): Promise<void> {
  const accessToken = await getCustomerAccessToken()

  if (accessToken) {
    await revokeCustomerAccessToken(accessToken)
    await deleteCustomerAccessToken()
  }

  redirect('/login')
}

export async function recoverPassword(
  email: string,
): Promise<AuthActionResult> {
  const { customerUserErrors } = await recoverCustomer(email)

  if (customerUserErrors.length > 0) {
    // We don't expose whether the email exists for security reasons
    // Still return success to prevent email enumeration attacks
    return {
      success: true,
    }
  }

  return {
    success: true,
  }
}
