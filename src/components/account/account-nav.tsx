'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MapPin, Package, User } from 'lucide-react'

import { __, cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    href: '/account',
    label: () => __('account.dashboard'),
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/account/profile',
    label: () => __('account.profile'),
    icon: User,
    exact: false,
  },
  {
    href: '/account/orders',
    label: () => __('account.orders'),
    icon: Package,
    exact: false,
  },
  {
    href: '/account/addresses',
    label: () => __('account.addresses'),
    icon: MapPin,
    exact: false,
  },
] as const

export function AccountNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900',
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label()}
          </Link>
        )
      })}
    </nav>
  )
}
