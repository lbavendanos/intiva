import Link from 'next/link'
import { LogOut, Package, User } from 'lucide-react'

import { __ } from '@/lib/utils'
import { login, logout } from '@/actions/auth'
import { isAuthenticated } from '@/actions/session'
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
          <User className="h-5 w-5" />
        </Button>
      </form>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={__('auth.account')}>
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/account">
            <User className="mr-2 h-4 w-4" />
            {__('auth.account')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/orders">
            <Package className="mr-2 h-4 w-4" />
            {__('auth.orders')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={logout} className="w-full">
            <button type="submit" className="flex w-full items-center">
              <LogOut className="mr-2 h-4 w-4" />
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
      <User className="h-5 w-5" />
    </Button>
  )
}
