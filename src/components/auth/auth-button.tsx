import Link from 'next/link'
import {
  PackageIcon,
  SignOutIcon,
  UserIcon,
} from '@phosphor-icons/react/dist/ssr'

import { login, logout } from '@/lib/actions/auth'
import { isAuthenticated } from '@/lib/auth/session'
import { __ } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export async function AuthButton() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return (
      <form action={login}>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          aria-label={__('auth.login')}
        >
          <UserIcon className="size-5" />
        </Button>
      </form>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={__('auth.account')}>
          <UserIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserIcon />
            {__('auth.account')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/orders">
            <PackageIcon />
            {__('auth.orders')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={logout} className="w-full">
            <button type="submit" className="flex w-full items-center gap-2">
              <SignOutIcon />
              {__('auth.logout')}
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AuthButtonSkeleton() {
  return (
    <Button variant="ghost" size="icon" disabled aria-label={__('auth.login')}>
      <UserIcon className="size-5" />
    </Button>
  )
}
