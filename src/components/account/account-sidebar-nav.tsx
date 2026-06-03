'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MapPinIcon,
  PackageIcon,
  SquaresFourIcon,
  UserIcon,
} from '@phosphor-icons/react'

import { __, cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

type NavItem = {
  href: string
  label: () => string
  icon: React.ComponentType<{ className?: string }>
  isActive: (pathname: string) => boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/account',
    label: () => __('account.dashboard'),
    icon: SquaresFourIcon,
    isActive: (pathname) => pathname === '/account',
  },
  {
    href: '/account/profile',
    label: () => __('account.profile'),
    icon: UserIcon,
    isActive: (pathname) => pathname.startsWith('/account/profile'),
  },
  {
    href: '/account/orders',
    label: () => __('account.orders'),
    icon: PackageIcon,
    isActive: (pathname) => pathname.startsWith('/account/orders'),
  },
  {
    href: '/account/addresses',
    label: () => __('account.addresses'),
    icon: MapPinIcon,
    isActive: (pathname) => pathname.startsWith('/account/addresses'),
  },
]

export function AccountSidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.isActive(pathname)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-zinc-100 text-zinc-900'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900',
            )}
          >
            <Icon className="size-4" />
            {item.label()}
          </Link>
        )
      })}
    </nav>
  )
}

export function AccountSidebarNavSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  )
}
