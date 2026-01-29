import Link from 'next/link'
import { User } from 'lucide-react'

import { __ } from '@/lib/utils'
import { isAuthenticated } from '@/actions/session'
import { Button } from '@/components/ui/button'

export async function AuthButton() {
  const authenticated = await isAuthenticated()

  const href = authenticated ? '/account' : '/login'
  const ariaLabel = authenticated
    ? __('account.aria_label')
    : __('account.login_aria_label')

  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      aria-label={ariaLabel}
      data-testid="account-button"
    >
      <Link href={href}>
        <User className="h-5 w-5" />
      </Link>
    </Button>
  )
}

export function AuthButtonSkeleton() {
  return (
    <Button variant="ghost" size="icon" disabled aria-label="Loading account">
      <User className="h-5 w-5" />
    </Button>
  )
}
