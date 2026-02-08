import { cookies } from 'next/headers'
import { UserRound } from 'lucide-react'

import { SESSION_COOKIE_NAMES } from '@/lib/auth/session'
import { __ } from '@/lib/utils'
import { login, logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'

export async function AuthButton() {
  const cookieStore = await cookies()
  const isLoggedIn = !!cookieStore.get(SESSION_COOKIE_NAMES.accessToken)?.value

  return (
    <form action={isLoggedIn ? logout : login}>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label={isLoggedIn ? __('auth.logout') : __('auth.login')}
      >
        <UserRound className="h-5 w-5" />
      </Button>
    </form>
  )
}

export function AuthButtonSkeleton() {
  return (
    <Button variant="ghost" size="icon" disabled aria-label={__('auth.login')}>
      <UserRound className="h-5 w-5" />
    </Button>
  )
}
