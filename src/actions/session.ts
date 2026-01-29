'use server'

import { cookies } from 'next/headers'

import { getCustomer } from '@/lib/shopify/queries/customer'
import type { Customer, CustomerAccessToken } from '@/lib/shopify/types'

const CUSTOMER_ACCESS_TOKEN_COOKIE = 'customerAccessToken'
const CUSTOMER_ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function getCustomerAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value
}

export async function setCustomerAccessToken(
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

export async function deleteCustomerAccessToken(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(CUSTOMER_ACCESS_TOKEN_COOKIE)
}

export async function getCustomerSession(): Promise<Customer | null> {
  const accessToken = await getCustomerAccessToken()

  if (!accessToken) {
    return null
  }

  const customer = await getCustomer(accessToken)

  if (!customer) {
    await deleteCustomerAccessToken()
    return null
  }

  return customer
}

export async function isAuthenticated(): Promise<boolean> {
  const customer = await getCustomerSession()
  return customer !== null
}
