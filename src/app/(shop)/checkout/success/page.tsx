import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

import { __ } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Order Completed',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <Alert className="mb-6">
          <CheckCircle2 className="size-5 text-green-600" />
          <AlertTitle className="text-lg">
            {__('checkout.success.title')}
          </AlertTitle>
          <AlertDescription>
            {__('checkout.success.description')}
          </AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/products">
            {__('checkout.success.continue_shopping')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
