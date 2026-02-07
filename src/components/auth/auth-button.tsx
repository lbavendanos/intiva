import { cookies } from 'next/headers'
import Link from 'next/link'
import { UserRound } from 'lucide-react'

import { COOKIE_NAMES } from '@/lib/auth/session'
import { __ } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export async function AuthButton() {
  const cookieStore = await cookies()
  const isLoggedIn = !!cookieStore.get(COOKIE_NAMES.accessToken)?.value

  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      aria-label={isLoggedIn ? __('auth.logout') : __('auth.login')}
    >
      <Link href={isLoggedIn ? '/logout' : '/login'}>
        <UserRound className="h-5 w-5" />
      </Link>
    </Button>
  )
}

export function AuthButtonSkeleton() {
  return (
    <Button variant="ghost" size="icon" disabled aria-label={__('auth.login')}>
      <UserRound className="h-5 w-5" />
    </Button>
  )
}
