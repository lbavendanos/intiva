import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getCart } from '@/actions/cart'

export const metadata: Metadata = {
  title: 'Checkout',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CheckoutPage() {
  const cart = await getCart()

  if (!cart || cart.lines.length === 0) {
    redirect('/cart')
  }

  redirect(cart.checkoutUrl)
}
