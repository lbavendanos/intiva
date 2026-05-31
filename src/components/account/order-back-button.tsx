'use client'

import type { MouseEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@phosphor-icons/react'

import { __ } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export function OrderBackButton() {
  const router = useRouter()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === 'undefined') return
    // Only intercept when there's previous history to restore (preserves
    // query string and scroll position). Otherwise let the Link fall back
    // to the orders index for direct loads.
    if (window.history.length > 1) {
      event.preventDefault()
      router.back()
    }
  }

  return (
    <Link
      href="/account/orders"
      aria-label={__('orders.back')}
      onClick={handleClick}
      className={buttonVariants({ variant: 'ghost', size: 'icon' })}
    >
      <ArrowLeftIcon />
    </Link>
  )
}
