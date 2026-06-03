type DateTimeProps<T extends React.ElementType = 'time'> = {
  as?: T
  value: string | number | Date
  format?: Intl.DateTimeFormatOptions
} & Omit<React.ComponentProps<T>, 'children' | 'as'>

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

export function DateTime<T extends React.ElementType = 'time'>({
  as,
  value,
  format = DEFAULT_FORMAT,
  ...props
}: DateTimeProps<T>) {
  const Component = as ?? 'time'
  const appLocale = process.env.NEXT_PUBLIC_APP_LOCALE
  const appTimeZone = process.env.NEXT_PUBLIC_APP_TIMEZONE
  const date = value instanceof Date ? value : new Date(value)
  const formatted = date.toLocaleString(appLocale, {
    timeZone: appTimeZone,
    ...format,
  })

  const timeProps = Component === 'time' ? { dateTime: date.toISOString() } : {}

  return (
    <Component {...timeProps} {...props}>
      {formatted}
    </Component>
  )
}
