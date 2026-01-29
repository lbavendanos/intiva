'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, Package, User } from 'lucide-react'

import { __, cn } from '@/lib/utils'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'

const navItems = [
  {
    href: '/account',
    label: __('account.nav.dashboard'),
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/account/profile',
    label: __('account.nav.profile'),
    icon: User,
  },
  {
    href: '/orders',
    label: __('account.nav.orders'),
    icon: Package,
  },
]

export function AccountNav() {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href, item.exact)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        )
      })}

      <form action={handleLogout}>
        <Button
          type="submit"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive w-full justify-start gap-3 px-3"
        >
          <LogOut className="size-4" />
          {__('account.nav.logout')}
        </Button>
      </form>
    </nav>
  )
}
