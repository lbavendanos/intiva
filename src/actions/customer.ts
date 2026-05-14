'use server'

import { revalidatePath } from 'next/cache'

import { updateCustomer as updateCustomerMutation } from '@/lib/shopify/customer-account/mutations/customer'
import { getCustomer as getCustomerQuery } from '@/lib/shopify/customer-account/queries/customer'
import type { Customer } from '@/lib/shopify/customer-account/types'
import { __ } from '@/lib/utils'

import { getSession } from './session'

type CustomerActionResult = {
  success: boolean
  customer: Customer | null
  error?: string
}

async function getAccessToken(): Promise<string | null> {
  const session = await getSession()

  if (!session || session.expiresAt <= Date.now()) {
    return null
  }

  return session.accessToken
}

export async function getCustomer(): Promise<CustomerActionResult> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return {
      success: false,
      customer: null,
      error: __('account.error.unauthorized'),
    }
  }

  try {
    const customer = await getCustomerQuery(accessToken)
    return { success: true, customer }
  } catch {
    return {
      success: false,
      customer: null,
      error: __('account.error.generic'),
    }
  }
}

export async function updateCustomer(
  _prevState: CustomerActionResult,
  formData: FormData,
): Promise<CustomerActionResult> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return {
      success: false,
      customer: null,
      error: __('account.error.unauthorized'),
    }
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  try {
    const { userErrors } = await updateCustomerMutation(accessToken, {
      firstName,
      lastName,
    })

    if (userErrors.length > 0) {
      return {
        success: false,
        customer: null,
        error: userErrors[0].message || __('account.error.generic'),
      }
    }

    revalidatePath('/account')
    return { success: true, customer: null }
  } catch {
    return {
      success: false,
      customer: null,
      error: __('account.error.generic'),
    }
  }
}
