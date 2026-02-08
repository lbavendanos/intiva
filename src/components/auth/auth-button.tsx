import { UserRound } from 'lucide-react'

import { __ } from '@/lib/utils'
import { login, logout } from '@/actions/auth'
import { isAuthenticated } from '@/actions/session'
import { Button } from '@/components/ui/button'

export async function AuthButton() {
  const authenticated = await isAuthenticated()

  return (
    <form action={authenticated ? logout : login}>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label={authenticated ? __('auth.logout') : __('auth.login')}
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
