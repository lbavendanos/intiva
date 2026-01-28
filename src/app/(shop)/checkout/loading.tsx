import { __ } from '@/lib/utils'

export default function CheckoutLoading() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="border-primary mb-4 inline-block size-8 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground">{__('checkout.redirecting')}</p>
      </div>
    </div>
  )
}
