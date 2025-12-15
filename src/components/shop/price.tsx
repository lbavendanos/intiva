import { Money } from '@/lib/shopify/types'

type PriceProps = React.ComponentProps<'span'> & Money

export function Price({ amount, currencyCode, ...props }: PriceProps) {
  const locale = process.env.APP_LOCALE || 'en-US'

  return (
    <span {...props}>
      {new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
      }).format(parseFloat(amount))}
    </span>
  )
}
