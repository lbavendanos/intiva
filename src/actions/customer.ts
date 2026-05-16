'use server'

import { updateTag } from 'next/cache'

import { CUSTOMER_CACHE_TAG } from '@/lib/data/customer'
import { updateCustomer as updateCustomerMutation } from '@/lib/shopify/customer-account/mutations/customer'
import { __ } from '@/lib/utils'

import { fail, ok, withAccessToken, type ActionResult } from './_shared'

export async function updateCustomer(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  return withAccessToken(async (accessToken) => {
    const { userErrors } = await updateCustomerMutation(accessToken, {
      firstName,
      lastName,
    })

    if (userErrors.length > 0) {
      return fail(userErrors[0].message || __('account.error.generic'))
    }

    updateTag(CUSTOMER_CACHE_TAG)
    return ok()
  })
}
