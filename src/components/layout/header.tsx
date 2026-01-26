import Link from 'next/link'

import { MiniCart } from '@/components/shop/mini-cart'

export function Header() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-zinc-900"
        >
          {appName}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/products"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Productos
          </Link>
          <Link
            href="/collections"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Colecciones
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <MiniCart />
        </div>
      </div>
    </header>
  )
}
