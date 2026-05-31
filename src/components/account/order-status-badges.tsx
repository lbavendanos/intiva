import type { Maybe } from '@/lib/shopify/types'
import { __ } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type StatusVariant = 'default' | 'secondary' | 'destructive' | 'outline'

function getStatusVariant(status: string): StatusVariant {
  switch (status) {
    case 'PAID':
    case 'FULFILLED':
      return 'default'
    case 'PARTIALLY_PAID':
    case 'PARTIALLY_FULFILLED':
    case 'IN_PROGRESS':
      return 'secondary'
    case 'REFUNDED':
    case 'VOIDED':
      return 'destructive'
    default:
      return 'outline'
  }
}

function formatStatus(status: string): string {
  const key = `order.status.${status.toLowerCase()}` as Parameters<typeof __>[0]
  return __(key)
}

type OrderStatusBadgesProps = {
  financialStatus: Maybe<string>
  fulfillmentStatus: string
}

export function OrderStatusBadges({
  financialStatus,
  fulfillmentStatus,
}: OrderStatusBadgesProps) {
  return (
    <>
      {financialStatus && (
        <Badge variant={getStatusVariant(financialStatus)}>
          {formatStatus(financialStatus)}
        </Badge>
      )}
      <Badge variant={getStatusVariant(fulfillmentStatus)}>
        {formatStatus(fulfillmentStatus)}
      </Badge>
    </>
  )
}
