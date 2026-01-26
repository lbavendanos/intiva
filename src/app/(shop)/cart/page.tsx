import type { Metadata } from 'next'

import { __ } from '@/lib/utils'
import { CartContent } from '@/components/shop'

export const metadata: Metadata = {
  title: __('cart.page_title'),
  description: __('cart.page_description'),
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">{__('cart.page_title')}</h1>
      <CartContent />
    </div>
  )
}
