import type { TranslationKeys } from '@/lib/foundation/translation/translator'
import { __ } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type ShippingBadgeProps = {
  status: string
}

function getVariant(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status.toUpperCase()) {
    case 'FULFILLED':
      return 'default'
    case 'IN_PROGRESS':
    case 'PARTIALLY_FULFILLED':
    case 'PENDING_FULFILLMENT':
      return 'secondary'
    case 'UNFULFILLED':
    case 'ON_HOLD':
      return 'outline'
    default:
      return 'outline'
  }
}

function getLabel(status: string): string {
  const key =
    `orders.fulfillment_status.${status.toLowerCase()}` as TranslationKeys
  return __(key)
}

export function ShippingBadge({ status }: ShippingBadgeProps) {
  return <Badge variant={getVariant(status)}>{getLabel(status)}</Badge>
}
