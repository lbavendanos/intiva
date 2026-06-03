'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PackageIcon, SquaresFourIcon, UserIcon } from '@phosphor-icons/react'

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
    href: '/account/orders',
    label: () => __('account.orders'),
    icon: PackageIcon,
    isActive: (pathname) => pathname.startsWith('/account/orders'),
  },
  {
    href: '/account/profile',
    label: () => __('account.profile'),
    icon: UserIcon,
    isActive: (pathname) =>
      pathname.startsWith('/account/profile') ||
      pathname.startsWith('/account/addresses'),
  },
]

export function AccountBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = item.isActive(pathname)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative flex flex-1 flex-col items-center gap-1 px-1 pt-2.5 pb-2 text-xs font-medium transition-colors',
              isActive ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900',
            )}
          >
            {isActive && (
              <span className="absolute inset-x-0 top-0 h-0.5 bg-zinc-900" />
            )}
            <Icon className="size-5" />
            {item.label()}
          </Link>
        )
      })}
    </nav>
  )
}

export function AccountBottomNavSkeleton() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-1 flex-col items-center gap-1 px-1 pt-2.5 pb-2"
        >
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  )
}
