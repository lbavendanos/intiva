import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { SESSION_COOKIE_NAMES } from '@/lib/auth/session'
import { getOAuthDiscoveryConfig } from '@/lib/shopify/customer/discovery'
import { url } from '@/lib/utils'

export async function GET(): Promise<never> {
  const cookieStore = await cookies()
  const idToken = cookieStore.get(SESSION_COOKIE_NAMES.idToken)?.value

  if (!idToken) {
    redirect('/')
  }

  const config = await getOAuthDiscoveryConfig()

  const logoutUrl = new URL(config.end_session_endpoint)
  logoutUrl.searchParams.set('id_token_hint', idToken)
  logoutUrl.searchParams.set('post_logout_redirect_uri', url('/').toString())

  for (const name of Object.values(SESSION_COOKIE_NAMES)) {
    cookieStore.delete(name)
  }

  redirect(logoutUrl.toString())
}
