'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  createCustomer,
  createCustomerAccessToken,
  deleteCustomerAccessToken,
  recoverCustomer,
} from '@/lib/shopify/mutations'
import { getCustomer } from '@/lib/shopify/queries'
import type { Customer, CustomerAccessToken } from '@/lib/shopify/types'

const CUSTOMER_ACCESS_TOKEN_COOKIE = 'customerAccessToken'
const CUSTOMER_ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

async function getCustomerAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value
}

async function setCustomerAccessToken(
  accessToken: CustomerAccessToken,
): Promise<void> {
  const cookieStore = await cookies()
  const expiresAt = new Date(accessToken.expiresAt)

  cookieStore.set({
    name: CUSTOMER_ACCESS_TOKEN_COOKIE,
    value: accessToken.accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
    maxAge: CUSTOMER_ACCESS_TOKEN_MAX_AGE,
  })
}

async function deleteCustomerAccessTokenCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CUSTOMER_ACCESS_TOKEN_COOKIE)
}

export type AuthActionResult = {
  success: boolean
  error?: string
}

export type LoginActionResult = AuthActionResult & {
  customer?: Customer | null
}

export type RegisterActionResult = AuthActionResult & {
  customer?: Customer | null
}

export async function login(
  email: string,
  password: string,
): Promise<LoginActionResult> {
  const { customerAccessToken, customerUserErrors } =
    await createCustomerAccessToken({
      email,
      password,
    })

  if (customerUserErrors.length > 0) {
    const error = customerUserErrors[0]

    if (error.code === 'UNIDENTIFIED_CUSTOMER') {
      return {
        success: false,
        error: 'auth.login.error.invalid_credentials',
      }
    }

    return {
      success: false,
      error: error.message || 'auth.login.error.generic',
    }
  }

  if (!customerAccessToken) {
    return {
      success: false,
      error: 'auth.login.error.generic',
    }
  }

  await setCustomerAccessToken(customerAccessToken)

  const customer = await getCustomer(customerAccessToken.accessToken)

  return {
    success: true,
    customer,
  }
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

    if (error.code === 'TAKEN' || error.code === 'CUSTOMER_DISABLED') {
      return {
        success: false,
        error: 'auth.register.error.email_taken',
      }
    }

    return {
      success: false,
      error: error.message || 'auth.register.error.generic',
    }
  }

  if (!customer) {
    return {
      success: false,
      error: 'auth.register.error.generic',
    }
  }

  // Auto-login after registration
  const loginResult = await login(email, password)

  if (!loginResult.success) {
    return {
      success: true,
      customer,
    }
  }

  return {
    success: true,
    customer: loginResult.customer,
  }
}

export async function logout(): Promise<void> {
  const accessToken = await getCustomerAccessToken()

  if (accessToken) {
    await deleteCustomerAccessToken(accessToken)
    await deleteCustomerAccessTokenCookie()
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

export async function getCustomerSession(): Promise<Customer | null> {
  const accessToken = await getCustomerAccessToken()

  if (!accessToken) {
    return null
  }

  const customer = await getCustomer(accessToken)

  // If customer is null, the token might be expired or invalid
  if (!customer) {
    await deleteCustomerAccessTokenCookie()
    return null
  }

  return customer
}

export async function isAuthenticated(): Promise<boolean> {
  const customer = await getCustomerSession()
  return customer !== null
}
