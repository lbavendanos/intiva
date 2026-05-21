'use server'

import { updateTag } from 'next/cache'

import { CUSTOMER_CACHE_TAG } from '@/lib/data/cache-tags'
import {
  subscribeCustomerEmailMarketing,
  unsubscribeCustomerEmailMarketing,
  updateCustomer as updateCustomerMutation,
} from '@/lib/shopify/customer-account/mutations/customer'
import { __ } from '@/lib/utils'

import { fail, ok, withAccessToken } from './_shared'
import type { ActionResult } from './types'

type UpdateCustomerInput = {
  firstName: string
  lastName: string
  acceptsMarketing: boolean
  previousMarketingState: string
}

export async function updateCustomer(
  input: UpdateCustomerInput,
): Promise<ActionResult> {
  return withAccessToken(async (accessToken) => {
    const wasSubscribed =
      input.previousMarketingState === 'SUBSCRIBED' ||
      input.previousMarketingState === 'PENDING'

    const profilePromise = updateCustomerMutation(accessToken, {
      firstName: input.firstName,
      lastName: input.lastName,
    })

    const marketingPromise =
      input.acceptsMarketing === wasSubscribed
        ? Promise.resolve({ userErrors: [] })
        : input.acceptsMarketing
          ? subscribeCustomerEmailMarketing(accessToken)
          : unsubscribeCustomerEmailMarketing(accessToken)

    const [profileResult, marketingResult] = await Promise.all([
      profilePromise,
      marketingPromise,
    ])

    const firstError =
      profileResult.userErrors[0] ?? marketingResult.userErrors[0]

    if (firstError) {
      return fail(firstError.message || __('account.error.generic'))
    }

    updateTag(CUSTOMER_CACHE_TAG)
    return ok()
  })
}
