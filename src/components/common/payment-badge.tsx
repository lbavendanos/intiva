import type { TranslationKeys } from '@/lib/foundation/translation/translator'
import { __ } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type PaymentBadgeProps = {
  status: string
}

function getVariant(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'default'
    case 'PENDING':
    case 'AUTHORIZED':
      return 'secondary'
    case 'REFUNDED':
    case 'PARTIALLY_REFUNDED':
    case 'VOIDED':
      return 'destructive'
    default:
      return 'outline'
  }
}

function getLabel(status: string): string {
  const key =
    `orders.financial_status.${status.toLowerCase()}` as TranslationKeys
  return __(key)
}

export function PaymentBadge({ status }: PaymentBadgeProps) {
  return <Badge variant={getVariant(status)}>{getLabel(status)}</Badge>
}
