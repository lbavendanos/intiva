import { __ } from '@/lib/utils'
import { getCustomerSession } from '@/actions/session'
import { Skeleton } from '@/components/ui/skeleton'

export async function AccountWelcome() {
  const customer = await getCustomerSession()
  const displayName = customer?.firstName || customer?.displayName || ''

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold">
        {displayName
          ? __('account.welcome', { name: displayName })
          : __('account.welcome_guest')}
      </h1>
      <p className="text-muted-foreground">{__('account.description')}</p>
    </div>
  )
}

export function AccountWelcomeSkeleton() {
  return (
    <div className="mb-8 space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-5 w-64" />
    </div>
  )
}
